

// src/components/home/NearbySection.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import { establishmentService } from "../../services/establishmentService";
import { useGeolocation } from "../../hooks/useGeolocation";
import { cloudinaryPresets } from "../../utils/cloudinaryHelpers.js";
import { CircleChevronLeft, CircleChevronRight, MapPinOff } from "lucide-react";

export default function NearbySection() {
   const navigate = useNavigate();
   const { coords, loading: geoLoading, error: geoError, clearCache } = useGeolocation();
   const [establishments, setEstablishments] = useState([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [loading, setLoading] = useState(false);
   const [usingFallback, setUsingFallback] = useState(false);

   const loadNearby = useCallback(async (location) => {
      setLoading(true);
      try {
         const response = await establishmentService.getNearby({ lat: location.lat, lng: location.lng });
         setEstablishments(response.data || []);
         setUsingFallback(false);
      } catch (error) {
         console.error("Error cargando establecimientos cercanos:", error);
      } finally {
         setLoading(false);
      }
   }, []);

   const loadFallback = useCallback(async () => {
      setLoading(true);
      try {
         const response = await establishmentService.getAll();
         setEstablishments((response.data || []).slice(0, 10));
         setUsingFallback(true);
      } catch (error) {
         console.error("Error cargando establecimientos:", error);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      if (geoLoading) {return;}
      if (coords) {loadNearby(coords);}
      else {loadFallback();}
   }, [coords, geoLoading, loadNearby, loadFallback]);

   const nextSlide = () => setCurrentIndex((prev) => prev === establishments.length - 1 ? 0 : prev + 1);
   const prevSlide = () => setCurrentIndex((prev) => prev === 0 ? establishments.length - 1 : prev - 1);

   if (geoLoading || (loading && establishments.length === 0)) {
      return (
         <section className="px-4 mt-8">
            <h2 className="text-lg font-semibold mb-4">Establecimientos cercanos</h2>
            <div className="bg-neutral-900 rounded-2xl h-72 animate-pulse flex items-center justify-center">
               <span className="text-neutral-500 text-sm">Buscando locales cerca de ti...</span>
            </div>
         </section>
      );
   }

   if (!loading && establishments.length === 0) {
      return (
         <section className="px-4 mt-8">
            <h2 className="text-lg font-semibold mb-4">Establecimientos cercanos</h2>
            <div className="bg-neutral-900 rounded-2xl p-8 text-center border border-neutral-800">
               <p className="text-sm text-neutral-400">No hemos encontrado establecimientos disponibles.</p>
            </div>
         </section>
      );
   }

   return (
      <section className="px-4 mt-8">
         <div className="flex justify-between items-center mb-4">
            <div>
               <h2 className="text-lg font-semibold">
                  {usingFallback ? "Establecimientos destacados" : "Establecimientos cercanos"}
               </h2>
               {usingFallback && geoError && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                     <MapPinOff size={11} className="text-neutral-500" />
                     <span className="text-[11px] text-neutral-500">Ubicación no disponible</span>
                     <button
                        onClick={() => { clearCache(); window.location.reload(); }}
                        className="text-[11px] text-orange-500 hover:text-orange-400 underline transition-colors"
                     >
                        Activar
                     </button>
                  </div>
               )}
            </div>
            <button
               onClick={() => navigate("/establishments")}
               className="text-orange-400 text-sm font-medium hover:text-orange-500 transition-colors"
            >
               Ver todos
            </button>
         </div>

         <div className="relative w-full overflow-hidden group">
            <div
               className="flex transition-transform duration-500 ease-out"
               style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
               {establishments.map((establishment) => {
                  const isOpen = establishment.isOpen === true;

                  return (
                     <div key={establishment._id} className="w-full shrink-0">
                        <div
                           onClick={() => navigate(`/establishment/${establishment.slug}`, {
                              state: { distance: establishment.distance }
                           })}
                           className={`bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer hover:ring-1 ring-orange-500/50 transition-all duration-300 shadow-xl relative ${
                              !isOpen ? "opacity-60" : ""
                           }`}
                        >
                           {!isOpen && (
                              <div className="absolute top-3 left-3 z-10">
                                 <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full border border-neutral-600 backdrop-blur-sm">
                                    Cerrado
                                 </span>
                              </div>
                           )}

                           {/* IMAGEN — card: 600×400 fill — slider ocupa ancho completo pero h-56, no necesita más */}
                           <div className="relative">
                              <img
                                 src={cloudinaryPresets.card(establishment.mainImage || "/Logo.jpg")}
                                 alt={establishment.name}
                                 className="h-56 w-full object-cover"
                                 onError={(e) => { e.target.onerror = null; e.target.src = "/Logo.jpg"; }}
                              />
                              <div className="absolute top-3 right-3">
                                 <Badge className="bg-black/60 backdrop-blur-md border-none">
                                    {Number(establishment.averageRating || 0).toFixed(1)}
                                 </Badge>
                              </div>
                           </div>

                           <div className="p-4 space-y-1">
                              <h3 className="font-bold text-lg truncate text-white">{establishment.name}</h3>
                              <div className="flex justify-between items-center">
                                 <p className="text-sm text-neutral-400">
                                    {establishment.cuisineType?.[0] || "Restaurante"}
                                 </p>
                                 {typeof establishment.distance === "number" && (
                                    <p className="text-sm font-semibold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-lg">
                                       {establishment.distance < 1000
                                          ? `${Math.round(establishment.distance)} m`
                                          : `${(establishment.distance / 1000).toFixed(1)} km`}
                                    </p>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>

            {establishments.length > 1 && (
               <>
                  <button
                     onClick={prevSlide}
                     className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                     <CircleChevronLeft size={24} />
                  </button>
                  <button
                     onClick={nextSlide}
                     className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                     <CircleChevronRight size={24} />
                  </button>
               </>
            )}
         </div>

         {establishments.length > 1 && (
            <div className="flex justify-center mt-4 gap-1.5">
               {establishments.map((_, index) => (
                  <div
                     key={index}
                     onClick={() => setCurrentIndex(index)}
                     className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                        index === currentIndex ? "bg-orange-500 w-6" : "bg-neutral-700 w-1.5"
                     }`}
                  />
               ))}
            </div>
         )}
      </section>
   );
}