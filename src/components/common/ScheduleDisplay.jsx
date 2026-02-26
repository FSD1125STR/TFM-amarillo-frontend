


// Agrupa días consecutivos con exactamente el mismo horario
const formatTime = t => t?.slice(0, 5) || ''; // "09:00" desde "09:00:00" o ya limpio

const serializeDay = (d) => {
   if (d.closed) {return 'closed';}
   if (d.split && d.afternoon?.open && d.afternoon?.close) {
      return `${formatTime(d.open)}-${formatTime(d.close)}|${formatTime(d.afternoon.open)}-${formatTime(d.afternoon.close)}`;
   }
   return `${formatTime(d.open)}-${formatTime(d.close)}`;
};

const DAYS_ES = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DAY_LABEL = {
   lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
   jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
};

export const ScheduleDisplay = ({ schedule }) => {
   // Agrupar días consecutivos con el mismo horario
   const groups = [];
   DAYS_ES.forEach(day => {
      const sig = serializeDay(schedule[day] || { closed: true });
      const last = groups[groups.length - 1];
      if (last && last.sig === sig) {
         last.days.push(day);
      } else {
         groups.push({ sig, days: [day], data: schedule[day] });
      }
   });

   return (
      <div className="space-y-1 mt-2">
         {groups.map(({ days, data, sig }, i) => {
            // Etiqueta de días
            const first = DAY_LABEL[days[0]];
            const last  = DAY_LABEL[days[days.length - 1]];
            const dayLabel = days.length === 1 ? first : `${first}–${last}`;

            // Etiqueta de horas
            let hoursLabel;
            if (sig === 'closed') {
               hoursLabel = <span className="text-neutral-500">Cerrado</span>;
            } else if (data.split && data.afternoon?.open && data.afternoon?.close) {
               hoursLabel = (
                  <span className="text-neutral-300">
                     {formatTime(data.open)}–{formatTime(data.close)}
                     <span className="text-neutral-500 mx-1">/</span>
                     {formatTime(data.afternoon.open)}–{formatTime(data.afternoon.close)}
                  </span>
               );
            } else {
               hoursLabel = (
                  <span className="text-neutral-300">
                     {formatTime(data.open)}–{formatTime(data.close)}
                  </span>
               );
            }

            return (
               <div key={i} className="flex justify-between text-sm">
                  <span className="font-medium text-neutral-200 w-20">{dayLabel}</span>
                  {hoursLabel}
               </div>
            );
         })}
      </div>
   );
};