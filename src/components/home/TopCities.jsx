import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CITIES = [
   {
      name: "Madrid",
      img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=700&q=80",
      subtitle: "Mucho tapeo"
   },
   {
      name: "Barcelona",
      img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=700&q=80",
      subtitle: "Plan urbano"
   },
   {
      name: "Sevilla",
      img: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=700&q=80",
      subtitle: "Centro histórico"
   },
   {
      name: "Valencia",
      img: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=700&q=80",
      subtitle: "Sabor mediterráneo"
   },
   {
      name: "Granada",
      img: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=700&q=80",
      subtitle: "Tapas con encanto"
   },
   {
      name: "Málaga",
      img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=700&q=80",
      subtitle: "Sol y barra"
   }
];

export default function TopCities({ onCitySelect }) {
   const scrollRef = useRef(null);
   const [canLeft, setCanLeft] = useState(false);
   const [canRight, setCanRight] = useState(true);

   const checkScroll = useCallback(() => {
      const el = scrollRef.current;
      if (!el) {
         return;
      }

      setCanLeft(el.scrollLeft > 8);
      setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
   }, []);

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
   }, [checkScroll]);

   const scroll = (direction) => {
      scrollRef.current?.scrollBy({ left: direction * 250, behavior: "smooth" });
   };

   return (
      <section id="home-cities" className="mt-8 px-4">
         <div className="mb-3 flex items-center justify-between">
            <div>
               <h2 className="text-lg font-semibold text-white">Explora ciudades</h2>
               <p className="text-xs text-neutral-500">Inspira tu próxima salida</p>
            </div>
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
               {CITIES.map((city) => (
                  <button
                     key={city.name}
                     type="button"
                     onClick={() => onCitySelect?.(city.name)}
                     className="group/card relative h-28 w-48 shrink-0 snap-start overflow-hidden rounded-2xl border border-neutral-800 text-left"
                  >
                     <img
                        src={city.img}
                        alt={city.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
                     <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-base font-bold text-white">{city.name}</p>
                        <p className="text-xs text-neutral-300">{city.subtitle}</p>
                     </div>
                  </button>
               ))}
            </div>
         </div>
      </section>
   );
}
