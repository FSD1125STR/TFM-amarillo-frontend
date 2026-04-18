import { Link, useLocation } from "react-router-dom";
import { Home, Search, UtensilsCrossed, ArrowRight } from "lucide-react";

export function NotFoundPage() {
   const location = useLocation();
   const triedPath = location.pathname;

   return (
      <div className="relative min-h-screen overflow-hidden pb-28 pt-6 sm:pb-32 sm:pt-10">
         <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
            <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px] sm:h-96 sm:w-96" />
            <div className="absolute -right-24 bottom-32 h-64 w-64 rounded-full bg-orange-600/10 blur-[90px] sm:h-80 sm:w-80" />
            <div className="absolute left-1/2 top-1/2 h-px w-[120%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] bg-gradient-to-r from-transparent via-orange-500/15 to-transparent" />
         </div>

         <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 sm:px-6">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/25 bg-[#2A1E16]/80 shadow-[0_0_40px_-8px_rgba(255,105,0,0.35)] sm:mb-8 sm:h-20 sm:w-20">
               <UtensilsCrossed className="h-8 w-8 text-orange-500 sm:h-9 sm:w-9" strokeWidth={1.75} />
            </div>

            <p
               className="select-none text-[clamp(5.5rem,22vw,11rem)] font-black leading-none tracking-tighter text-transparent sm:tracking-tight"
               style={{
                  backgroundImage:
                     "linear-gradient(180deg, rgba(255,140,60,0.95) 0%, rgba(255,90,0,0.55) 45%, rgba(42,30,22,0.9) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
               }}
               aria-hidden
            >
               404
            </p>

            <h1 className="mt-2 text-center text-2xl font-bold tracking-tight text-white sm:mt-3 sm:text-3xl md:text-4xl">
               Esta tapa no está en el menú
            </h1>

            <p className="mt-3 max-w-md text-center text-[15px] leading-relaxed text-neutral-400 sm:mt-4 sm:text-base">
               La página que buscas no existe o ha cambiado de sitio. Vuelve al inicio o explora
               establecimientos y tapas desde el buscador.
            </p>

            {triedPath && triedPath !== "/" && (
               <p className="mt-5 max-w-full truncate rounded-xl border border-white/[0.06] bg-[#1A120B]/80 px-4 py-2.5 text-center font-mono text-xs text-neutral-500 sm:text-sm">
                  <span className="text-neutral-600">Ruta: </span>
                  {triedPath}
               </p>
            )}

            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center">
               <Link
                  to="/"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-[15px] font-bold text-white no-underline shadow-lg shadow-orange-900/30 transition-all hover:bg-orange-600 active:scale-[0.99] sm:flex-initial sm:min-w-[160px]"
               >
                  <Home className="h-5 w-5 shrink-0" strokeWidth={2} />
                  Ir al inicio
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5" />
               </Link>

               <Link
                  to="/search"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-[#2A1E16]/90 px-5 py-3.5 text-[15px] font-semibold text-neutral-100 no-underline backdrop-blur-sm transition-colors hover:border-orange-500/35 hover:bg-[#35261c] active:scale-[0.99] sm:flex-initial sm:min-w-[160px]"
               >
                  <Search className="h-5 w-5 shrink-0 text-orange-400" strokeWidth={2} />
                  Buscar
               </Link>
            </div>

            <Link
               to="/nosotros"
               className="mt-6 text-sm font-medium text-orange-400/90 no-underline transition-colors hover:text-orange-300"
            >
               Conocer nexTapa
            </Link>

            <div className="mt-12 grid w-full max-w-2xl gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
               {[
                  { to: "/establishments", label: "Locales", hint: "Descubre sitios" },
                  { to: "/items", label: "Tapas", hint: "Platos y ofertas" },
                  { to: "/profile", label: "Cuenta", hint: "Inicia sesión" },
               ].map((item) => (
                  <Link
                     key={item.to}
                     to={item.to}
                     className="rounded-2xl border border-white/[0.06] bg-[#2A1E16]/60 p-4 text-left no-underline transition-colors hover:border-orange-500/25 hover:bg-[#2A1E16] sm:p-5"
                  >
                     <p className="text-sm font-bold text-white">{item.label}</p>
                     <p className="mt-1 text-xs text-neutral-500">{item.hint}</p>
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
}