import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { itemService } from "../../services/itemService";
import { cloudinaryPresets } from "../../utils/cloudinaryHelpers.js";

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
         } catch {
            setError("Error al cargar las tapas destacadas.");
         } finally {
            setLoading(false);
         }
      };

      load();
   }, []);

   const checkScroll = () => {
      const el = scrollRef.current;
      if (!el) {
         return;
      }

      setCanLeft(el.scrollLeft > 8);
      setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
   };

   useEffect(() => {
      const el = scrollRef.current;
      if (!el) {
         return;
      }

      checkScroll();
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);

      return () => {
         el.removeEventListener("scroll", checkScroll);
         window.removeEventListener("resize", checkScroll);
      };
   }, [featuredItems]);

   const scroll = (direction) => {
      scrollRef.current?.scrollBy({ left: direction * 220, behavior: "smooth" });
   };

   if (loading) {
      return (
         <section id="home-featured" className="mt-8 px-4">
            <div className="mb-3 flex items-center justify-between">
               <h2 className="text-lg font-semibold">Tapas mejor valoradas</h2>
            </div>
            <div className="flex gap-3 overflow-hidden">
               {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-48 w-40 flex-none animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900" />
               ))}
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section id="home-featured" className="mt-8 px-4">
            <p className="text-center text-sm text-red-400">{error}</p>
         </section>
      );
   }

   if (featuredItems.length === 0) {
      return null;
   }

   return (
      <section id="home-featured" className="mt-8 px-4">
         <div className="mb-3 flex items-center justify-between">
            <div>
               <h2 className="text-lg font-semibold text-white">Tapas mejor valoradas</h2>
               <p className="text-xs text-neutral-500">Lo que más gusta cerca de ti</p>
            </div>

            <button
               type="button"
               onClick={() => navigate("/items")}
               className="text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
            >
               Ver todas
            </button>
         </div>

         <div className="group relative">
            {canLeft && (
               <button
                  type="button"
                  onClick={() => scroll(-1)}
                  className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-800 p-1.5 text-neutral-300 opacity-0 transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 hover:text-white group-hover:opacity-100"
                  aria-label="Anterior"
               >
                  <ChevronLeft size={16} />
               </button>
            )}

            {canRight && (
               <button
                  type="button"
                  onClick={() => scroll(1)}
                  className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-800 p-1.5 text-neutral-300 opacity-0 transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 hover:text-white group-hover:opacity-100"
                  aria-label="Siguiente"
               >
                  <ChevronRight size={16} />
               </button>
            )}

            <div
               ref={scrollRef}
               className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
               {featuredItems.map((item, index) => {
                  const unavailable =
                     item.available === false ||
                     item.servedToday === false ||
                     item.establishment?.isOpen === false;

                  const unavailableLabel =
                     item.establishment?.isOpen === false
                        ? "Cerrado"
                        : item.servedToday === false
                           ? "No hoy"
                           : "No disponible";

                  return (
                     <button
                        key={item._id || index}
                        type="button"
                        onClick={() => navigate(`/items/${item.slug}`)}
                        className="group/card w-40 flex-none snap-start overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 text-left transition-all duration-200 hover:border-orange-500/40"
                     >
                        <div className="relative overflow-hidden">
                           <img
                              src={cloudinaryPresets.tapaCard(item.mainImage || DEFAULT_IMAGE)}
                              alt={item.name}
                              className={`h-28 w-full object-cover transition-transform duration-500 group-hover/card:scale-105 ${
                                 unavailable ? "brightness-50" : ""
                              }`}
                              onError={(event) => {
                                 event.target.onerror = null;
                                 event.target.src = DEFAULT_IMAGE;
                              }}
                           />

                           {unavailable && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
                                    {unavailableLabel}
                                 </span>
                              </div>
                           )}
                        </div>

                        <div className="p-2.5">
                           <p className={`line-clamp-1 text-xs font-semibold ${unavailable ? "text-neutral-500" : "text-white"}`}>
                              {item.name}
                           </p>
                           <p className="mt-1 line-clamp-1 text-[11px] text-neutral-500">
                              {item.establishment?.name || "Local"}
                           </p>
                           <p className={`mt-1 text-xs font-medium ${unavailable ? "text-neutral-600" : "text-orange-400"}`}>
                              {item.modalities?.[0]?.price > 0
                                 ? `${item.modalities[0].price} EUR`
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
