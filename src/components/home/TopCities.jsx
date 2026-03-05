// src/components/home/TopCities.jsx
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CITIES = [
   { name: "Madrid",    img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80" },
   { name: "Barcelona", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80" },
   { name: "Sevilla",   img: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=400&q=80" },
   { name: "Valencia",  img: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400&q=80" },
   { name: "Granada",   img: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400&q=80" },
   { name: "Málaga",    img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80" },
];

export default function TopCities({ onCitySelect }) {
   const scrollRef = useRef(null);
   const [canLeft, setCanLeft]   = useState(false);
   const [canRight, setCanRight] = useState(true);

<<<<<<< HEAD
   const checkScroll = useCallback(() => {
=======
   const checkScroll = useCallback(() => { // Tendrá sentido cuando haya más ciudades y recibamos un fech dinámico del backend
>>>>>>> integracion-distancias
      const el = scrollRef.current;
      if (!el) {return;}
      setCanLeft(el.scrollLeft > 8);
      setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
   }, []);

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
   }, [checkScroll]);

   const scroll = (dir) => {
      scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
   };

   return (
      <section className="px-4 mt-6">
         <h2 className="text-lg font-semibold mb-3">Top Ciudades</h2>

         <div className="relative group">
            {/* Flecha izquierda */}
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

            {/* Flecha derecha */}
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

            {/* Track — scrollbar oculta en todos los navegadores */}
            <div
               ref={scrollRef}
               className="
                  flex gap-4 overflow-x-auto pb-2
                  [&::-webkit-scrollbar]:hidden
                  [-ms-overflow-style:none]
                  [scrollbar-width:none]
               "
            >
               {CITIES.map((city) => (
                  <button
                     key={city.name}
                     onClick={() => onCitySelect?.(city.name)}
                     className="flex flex-col items-center gap-2 shrink-0 group/card"
                  >
                     <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover/card:border-orange-500 transition-all duration-200">
                        <img
                           src={city.img}
                           alt={city.name}
                           className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-200"
                        />
                     </div>
                     <span className="text-xs text-neutral-300 font-medium whitespace-nowrap">
                        {city.name}
                     </span>
                  </button>
               ))}
            </div>
         </div>
      </section>
   );
}