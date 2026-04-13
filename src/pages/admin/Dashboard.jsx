// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { Store, Ticket, Bell, Wifi, WifiOff } from "lucide-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { couponService } from "../../services/couponService";
import { establishmentService } from "../../services/establishmentService";
import { WsStatusBadge } from "./adminComponents/WsStatusBadge";
import { AdminEstablishmentCard } from "./adminComponents/AdminEstablishmentCard";
import { AdminCouponCard } from "./adminComponents/AdminCouponCard";

const shellStyle = {
  background:
    "radial-gradient(900px 500px at 90% -10%, rgba(255, 116, 43, 0.12), transparent 58%), linear-gradient(180deg, #0d1219, #080d13 80%)",
};

export const Dashboard = () => {
  const [establishments, setEstablishments] = useState([]);
  const [coupons, setCoupons]               = useState([]);

  const { connected, notifications, clearNotification } = useWebSocket({ role: "admin" });

  // ── Carga inicial — establecimientos y cupones pendientes ───────────────────
  useEffect(() => {
    const loadPendingEstablishments = async () => {
      try {
        const response = await establishmentService.getPending();
        const items = response?.data || [];
        setEstablishments(items.map((e) => ({
          id:                e._id,
          establishmentId:   e._id,
          type:              "new_establishment_pending",
          name:              e.name,
          email:             e.email,
          timestamp:         e.createdAt,
        })));
      } catch (err) {
        console.error("Error al cargar establecimientos pendientes:", err);
      }
    };
    loadPendingEstablishments();
  }, []);

  useEffect(() => {
    const loadPending = async () => {
      try {
        const response = await couponService.getPending();
        const items = response?.data || [];
        setCoupons(items.map((c) => ({
          id:             c._id,
          couponId:       c._id,
          type:           "coupon_pending_validation",
          clientName:     c.client?.name  || "Cliente",
          clientEmail:    c.client?.email || "",
          establishment:  c.establishment?.name || "Establecimiento",
          baseAmount:     c.reservation?.totalAmount || c.baseAmount,
          discountAmount: c.discountAmount,
          timestamp:      c.createdAt,
        })));
      } catch (err) {
        console.error("Error al cargar cupones pendientes:", err);
      }
    };
    loadPending();
  }, []);

  // ── Procesar notificaciones WS ────────────────────────────────────────────
  useEffect(() => {
    notifications.forEach((notif) => {
      if (notif.type === "new_establishment_pending") {
        setEstablishments((prev) => {
          const exists = prev.some((n) => n.establishmentId === notif.establishmentId);
          return exists ? prev : [notif, ...prev];
        });
        clearNotification(notif.id);
      }

      if (notif.type === "coupon_pending_validation") {
        setCoupons((prev) => {
          const exists = prev.some((n) => n.couponId === notif.couponId);
          return exists ? prev : [notif, ...prev];
        });
        clearNotification(notif.id);
      }
    });
  }, [notifications, clearNotification]);

  // ── Acciones ──────────────────────────────────────────────────────────────

  const handleVerifyEstablishment = async (notif) => {
    try {
      await establishmentService.verify(notif.establishmentId);
      setEstablishments((prev) => prev.filter((n) => n.establishmentId !== notif.establishmentId));
    } catch (err) {
      console.error("Error al verificar establecimiento:", err);
    }
  };

  const handleRejectEstablishment = async (notif) => {
    try {
      await establishmentService.reject(notif.establishmentId);
      setEstablishments((prev) => prev.filter((n) => n.establishmentId !== notif.establishmentId));
    } catch (err) {
      console.error("Error al rechazar establecimiento:", err);
    }
  };

  const handleValidateCoupon = async (notif) => {
    try {
      await couponService.validate(notif.couponId);
      setCoupons((prev) => prev.filter((n) => n.couponId !== notif.couponId));
    } catch (err) {
      console.error("Error al validar cupón:", err);
    }
  };

  const handleRejectCoupon = async (notif, reason) => {
    try {
      await couponService.reject(notif.couponId, reason);
      setCoupons((prev) => prev.filter((n) => n.couponId !== notif.couponId));
    } catch (err) {
      console.error("Error al rechazar cupón:", err);
    }
  };

  const handleDismiss = (id) => {
    setEstablishments((prev) => prev.filter((n) => n.id !== id));
    setCoupons((prev) => prev.filter((n) => n.id !== id));
  };

  const totalPending = establishments.length + coupons.length;

  return (
    <div className="min-h-screen px-4 pb-12 pt-6 text-slate-100" style={shellStyle}>
      <div className="mx-auto w-full max-w-3xl">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="m-0 text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">Bienvenido al panel de administración</p>
          </div>
          <WsStatusBadge connected={connected} />
        </header>

        {/* ── Métricas ────────────────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { icon: <Store size={17} />,  label: "Establecimientos", value: establishments.length, color: "text-[#f77827]" },
            { icon: <Ticket size={17} />, label: "Cupones",          value: coupons.length,        color: "text-emerald-400" },
            { icon: <Bell size={17} />,   label: "Total pendiente",  value: totalPending,          color: "text-amber-400" },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="rounded-2xl border border-[#2a374f] bg-[#0d1219]/80 px-4 py-3">
              <div className={`mb-1 ${color}`}>{icon}</div>
              <p className="text-2xl font-bold text-slate-100">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Sin notificaciones ──────────────────────────────────────────── */}
        {totalPending === 0 && (
          <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-[#2a374f] text-center">
            <div>
              <Bell size={32} className="mx-auto mb-2 text-slate-700" />
              <p className="text-sm text-slate-500">No hay notificaciones pendientes</p>
              {!connected && (
                <p className="mt-1.5 text-xs text-rose-400/70">
                  Sin conexión — las notificaciones no llegarán en tiempo real
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Establecimientos pendientes ─────────────────────────────────── */}
        {establishments.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
              <Store size={14} className="text-[#f77827]" />
              Establecimientos pendientes
              <span className="rounded-full bg-[#f77827] px-2 py-0.5 text-xs text-white">
                {establishments.length}
              </span>
            </h2>
            <div className="space-y-2.5">
              {establishments.map((notif) => (
                <AdminEstablishmentCard
                  key={notif.establishmentId || notif.id}
                  notif={notif}
                  onVerify={handleVerifyEstablishment}
                  onReject={handleRejectEstablishment}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Cupones pendientes ──────────────────────────────────────────── */}
        {coupons.length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
              <Ticket size={14} className="text-emerald-400" />
              Cupones pendientes de validación
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">
                {coupons.length}
              </span>
            </h2>
            <div className="space-y-2.5">
              {coupons.map((notif) => (
                <AdminCouponCard
                  key={notif.couponId || notif.id}
                  notif={notif}
                  onValidate={handleValidateCoupon}
                  onReject={handleRejectCoupon}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};