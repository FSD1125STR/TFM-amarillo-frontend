const formatTime = (t) => t?.slice(0, 5) || "";

const serializeDay = (d) => {
  if (!d || d.closed) return "closed";
  if (d.split && d.afternoon?.open && d.afternoon?.close) {
    return `${formatTime(d.open)}-${formatTime(d.close)}|${formatTime(d.afternoon.open)}-${formatTime(d.afternoon.close)}`;
  }
  return `${formatTime(d.open)}-${formatTime(d.close)}`;
};

const DAYS_ES = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

const DAY_LABEL = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

export const ScheduleDisplay = ({ schedule }) => {
  const todayIndex = new Date().getDay(); // 0 domingo
  const todayMapIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  const todayName = DAYS_ES[todayMapIndex];
  const todayData = schedule?.[todayName];

  const isOpenNow = () => {
  if (!todayData || todayData.closed) return false;

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  const checkRange = (openStr, closeStr) => {
    if (!openStr || !closeStr) return false;

    const [oh, om] = openStr.split(":").map(Number);
    const [ch, cm] = closeStr.split(":").map(Number);

    let openTime = oh * 60 + om;
    let closeTime = ch * 60 + cm;

    // Si cierra después de medianoche (ej: 00:00 o 02:00)
    if (closeTime <= openTime) {
      closeTime += 1440; // suma 24h
      if (current < openTime) {
        return current + 1440 <= closeTime;
      }
    }

    return current >= openTime && current <= closeTime;
  };

  // Horario normal
  if (!todayData.split) {
    return checkRange(todayData.open, todayData.close);
  }

  // Horario partido
  return (
    checkRange(todayData.open, todayData.close) ||
    checkRange(todayData.afternoon?.open, todayData.afternoon?.close)
  );
};

  const open = isOpenNow();

  // Agrupar días consecutivos con mismo horario
  const groups = [];
  DAYS_ES.forEach((day) => {
    const sig = serializeDay(schedule?.[day] || { closed: true });
    const last = groups[groups.length - 1];

    if (last && last.sig === sig) {
      last.days.push(day);
    } else {
      groups.push({ sig, days: [day], data: schedule?.[day] });
    }
  });

  return (
    <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 w-full max-w-sm">
      {/* TITULO */}
      <div className="flex items-center gap-2 mb-4"></div>

      {/* Estado actual */}
      <div className="mb-6">
        {open ? (
          <p className="text-green-400 font-semibold">
            Abierto hasta las {formatTime(todayData?.close)}
          </p>
        ) : (
          <p className="text-red-400 font-semibold">Cerrado ahora</p>
        )}
      </div>

      {/* Lista agrupada */}
      <div className="space-y-2 text-sm">
        {groups.map(({ days, data, sig }, i) => {
          const first = DAY_LABEL[days[0]];
          const last = DAY_LABEL[days[days.length - 1]];
          const dayLabel = days.length === 1 ? first : `${first} – ${last}`;

          let hoursLabel;

          if (sig === "closed") {
            hoursLabel = <span className="text-neutral-500">Cerrado</span>;
          } else if (
            data?.split &&
            data?.afternoon?.open &&
            data?.afternoon?.close
          ) {
            hoursLabel = (
              <span className="text-neutral-300">
                {formatTime(data.open)}–{formatTime(data.close)}
                <span className="text-neutral-500 mx-1">/</span>
                {formatTime(data.afternoon.open)}–
                {formatTime(data.afternoon.close)}
              </span>
            );
          } else {
            hoursLabel = (
              <span className="text-neutral-300">
                {formatTime(data?.open)}–{formatTime(data?.close)}
              </span>
            );
          }

          return (
            <div
              key={i}
              className={`flex justify-between py-1 ${
                days.includes(todayName)
                  ? "text-white font-semibold"
                  : "text-neutral-400"
              }`}
            >
              <span>{dayLabel}</span>
              {hoursLabel}
            </div>
          );
        })}
      </div>
    </div>
  );
};
