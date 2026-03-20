// src/pages/host/HostDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  House,
  CircleCheck,
  CircleDashed,
  Wifi,
  WifiOff,
  BellRing,
  CalendarClock,
  Users,
  Clock,
  CheckCheck,
  X,
  ChevronDown,
  ChevronUp,
  ReceiptText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { establishmentService } from "../../services/establishmentService";
import { reservationService } from "../../services/reservationService";
import { useWebSocket } from "../../hooks/useWebSocket";

const shellStyle = {
  background:
    "radial-gradient(900px 500px at 90% -10%, rgba(255, 116, 43, 0.16), transparent 58%), linear-gradient(180deg, #150b07, #0f0805 65%)",
};

const formatLocation = (address) => {
  if (!address) return "Pendiente de completar";
  const parts = [
    address.street,
    address.number,
    address.postalCode,
    address.city,
    address.province,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "Pendiente de completar";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const formatTime = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function WsStatusBadge({ connected }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tracking-wide transition-colors ${
        connected
          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
          : "border-rose-500/40 bg-rose-500/15 text-rose-300"
      }`}
    >
      {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
      {connected ? "Tiempo real activo" : "Sin conexión"}
    </span>
  );
}

function CompleteFormModal({ reservation, onSubmit, onClose }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setError("Introduce un importe válido mayor que 0");
      return;
    }
    onSubmit(reservation.reservationId || reservation._id, val);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className="w-full max-w-sm rounded-2xl border border-[#2a374f] p-6"
        style={{ background: "linear-gradient(180deg, #131823, #0f1520)" }}
      >
        <h3 className="mb-1 text-lg font-bold text-slate-100">
          Completar reserva
        </h3>
        <p className="mb-4 text-sm text-slate-400">
          Introduce el importe final de la cuenta. Se generará un cupón del{" "}
          <span className="font-bold text-[#f77827]">5%</span> para el cliente.
        </p>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">
          Importe total (€)
        </label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Ej: 48.50"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          className="mb-1 w-full rounded-xl border border-[#2a374f] bg-[#0d1219] px-4 py-2.5 text-slate-100 outline-none focus:border-[#f77827]/60 focus:ring-1 focus:ring-[#f77827]/30"
        />
        {error && <p className="mb-3 text-xs text-rose-400">{error}</p>}
        {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
          <p className="mb-4 text-xs text-slate-400">
            Cupón generado:{" "}
            <span className="font-bold text-emerald-400">
              {(parseFloat(amount) * 0.05).toFixed(2)} €
            </span>
          </p>
        )}
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#2a374f] bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-[#1a2235]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-[#f77827] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e06a1e]"
          >
            Confirmar y generar cupón
          </button>
        </div>
      </div>
    </div>
  );
}

function ReservationCard({ reservation, onConfirm, onReject, onComplete }) {
  const [expanded, setExpanded] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const statusConfig = {
    pending: {
      label: "Pendiente",
      color: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    },
    confirmed: {
      label: "Confirmada",
      color: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    },
    rejected: {
      label: "Rechazada",
      color: "border-rose-500/40 bg-rose-500/15 text-rose-300",
    },
    completed: {
      label: "Completada",
      color: "border-slate-500/40 bg-slate-500/15 text-slate-400",
    },
    cancelled: {
      label: "Cancelada",
      color: "border-slate-500/40 bg-slate-500/15 text-slate-500",
    },
  };

  const cfg = statusConfig[reservation.status] || statusConfig.pending;

  return (
    <div className="rounded-2xl border border-[#2a374f] bg-[#0d1219]/80 transition-all">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {reservation._isNew && (
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#f77827]" />
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-100">
              {reservation.client?.name || reservation.clientName || "Cliente"}
            </p>
            <p className="text-xs text-slate-500">
              {formatDate(reservation.date)} · {reservation.time} ·{" "}
              {reservation.guests}{" "}
              {reservation.guests === 1 ? "persona" : "personas"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${cfg.color}`}
          >
            {cfg.label}
          </span>
          {expanded ? (
            <ChevronUp size={14} className="text-slate-500" />
          ) : (
            <ChevronDown size={14} className="text-slate-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#1e2d42] px-4 pb-4 pt-3">
          <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-slate-500">Fecha</p>
              <p className="font-medium text-slate-200">
                {formatDate(reservation.date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Hora</p>
              <p className="font-medium text-slate-200">{reservation.time}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Comensales</p>
              <p className="font-medium text-slate-200">{reservation.guests}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Recibida</p>
              <p className="font-medium text-slate-200">
                {formatTime(reservation.timestamp || reservation.createdAt)}
              </p>
            </div>
          </div>

          {reservation.notes && (
            <div className="mb-3 rounded-xl border border-[#1e2d42] bg-[#080d13] px-3 py-2 text-sm text-slate-300">
              <p className="mb-0.5 text-xs text-slate-500">Nota del cliente</p>
              {reservation.notes}
            </div>
          )}

          {reservation.status === "pending" && (
            <div className="space-y-2">
              {rejecting ? (
                <div className="space-y-2">
                  <textarea
                    placeholder="Motivo del rechazo (opcional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-[#2a374f] bg-[#0d1219] px-3 py-2 text-sm text-slate-100 outline-none focus:border-rose-500/50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRejecting(false)}
                      className="flex-1 rounded-xl border border-[#2a374f] py-2 text-sm text-slate-400 hover:bg-[#1a2235]"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => onReject(reservation._id, reason)}
                      className="flex-1 rounded-xl border border-rose-500/50 bg-rose-500/10 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/20"
                    >
                      Confirmar rechazo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setRejecting(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/20"
                  >
                    <X size={14} /> Rechazar
                  </button>
                  <button
                    onClick={() => onConfirm(reservation._id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f77827] py-2 text-sm font-bold text-white hover:bg-[#e06a1e]"
                  >
                    <CheckCheck size={14} /> Confirmar reserva
                  </button>
                </div>
              )}
            </div>
          )}

          {reservation.status === "confirmed" && (
            <button
              onClick={() => onComplete(reservation)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20"
            >
              <ReceiptText size={14} /> Marcar como completada e introducir
              importe
            </button>
          )}

          {reservation.status === "completed" && reservation.totalAmount && (
            <p className="text-xs text-slate-500">
              Importe:{" "}
              <span className="text-slate-300">
                {reservation.totalAmount.toFixed(2)} €
              </span>{" "}
              · Cupón generado:{" "}
              <span className="text-emerald-400">
                {(reservation.totalAmount * 0.05).toFixed(2)} €
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function HostDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [establishment, setEstablishment] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [completeTarget, setCompleteTarget] = useState(null);

  const { connected, notifications, clearNotification } = useWebSocket({
    role: "establishment",
    userId: user?._id || user?.id,
  });

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await establishmentService.getMine();
        const est = response?.data || null;
        setEstablishment(est);

        if (est?._id) {
          const resReservations = await reservationService.getByEstablishment(
            est._id,
          );
          setReservations(resReservations?.data || []);
        }
      } catch (err) {
        if (err?.response?.status === 404) {
          setEstablishment(null);
        } else {
          setError(
            err?.response?.data?.message || "No se pudo cargar tu dashboard",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ── Notificaciones WS ─────────────────────────────────────────────────────
  useEffect(() => {
    notifications.forEach((notif) => {
      if (notif.type === "new_reservation") {
        setReservations((prev) => {
          const exists = prev.some((r) => r._id === notif.reservationId);
          if (exists) return prev;
          return [
            {
              ...notif,
              _id: notif.reservationId,
              status: "pending",
              _isNew: true,
            },
            ...prev,
          ];
        });
        clearNotification(notif.id);
      }
      if (notif.type === "reservation_cancelled") {
        setReservations((prev) =>
          prev.map((r) =>
            r._id === notif.reservationId ? { ...r, status: "cancelled" } : r,
          ),
        );
        clearNotification(notif.id);
      }
    });
  }, [notifications, clearNotification]);

  // ── Acciones ──────────────────────────────────────────────────────────────
  const handleConfirm = async (reservationId) => {
    try {
      await reservationService.confirm(reservationId);
      setReservations((prev) =>
        prev.map((r) =>
          r._id === reservationId
            ? { ...r, status: "confirmed", _isNew: false }
            : r,
        ),
      );
    } catch (err) {
      console.error("Error al confirmar reserva:", err);
    }
  };

  const handleReject = async (reservationId, reason) => {
    try {
      await reservationService.reject(reservationId, reason);
      setReservations((prev) =>
        prev.map((r) =>
          r._id === reservationId
            ? {
                ...r,
                status: "rejected",
                rejectionReason: reason,
                _isNew: false,
              }
            : r,
        ),
      );
    } catch (err) {
      console.error("Error al rechazar reserva:", err);
    }
  };

  const handleComplete = async (reservationId, totalAmount) => {
    try {
      await reservationService.complete(reservationId, totalAmount);
      setReservations((prev) =>
        prev.map((r) =>
          r._id === reservationId
            ? { ...r, status: "completed", totalAmount }
            : r,
        ),
      );
    } catch (err) {
      console.error("Error al completar reserva:", err);
    }
  };

  // ── Filtrado ──────────────────────────────────────────────────────────────
  const filteredReservations = useMemo(() => {
    if (filter === "all") return reservations;
    return reservations.filter((r) => r.status === filter);
  }, [reservations, filter]);

  const pendingCount = reservations.filter(
    (r) => r.status === "pending",
  ).length;
  const confirmedCount = reservations.filter(
    (r) => r.status === "confirmed",
  ).length;
  const isComplete = Boolean(establishment);

  return (
    <section
      className="min-h-screen px-4 pb-10 pt-8 text-slate-100"
      style={shellStyle}
    >
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="m-0 text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard Hostelero
            </h1>
            <p className="mt-1.5 text-slate-400">
              Hola {user?.name}. Este es tu panel de gestión.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <WsStatusBadge connected={connected} />
            <Link
              to="/"
              className="inline-flex min-h-10.5 items-center justify-center rounded-xl border border-[#33405e] bg-[#171d2b] px-3.5 text-sm font-semibold text-slate-200 no-underline"
            >
              <House size={16} className="mr-1.5" />
              Ver zona pública
            </Link>
          </div>
        </header>

        <div className="mb-4 rounded-2xl border border-[#2a374f] bg-[#131823]/70 p-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tracking-wide ${
              isComplete
                ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                : "border-amber-500/40 bg-amber-500/20 text-amber-300"
            }`}
          >
            {isComplete ? (
              <CircleCheck size={14} />
            ) : (
              <CircleDashed size={14} />
            )}
            {isComplete ? "Local detectado" : "Local pendiente"}
          </span>
        </div>

        {loading && (
          <div className="grid min-h-65 place-items-center text-slate-400">
            Cargando estado del local...
          </div>
        )}
        {!loading && error && <p className="mt-3.5 text-rose-300">{error}</p>}

        {!loading && !error && !establishment && (
          <section className="rounded-[22px] border border-dashed border-[#f77827]/60 bg-[#582510]/25 p-6">
            <h2 className="m-0 text-3xl font-bold tracking-tight">
              Tu dashboard está listo para empezar
            </h2>
            <p className="mb-4 mt-2 text-slate-300">
              No encontramos un establecimiento completo asociado a tu cuenta.
            </p>
            <ol className="m-0 list-decimal space-y-1.5 pl-5 text-slate-200">
              <li>Completa datos principales del local.</li>
              <li>Sube logo/fotos y define dirección final.</li>
              <li>Configura horario, tapas y publicación.</li>
            </ol>
          </section>
        )}

        {!loading && !error && establishment && (
          <div className="space-y-4">
            <section
              className="rounded-[22px] border border-[#273752] p-6"
              style={{
                background:
                  "linear-gradient(180deg, rgba(21, 29, 44, 0.84), rgba(16, 21, 32, 0.84))",
              }}
            >
              <h2 className="m-0 text-3xl font-bold tracking-tight">
                {establishment.name}
              </h2>
              <div className="mt-3.5 grid gap-2.5 text-slate-200">
                <div>
                  <strong>Dirección:</strong>{" "}
                  {formatLocation(establishment.address)}
                </div>
                <div>
                  <strong>Teléfono:</strong>{" "}
                  {establishment.phone || "Pendiente"}
                </div>
                <div>
                  <strong>Estado:</strong>{" "}
                  {establishment.active ? "Activo" : "Desactivado"} ·{" "}
                  {establishment.verified
                    ? "Verificado"
                    : "Pendiente de validación"}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                {
                  icon: <BellRing size={18} />,
                  label: "Pendientes",
                  value: pendingCount,
                  color: "text-amber-400",
                },
                {
                  icon: <CalendarClock size={18} />,
                  label: "Confirmadas",
                  value: confirmedCount,
                  color: "text-emerald-400",
                },
                {
                  icon: <Users size={18} />,
                  label: "Total hoy",
                  value: reservations.length,
                  color: "text-[#f77827]",
                },
              ].map(({ icon, label, value, color }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#2a374f] bg-[#0d1219]/80 px-4 py-3"
                >
                  <div className={`mb-1 ${color}`}>{icon}</div>
                  <p className="text-2xl font-bold text-slate-100">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            <section className="rounded-[22px] border border-[#2a374f] bg-[#0a1018]/60 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="m-0 flex items-center gap-2 text-lg font-bold text-slate-100">
                  <Clock size={18} className="text-[#f77827]" />
                  Reservas en tiempo real
                  {pendingCount > 0 && (
                    <span className="rounded-full bg-[#f77827] px-2 py-0.5 text-xs font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </h3>
                <div className="flex rounded-xl border border-[#2a374f] bg-[#0d1219] p-0.5 text-xs font-semibold">
                  {[
                    { key: "pending", label: "Pendientes" },
                    { key: "confirmed", label: "Confirmadas" },
                    { key: "all", label: "Todas" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`rounded-[10px] px-3 py-1.5 transition-colors ${
                        filter === key
                          ? "bg-[#f77827] text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredReservations.length === 0 ? (
                <div className="grid min-h-32 place-items-center text-slate-500">
                  <div className="text-center">
                    <CalendarClock
                      size={32}
                      className="mx-auto mb-2 opacity-30"
                    />
                    <p className="text-sm">
                      {filter === "pending"
                        ? "No hay reservas pendientes"
                        : filter === "confirmed"
                          ? "No hay reservas confirmadas"
                          : "No hay reservas registradas"}
                    </p>
                    {!connected && (
                      <p className="mt-1 text-xs text-rose-400/70">
                        Sin conexión en tiempo real — las nuevas reservas no
                        aparecerán automáticamente
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredReservations.map((reservation, idx) => (
                    <ReservationCard
                      key={reservation._id || idx}
                      reservation={reservation}
                      onConfirm={handleConfirm}
                      onReject={handleReject}
                      onComplete={(res) => setCompleteTarget(res)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {completeTarget && (
        <CompleteFormModal
          reservation={completeTarget}
          onSubmit={handleComplete}
          onClose={() => setCompleteTarget(null)}
        />
      )}
    </section>
  );
}
