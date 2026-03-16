// src/components/home/FeaturedSection.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { itemService } from "../../services/itemService";
import { cloudinaryPresets } from "../../utils/cloudinaryHelpers.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_IMAGE = "/Logo.png";

export const FeaturedSection = () => {
   const [featuredItems, setFeaturedItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [canLeft, setCanLeft] = useState(false);
   const [canRight, setCanRight] = useState(true);
   const scrollRef = useRef(null);
   const navigate = useNavigate();

   useEffect(() => {
      const load = async () => {
         try {
            setLoading(true);
            setError(null);
            const response = await itemService.getTopRatedItems();
            setFeaturedItems((response.data || response).slice(0, 10));
         } catch (err) {
            setError("Error al cargar las tapas destacadas.");
         } finally {
            setLoading(false);
         }
      };
      load();
   }, []);

   const checkScroll = () => {
      const el = scrollRef.current;
      if (!el) {return;}
      setCanLeft(el.scrollLeft > 8);
      setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
   };

   useEffect(() => {
      const el = scrollRef.current;
      if (!el) {return;}
      checkScroll();
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
         el.removeEventListener("scroll", checkScroll);
         window.removeEventListener("resize", checkScroll);
      };
   }, [featuredItems]);

   const scroll = (dir) => {
      scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
   };

   if (loading) {
      return (
         <section className="px-4 mt-6">
            <div className="flex items-center justify-between mb-3">
               <h2 className="text-lg font-semibold">Las Mejores Tapas</h2>
            </div>
            <div className="flex gap-3 overflow-hidden">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-none w-36 rounded-2xl bg-neutral-900 animate-pulse h-40" />
               ))}
            </div>
         </section>
      );
   }

   if (error) {return (
      <section className="px-4 mt-6">
         <p className="text-red-500 text-sm text-center">{error}</p>
      </section>
   );}

   if (featuredItems.length === 0) {return null;}

   return (
      <section className="px-4 mt-6">
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Tapas mejor valoradas</h2>
            <button
               onClick={() => navigate("/items")}
               className="text-orange-400 text-sm font-medium hover:text-orange-300 transition-colors"
            >
               Ver todas
            </button>
         </div>

         <div className="relative group">
            {canLeft && (
               <button
                  onClick={() => scroll(-1)}
                  className="
                     absolute -left-3 top-1/2 -translate-y-5 z-10
                     w-8 h-8 rounded-full
                     flex items-center justify-center
                     bg-neutral-800 border border-neutral-700 text-neutral-400
                     opacity-0 group-hover:opacity-100
                     hover:bg-orange-500 hover:border-orange-500 hover:text-white
                     transition-all duration-200 shadow-lg
                  "
                  aria-label="Anterior"
               >
                  <ChevronLeft size={16} />
               </button>
            )}

            {canRight && (
               <button
                  onClick={() => scroll(1)}
                  className="
                     absolute -right-3 top-1/2 -translate-y-5 z-10
                     w-8 h-8 rounded-full
                     flex items-center justify-center
                     bg-neutral-800 border border-neutral-700 text-neutral-400
                     opacity-0 group-hover:opacity-100
                     hover:bg-orange-500 hover:border-orange-500 hover:text-white
                     transition-all duration-200 shadow-lg
                  "
                  aria-label="Siguiente"
               >
                  <ChevronRight size={16} />
               </button>
            )}

            <div
               ref={scrollRef}
               className="
                  flex gap-3 overflow-x-auto pb-2
                  snap-x snap-mandatory
                  [&::-webkit-scrollbar]:hidden
                  [-ms-overflow-style:none]
                  [scrollbar-width:none]
               "
            >
               {featuredItems.map((item, index) => {
                  // Tapa no disponible o local cerrado
                  const unavailable =
                     item.available === false ||
                     item.servedToday === false ||
                     item.establishment?.isOpen === false;

                  // Etiqueta mínima — solo el motivo más relevante
                  const unavailableLabel =
                     item.establishment?.isOpen === false
                        ? "Cerrado"
                        : item.servedToday === false
                           ? "Hoy No"
                           : "No disponible";

                  return (
                     <button
                        key={item._id || index}
                        onClick={() => navigate(`/items/${item.slug}`)}
                        className="
                           group/card relative flex-none w-36
                           snap-start overflow-hidden rounded-2xl
                           bg-neutral-900 border border-neutral-800
                           hover:border-orange-500/40
                           transition-all duration-300
                        "
                     >
                        {/* Imagen */}
                        <div className="relative overflow-hidden">
                           <img
                              src={cloudinaryPresets.tapaCard(item.mainImage || DEFAULT_IMAGE)}
                              alt={item.name}
                              className={`w-full h-28 object-cover group-hover/card:scale-105 transition-transform duration-500 ${
                                 unavailable ? "brightness-50" : ""
                              }`}
                              onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                           />

                           {/* Overlay sutil — solo cuando no disponible */}
                           {unavailable && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="text-[10px] font-semibold text-white/80 tracking-wide uppercase">
                                    {unavailableLabel}
                                 </span>
                              </div>
                           )}
                        </div>

                        {/* Datos */}
                        <div className="p-2.5">
                           <p className={`text-xs font-semibold line-clamp-1 ${unavailable ? "text-neutral-500" : "text-white"}`}>
                              {item.name}
                           </p>
                           <p className={`text-xs mt-0.5 font-medium ${unavailable ? "text-neutral-600" : "text-orange-400"}`}>
                              {item.modalities?.[0]?.price > 0
                                 ? `${item.modalities[0].price}€`
                                 : "Gratis"}
                           </p>
                        </div>
                     </button>
                  );
               })}
            </div>
         </div>
      </section>
   );
};
