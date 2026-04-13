import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AboutTeaser({ className = "" }) {
   const navigate = useNavigate();

   return (
      <section className={`mt-8 px-4 ${className}`} aria-labelledby="home-about-teaser-title">
         <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.3)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="relative">
               <p className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-300">
                  <Sparkles size={12} />
                  Sobre nexTapa
               </p>

               <h2 id="home-about-teaser-title" className="mt-3 text-xl font-black text-white">
                  Conoce quiénes somos
               </h2>
               <p className="mt-2 max-w-2xl text-sm text-neutral-300">
                  Descubre nuestra historia, lo que nos mueve y cómo ayudamos a conectar personas con los mejores planes de tapeo.
               </p>

               <button
                  type="button"
                  onClick={() => navigate("/nosotros")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
               >
                  Ir a Nosotros
                  <ArrowRight size={16} />
               </button>
            </div>
         </div>
      </section>
   );
}
