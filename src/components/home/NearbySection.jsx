

// src/components/home/NearbySection.jsx
// Este componente muestra una sección de establecimientos cercanos en la página de inicio.
// Utiliza un carrusel para mostrar los establecimientos y permite navegar entre ellos.
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import { establishmentService } from "../../services/establishmentService";
import { useGeolocation } from "../../hooks/useGeolocation";
import { CircleChevronLeft, CircleChevronRight, MapPinOff } from "lucide-react";

export default function NearbySection() {
   const navigate = useNavigate();
   // Extraemos clearCache por si queremos añadir un botón de "Reintentar"
   const { coords, loading: geoLoading, error: geoError, clearCache } = useGeolocation();
   const [establishments, setEstablishments] = useState([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [loading, setLoading] = useState(false);

   // Usamos useCallback para evitar recrear la función innecesariamente
   const loadNearby = useCallback(async (location) => {
      setLoading(true);
      try {
         const response = await establishmentService.getNearby({
            lat: location.lat,
            lng: location.lng,
         });
         setEstablishments(response.data || []);
      } catch (error) {
         console.error("Error cargando establecimientos cercanos:", error);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      if (coords) {
         loadNearby(coords);
      }
   }, [coords, loadNearby]);

   const nextSlide = () => {
      setCurrentIndex((prev) =>
         prev === establishments.length - 1 ? 0 : prev + 1
      );
   };

   const prevSlide = () => {
      setCurrentIndex((prev) =>
         prev === 0 ? establishments.length - 1 : prev - 1
      );
   };

   // 1. ESTADO: Cargando Geolocalización o Datos de API
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

   // 2. ESTADO: Error de Permisos o GPS
   if (geoError) {
      return (
         <section className="px-4 mt-8">
            <h2 className="text-lg font-semibold mb-4">Establecimientos cercanos</h2>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center">
               <MapPinOff className="mx-auto mb-3 text-neutral-500" size={32} />
               <p className="text-sm text-neutral-400 mb-4">
                  {geoError.includes("Permiso denegado") 
                     ? "Necesitamos tu ubicación para mostrarte los locales más cercanos." 
                     : geoError}
               </p>
               <button 
                  onClick={() => { clearCache(); window.location.reload(); }}
                  className="text-xs bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full hover:bg-orange-500/20 transition-colors"
               >
                  Intentar de nuevo
               </button>
            </div>
         </section>
      );
   }

   // 3. ESTADO: Sin resultados
   if (!loading && establishments.length === 0) {
      return (
         <section className="px-4 mt-8">
            <h2 className="text-lg font-semibold mb-4">Establecimientos cercanos</h2>
            <div className="bg-neutral-900 rounded-2xl p-8 text-center border border-neutral-800">
               <p className="text-sm text-neutral-400">
                  No hemos encontrado establecimientos en un radio cercano.
               </p>
            </div>
         </section>
      );
   }

   return (
      <section className="px-4 mt-8">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Establecimientos cercanos</h2>
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
               {establishments.map((establishment) => (
                  <div key={establishment._id} className="w-full shrink-0">
                     <div
                        onClick={() => navigate(`/establishment/${establishment.slug}`)}
                        className="bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer hover:ring-1 ring-orange-500/50 transition-all duration-300 shadow-xl"
                     >
                        <div className="relative">
                           <img
                              src={establishment.mainImage || "/Logo.jpg"}
                              alt={establishment.name}
                              className="h-56 w-full object-cover"
                              onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "/Logo.jpg";
                              }}
                           />
                           <div className="absolute top-3 right-3">
                              <Badge className="bg-black/60 backdrop-blur-md border-none">
                                 {Number(establishment.averageRating || 0).toFixed(1)}
                              </Badge>
                           </div>
                        </div>

                        <div className="p-4 space-y-1">
                           <h3 className="font-bold text-lg truncate text-white">
                              {establishment.name}
                           </h3>
                           <div className="flex justify-between items-center">
                              <p className="text-sm text-neutral-400">
                                 {establishment.cuisineType?.[0] || "Restaurante"}
                              </p>
                              <p className="text-sm font-semibold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-lg">
                                 {establishment.distance < 1000
                                    ? `${Math.round(establishment.distance)} m`
                                    : `${(establishment.distance / 1000).toFixed(1)} km`
                                 }
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Controles visibles solo en hover en desktop */}
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

         {/* INDICADORES */}
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