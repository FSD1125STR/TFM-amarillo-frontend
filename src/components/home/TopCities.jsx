const CITIES = [
   { name: "Madrid",    img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80" },
   { name: "Barcelona", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80" },
   { name: "Sevilla",   img: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=400&q=80" },
   { name: "Valencia",  img: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400&q=80" },
   { name: "Bilbao",    img: "https://images.unsplash.com/photo-1601084881623-cdf9a8ea242c?w=400&q=80" },
   { name: "Granada",   img: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400&q=80" },
   { name: "San Sebastián", img: "https://images.unsplash.com/photo-1596394723269-b2cbca4e6313?w=400&q=80" },
   { name: "Málaga",    img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80" },
   { name: "Zaragoza",  img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80" },
   { name: "Córdoba",   img: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&q=80" },
   { name: "Salamanca", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
];

export default function TopCities({ onCitySelect }) {
   return (
      <section className="px-4 mt-6">
         <h2 className="text-lg font-semibold mb-3">Top Ciudades</h2>
         <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {CITIES.map((city) => (
               <button
                  key={city.name}
                  onClick={() => onCitySelect?.(city.name)}
                  className="flex flex-col items-center gap-2 shrink-0 group"
               >
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-orange-500 transition-all duration-200">
                     <img
                        src={city.img}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                     />
                  </div>
                  <span className="text-xs text-neutral-300 font-medium whitespace-nowrap">
                     {city.name}
                  </span>
               </button>
            ))}
         </div>
      </section>
   );
}