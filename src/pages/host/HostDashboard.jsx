import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CircleCheck, CircleDashed, House } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { establishmentService } from "../../services/establishmentService";

const shellStyle = {
   background:
    "radial-gradient(900px 500px at 90% -10%, rgba(255, 116, 43, 0.16), transparent 58%), linear-gradient(180deg, #150b07, #0f0805 65%)",
};

const formatLocation = (address) => {
   if (!address) {return "Pendiente de completar";}

   const parts = [address.street, address.number, address.postalCode, address.city, address.province]
      .filter(Boolean);
   return parts.length ? parts.join(", ") : "Pendiente de completar";
};

export function HostDashboard() {
   const { user } = useAuth();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [establishment, setEstablishment] = useState(null);

   useEffect(() => {
      const loadDashboard = async () => {
         try {
            setLoading(true);
            const response = await establishmentService.getMine();
            setEstablishment(response?.data || null);
         } catch (err) {
            setError(err?.response?.data?.message || "No se pudo cargar tu dashboard");
         } finally {
            setLoading(false);
         }
      };

      loadDashboard();
   }, []);

   const isComplete = useMemo(() => Boolean(establishment), [establishment]);

   return (
      <section className="min-h-screen px-4 pb-10 pt-8 text-slate-100" style={shellStyle}>
         <div className="mx-auto w-full max-w-[980px]">
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
               <div>
                  <h1 className="m-0 text-3xl font-bold tracking-tight sm:text-4xl">Dashboard Hostelero</h1>
                  <p className="mt-1.5 text-slate-400">Hola {user?.name}. Este es tu panel de gestion.</p>
               </div>

               <div className="flex gap-2.5">
                  <Link
                     to="/"
                     className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[#33405e] bg-[#171d2b] px-3.5 text-sm font-semibold text-slate-200 no-underline"
                  >
                     <House size={16} className="mr-1.5" />
              Ver zona publica
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
                     <>
                        <CircleCheck size={14} />
                Local detectado
                     </>
                  ) : (
                     <>
                        <CircleDashed size={14} />
                Local pendiente
                     </>
                  )}
               </span>
            </div>

            {loading && (
               <div className="grid min-h-[260px] place-items-center text-slate-400">
            Cargando estado del local...
               </div>
            )}

            {!loading && error && <p className="mt-3.5 text-rose-300">{error}</p>}

            {!loading && !error && !establishment && (
               <section className="rounded-[22px] border border-dashed border-[#f77827]/60 bg-[#582510]/25 p-6">
                  <h2 className="m-0 text-3xl font-bold tracking-tight">Tu dashboard esta listo para empezar</h2>
                  <p className="mb-4 mt-2 text-slate-300">
              No encontramos un establecimiento completo asociado a tu cuenta. De momento te
              dejamos este estado vacio para continuar con la configuracion.
                  </p>
                  <ol className="m-0 list-decimal space-y-1.5 pl-5 text-slate-200">
                     <li>Completa datos principales del local.</li>
                     <li>Sube logo/fotos y define direccion final.</li>
                     <li>Configura horario, tapas y publicacion.</li>
                  </ol>
               </section>
            )}

            {!loading && !error && establishment && (
               <section
                  className="rounded-[22px] border border-[#273752] p-6"
                  style={{
                     background:
                "linear-gradient(180deg, rgba(21, 29, 44, 0.84), rgba(16, 21, 32, 0.84))",
                  }}
               >
                  <h2 className="m-0 text-3xl font-bold tracking-tight">{establishment.name}</h2>
                  <div className="mt-3.5 grid gap-2.5 text-slate-200">
                     <div>
                        <strong>Direccion:</strong> {formatLocation(establishment.address)}
                     </div>
                     <div>
                        <strong>Telefono:</strong> {establishment.phone || "Pendiente"}
                     </div>
                     <div>
                        <strong>Estado:</strong> {establishment.active ? "Activo" : "Desactivado"} ·{" "}
                        {establishment.verified ? "Verificado" : "Pendiente de validacion"}
                     </div>
                  </div>
               </section>
            )}
         </div>
      </section>
   );
}

