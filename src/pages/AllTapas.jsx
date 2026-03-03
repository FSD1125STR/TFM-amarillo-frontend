import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { itemService } from "../services/itemService";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { MapPin } from "lucide-react";

export const AllTapas = () => {
   const navigate = useNavigate();
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const { coords, loading: geoLoading } = useGeolocation();

   const loadItems = useCallback(async () => {
      try {
         setLoading(true);
         const params = coords ? { lat: coords.lat, lng: coords.lng } : {};
         const response = await itemService.getAllItems(params);
         const data = response.data || [];
         setItems(data);
         console.log("items:", data); // ✅ log correcto, sin estado stale
      } catch (error) {
         console.error("Error cargando items:", error);
      } finally {
         setLoading(false);
      }
   }, [coords]);

   // ✅ Esperar a que la geolocalización termine antes de cargar
   useEffect(() => {
      if (!geoLoading) {
         loadItems();
      }
   }, [loadItems, geoLoading]);

   if (loading && items.length === 0) {
      return (
         <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-400 italic">
               {geoLoading
                  ? "Obteniendo tu ubicación..."
                  : "Buscando las mejores tapas cerca de ti..."}
            </p>
         </div>
      );
   }

   // const sortedItems = [...items].sort((a, b) => {
   //    // ✅ Lógica de apertura más robusta
   //    const aOpen = a.available === true && a.establishment?.isOpen === true;
   //    const bOpen = b.available === true && b.establishment?.isOpen === true;
   //    if (bOpen !== aOpen) return bOpen - aOpen;
   //    // Secundario: más cercano primero
   //    const aDist = a.distance ?? Infinity;
   //    const bDist = b.distance ?? Infinity;
   //    return aDist - bDist;
   // });
   const sortedItems = items;
   return (
      <div className="min-h-screen bg-neutral-950 text-white">
         <Header />

         <div className="max-w-3xl mx-auto px-4 pb-24 mt-4">
            <div className="flex items-center gap-2 mb-6">
               <MapPin className="text-orange-500" size={25} />
               <h1 className="text-xl font-bold">Tapas por proximidad</h1>
            </div>

            <div className="grid grid-cols-2 gap-3">
               {sortedItems.map((item) => {
                  // ✅ Distinguir correctamente los dos casos de cierre
                  const establishmentClosed = item.establishment?.isOpen === false;
                  const tapaUnavailable = item.available === false;
                  const unavailable = establishmentClosed || tapaUnavailable;

                  // ✅ Mensaje diferenciado según el motivo real
                  const closedLabel = tapaUnavailable
                     ? "Tapa no disponible"
                     : "Establecimiento cerrado";

                  return (
                     <div
                        key={item._id}
                        className={`bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-orange-500/40 transition-all duration-300 flex flex-col ${
                           unavailable ? "opacity-50" : ""
                        }`}
                     >
                        {/* IMAGEN */}
                        <div
                           className="relative cursor-pointer group"
                           onClick={() => navigate(`/items/${item.slug}`)}
                        >
                           <img
                              src={item.mainImage || "/Logo.jpg"}
                              alt={item.name}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "/Logo.jpg";
                              }}
                           />

                           {/* Badge precio */}
                           <div className="absolute top-2 right-2">
                              <span className="bg-neutral-900/90 text-orange-400 text-xs font-bold px-2 py-1 rounded-full border border-orange-500/40 backdrop-blur-sm">
                                 {item.modalities?.[0]?.price === 0
                                    ? "Gratis"
                                    : `€${item.modalities?.[0]?.price ?? "—"}`}
                              </span>
                           </div>

                           {/* Badge cerrado — encima de la imagen */}
                           {unavailable && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full border border-neutral-600 backdrop-blur-sm">
                                    {closedLabel}
                                 </span>
                              </div>
                           )}
                        </div>

                        {/* DATOS */}
                        <div className="p-3 flex flex-col flex-1 justify-between">
                           <div>
                              <h3
                                 className="font-bold text-sm text-white leading-tight cursor-pointer hover:text-orange-400 transition-colors line-clamp-2"
                                 onClick={() => navigate(`/items/${item.slug}`)}
                              >
                                 {item.name}
                              </h3>

                              <div className="flex items-center justify-between mt-2">
                                 {item.averageRating > 0 ? (
                                    <div className="flex items-center gap-1">
                                       <span className="text-yellow-400 text-xs">⭐</span>
                                       <span className="text-xs text-neutral-400">
                                          {Number(item.averageRating).toFixed(1)}
                                       </span>
                                    </div>
                                 ) : (
                                    <span />
                                 )}

                                 {/* ✅ Renderiza si distance es número válido (incluso 0) */}
                                 {typeof item.distance === "number" && (
                                    <span className="text-[10px] text-orange-500/80 font-medium">
                                       {item.distance < 1000
                                          ? `${Math.round(item.distance)}m`
                                          : `${(item.distance / 1000).toFixed(1)}km`}
                                    </span>
                                 )}
                              </div>
                           </div>

                           {/* Separador y Local */}
                           <div className="border-t border-neutral-800 mt-3 pt-3">
                              <p className="text-[11px] text-neutral-500 truncate mb-2">
                                 📍 {item.establishment?.name || "Local desconocido"}
                              </p>

                              <button
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/establishment/${item.establishment?.slug}`, {
                                       state: { distance: item.distance }  // ← la distancia ya la tiene el item
                                    });
                                 }}
                                 className="w-full text-[11px] py-2 rounded-xl bg-neutral-800 hover:bg-orange-500 text-neutral-300 hover:text-white transition-all duration-200 font-medium"
                              >
                                 Ver local
                              </button>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
         <Footer />
      </div>
   );
};