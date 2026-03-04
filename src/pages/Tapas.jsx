

// src/pages/Tapas.jsx
// Página de detalle de una tapa individual, con toda su información, fotos, valoración y enlaces relacionados.
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import Button from "../components/common/Button";
import RatingBar from "../components/common/RatingBar";
import { Footer } from "../components/layout/Footer";
import { LittleEstablishCard } from "../components/common/LittleEstablishCard";

import { itemService } from "../services/itemService";
import { photoService } from "../services/photoService";
import { ItemGallery } from "../components/common/ItemGallery";
import { useGeolocation } from "../hooks/useGeolocation.js";
import {
   CheckCircle,
   XCircle,
   HeartHandshake,
   SquareArrowLeft,
   Tags,
   AlertTriangle,
   Leaf,
} from "lucide-react";

export const Tapas = () => {
   const navigate = useNavigate();
   const { slug } = useParams();
   const location = useLocation();

   // Distancia pre-calculada desde el listado o desde el establecimiento
   const distanceFromState = location.state?.distance ?? null;

   const [tapa, setTapa] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [photos, setPhotos] = useState([]);
   const { coords, loading: geoLoading } = useGeolocation();

   useEffect(() => {
      if (slug && !geoLoading) {
         loadTapa();
      }
   }, [slug, geoLoading]);

   const loadTapa = async () => {
      try {
         setLoading(true);
         const params = (!distanceFromState && coords)
            ? { lat: coords.lat, lng: coords.lng }
            : {};
         const response = await itemService.getBySlug(slug, params);
         if (!response || !response.data) {
            setError("Tapa no encontrada");
            return;
         }
         const data = response.data;
         setTapa(data);

         const fotosData = await photoService.getByItem(data._id);
         const sorted = [...(fotosData || [])].sort((a, b) => a.order - b.order);
         setPhotos(sorted);
      } catch (err) {
         console.error("Error al cargar la tapa:", err);
         setError("No se pudo cargar la tapa.");
      } finally {
         setLoading(false);
      }
   };

   const primaryImage =
      photos.find((p) => p.isPrimary)?.url || tapa?.mainImage || "/fallback.png";

   // Prioriza distancia del state (ya calculada), si no la del backend
   const distance = distanceFromState ?? tapa?.establishment?.distance ?? null;

   // Disponibilidad real: activa por el hostelero Y se sirve hoy
   const isAvailableToday = tapa?.available && (tapa?.servedToday ?? true);

   if (loading) {
      return (
         <Container>
            <div className="flex items-center justify-center h-screen">
               <p className="text-lg">Cargando tapa...</p>
            </div>
         </Container>
      );
   }

   if (error || !tapa) {
      return (
         <Container>
            <div className="flex flex-col items-center justify-center h-screen">
               <p className="text-lg text-red-500 mb-4">
                  {error || "Tapa no encontrada"}
               </p>
               <Button onClick={() => navigate("/")}>Volver al inicio</Button>
            </div>
         </Container>
      );
   }

   const hasImage = !!primaryImage && primaryImage !== "/fallback.png";

   return (
      <div>
         {/* HERO */}
         <div className="relative max-w-3xl mx-auto mt-4 h-96">
            {hasImage ? (
               <>
                  <img
                     src={primaryImage}
                     alt={tapa.name}
                     className="w-full h-full object-cover rounded-xl shadow-md"
                     onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/Logo.jpg";
                     }}
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-xl" />
               </>
            ) : (
               <div className="w-full h-full rounded-xl bg-neutral-800 overflow-hidden">
                  <img
                     src="/Logo.jpg"
                     alt="nexTapa"
                     className="w-full h-full object-cover opacity-60"
                  />
               </div>
            )}

            {/* TOP BAR */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
               <button
                  onClick={() => navigate(-1)}
                  className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center"
               >
                  <SquareArrowLeft />
               </button>
               <span className="text-white font-semibold">nexTapa</span>
               <button className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                  <HeartHandshake />
               </button>
            </div>
         </div>

         {/* CARRUSEL DE FOTOS DE LA TAPA */}
         {photos.length > 1 && (
            <div className="max-w-3xl mx-auto mt-3 px-2">
               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {photos.map((photo, i) => (
                     <button
                        key={photo._id || i}
                        onClick={() => {
                           setTapa((prev) => ({ ...prev, mainImage: photo.url }));
                        }}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                           primaryImage === photo.url
                              ? "border-orange-500 opacity-100"
                              : "border-transparent opacity-60 hover:opacity-90"
                        }`}
                     >
                        <img
                           src={photo.url}
                           alt={`Foto ${i + 1}`}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/Logo.jpg";
                           }}
                        />
                     </button>
                  ))}
               </div>
            </div>
         )}

         {/* MODALIDADES + DISPONIBILIDAD */}
         <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row gap-3 p-4 items-center bg-neutral-900 border border-neutral-800 rounded-2xl mt-4 hover:border-orange-500/30 transition-colors duration-200 cursor-pointer">

            {/* Modalidades */}
            {tapa.modalities?.length > 0 && (
               <div className="flex flex-wrap gap-2 flex-1">
                  {tapa.modalities.map((mod, i) => (
                     <div
                        key={i}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 border ${
                           !mod.available
                              ? "bg-neutral-900 border-neutral-700 opacity-50"
                              : mod.isFree
                                 ? "bg-green-500/10 border-green-500/30"
                                 : "bg-neutral-900 border-neutral-700"
                        }`}
                     >
                        <span className="text-sm text-neutral-200 font-medium">{mod.label}</span>
                        <span className="w-px h-3 bg-neutral-600" />
                        {mod.isFree ? (
                           <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Gratis</span>
                        ) : (
                           <span className="text-sm font-bold text-orange-400">{mod.price}€</span>
                        )}
                        {!mod.available && (
                           <span className="text-[10px] text-neutral-500 italic">no disponible</span>
                        )}
                     </div>
                  ))}
               </div>
            )}

            {/* Disponibilidad */}
            <div className="flex flex-col gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 self-start">

               {/* Estado de la tapa */}
               <div className="flex items-center gap-2.5">
                  {isAvailableToday ? (
                     <>
                        <CheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
                        <span className="text-sm text-green-400 font-medium">Tapa disponible</span>
                     </>
                  ) : tapa.availableOnlyOn?.length > 0 ? (
                     <>
                        <XCircle className="text-red-400 w-4 h-4 " />
                        <span className="text-sm text-red-400 font-medium">
                           Disponible los: {tapa.availableOnlyOn.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                        </span>
                     </>
                  ) : (
                     <>
                        <XCircle className="text-red-500 w-4 h-4 flex-shrink-0" />
                        <span className="text-sm text-red-400 font-medium">Tapa no disponible</span>
                     </>
                  )}
               </div>

               {/* Estado del local */}
               <div className="flex items-center gap-2.5">
                  {tapa.establishment?.isOpen ? (
                     <>
                        <CheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
                        <span className="text-sm text-green-400 font-medium">Local abierto ahora</span>
                     </>
                  ) : (
                     <>
                        <XCircle className="text-red-500 w-4 h-4 flex-shrink-0" />
                        <span className="text-sm text-red-400 font-medium">Local cerrado ahora</span>
                     </>
                  )}
               </div>

               {/* Aviso combinado */}
               {isAvailableToday && !tapa.establishment?.isOpen && (
                  <p className="text-[11px] text-yellow-400/80 border-t border-neutral-800 pt-2 mt-1">
                     ⚠️ Disponible pero el local está cerrado
                  </p>
               )}
            </div>
         </div>

         <Container>
            {/* DESCRIPCIÓN */}
            {tapa.description && (
               <div className="mt-6 bg-neutral-900 rounded-2xl p-6 border   border-neutral-800  hover:border-orange-500/30 transition-colors duration-200 cursor-pointer">
                  <div className="mb-6 text-center">
                     <h2 className="text-3xl font-bold text-white">{tapa.name}</h2>
                     <div className="w-16 h-1 bg-orange-500 rounded-full mt-3 mx-auto" />
                  </div>
                  <p className="text-sm text-white leading-relaxed text-center">
                     {tapa.description}
                  </p>
               </div>
            )}

            {/* INFORMACIÓN DEL ESTABLECIMIENTO */}
            <LittleEstablishCard
               name={tapa.establishment.name}
               address={`${tapa.establishment.address.street}, ${tapa.establishment.address.number} - ${tapa.establishment.address.city}`}
               distance={distance}
               slug={tapa.establishment.slug}
            />

            {/* INFORMACIÓN ADICIONAL */}
            <Section title="Información adicional">
               <div className="mt-6 flex flex-col md:flex-row gap-4">
                  {/* CATEGORÍAS */}
                  <div className="flex-1 bg-neutral-900 rounded-2xl p-6 border-2 border-blue-500 text-center min-h-55 flex flex-col">
                     <div>
                        <Tags className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <h3 className="text-white font-semibold text-lg mb-4">Categorías</h3>
                     </div>
                     <div className="flex flex-wrap justify-center gap-2 grow items-center">
                        {tapa.categories?.length > 0 ? (
                           tapa.categories.map((cat, i) => (
                              <span key={i} className="text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full">
                                 {cat}
                              </span>
                           ))
                        ) : (
                           <span className="text-xs text-neutral-500">—</span>
                        )}
                     </div>
                  </div>

                  {/* ALÉRGENOS */}
                  <div className="flex-1 bg-neutral-900 rounded-2xl p-6 border-2 border-red-500 text-center min-h-55 flex flex-col">
                     <div>
                        <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <h3 className="text-white font-semibold text-lg mb-4">Alérgenos</h3>
                     </div>
                     <div className="flex flex-wrap justify-center gap-2 grow items-center">
                        {tapa.allergens?.length > 0 ? (
                           tapa.allergens.map((allergen, i) => (
                              <span key={i} className="text-xs bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-full">
                                 {allergen}
                              </span>
                           ))
                        ) : (
                           <span className="text-xs text-neutral-500">—</span>
                        )}
                     </div>
                  </div>

                  {/* DIETA */}
                  <div className="flex-1 bg-neutral-900 rounded-2xl p-6 border-2 border-green-500 text-center min-h-55 flex flex-col">
                     <div>
                        <Leaf className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <h3 className="text-white font-semibold text-lg mb-4">Dieta</h3>
                     </div>
                     <div className="flex flex-wrap justify-center gap-2 grow items-center">
                        {tapa.dietaryOptions?.length > 0 ? (
                           tapa.dietaryOptions.map((diet, i) => (
                              <span key={i} className="text-xs bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full">
                                 {diet}
                              </span>
                           ))
                        ) : (
                           <span className="text-xs text-neutral-500">—</span>
                        )}
                     </div>
                  </div>
               </div>
            </Section>

            {/* RATING */}
            <Section title="Valoración">
               <RatingBar
                  average={tapa.averageRating}
                  totalReviews={tapa.totalReviews}
                  breakdown={tapa.ratingBreakdown}
               />
            </Section>

            {/* GALERÍA DE TAPAS DEL ESTABLECIMIENTO */}
            <ItemGallery
               establishmentId={tapa.establishment._id}
               currentItemId={tapa._id}
               establishmentName={tapa.establishment.name}
               distance={distance}
            />

            {/* BOTÓN BAR */}
            <div className="mt-8 mb-6">
               <Button
                  onClick={() => navigate(`/establishment/${tapa.establishment.slug}`)}
                  className="w-full bg-orange-500 py-4 rounded-xl text-white font-semibold hover:bg-orange-600"
               >
                  Volver al establecimiento {tapa.establishment.name}
               </Button>
            </div>

            <Footer />
         </Container>
      </div>
   );
};