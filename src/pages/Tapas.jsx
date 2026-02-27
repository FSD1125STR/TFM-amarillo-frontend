

// src/pages/Tapas.jsx
// Página para mostrar los detalles de una tapa/item específico
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import Button from "../components/common/Button";
import RatingBar from "../components/common/RatingBar";

import { itemService } from "../services/itemService";
import { photoService } from "../services/photoService";
import { ItemGallery } from "../components/common/ItemGallery";
import { cloudinaryPresets } from "../utils/cloudinaryHelpers";

export const Tapas = () => {
   const navigate = useNavigate();
   const { slug } = useParams();
   const [tapa, setTapa] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const [photos, setPhotos] = useState([]);
   const [heroImage, setHeroImage] = useState(null);

   useEffect(() => {
      if (slug) { loadTapa(); }
   }, [slug]);

   const loadTapa = async () => {
      try {
         setLoading(true);
         const response = await itemService.getBySlug(slug );
         if (!response || !response.data) {
            setError("Tapa no encontrada");
            return;
         }
         const data = response.data;
         setTapa(data);
         console.log("Tapa cargada:", data);
         setHeroImage(data.mainImage || null);

         // Cargar fotos
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

   // Imagen del hero: la que el usuario ha clicado, o la principal al recargar
   const primaryImage = photos.find(p => p.isPrimary)?.url || tapa?.mainImage || "/fallback.png";

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

   const hasImage = !!tapa.mainImage;

   return (
      <div>
         <div className="relative max-w-3xl mx-auto mt-4 h-96">
            {hasImage ? (
               <>
                  <img
                     src={tapa.mainImage}
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
               <div className="w-full h-full rounded-xl bg-neutral-800 flex items-center justify-center">
                  <img
                     src="/Logo.jpg"
                     alt="nexTapa"
                     className="w-40 h-40 object-contain opacity-60"
                  />
               </div>
            )}

            {/* TOP BAR */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
               <button
                  onClick={() => navigate(-1)}
                  className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
               </button>
               <span className="text-white font-semibold">nexTapa</span>
            </div>
         </div>

         {/* MINIATURAS DE FOTOS DE CLIENTES */}
         {photos.length > 1 && (
            <div className="max-w-3xl mx-auto px-4 mt-3">
               <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Fotos de clientes
               </p>
               <div className="flex gap-2 overflow-x-auto pb-1
                  [&::-webkit-scrollbar]:h-1.5
                  [&::-webkit-scrollbar-track]:bg-neutral-100
                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-neutral-300
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [scrollbar-width:thin]
               ">
                  {photos.map(photo => (
                     <button
                        key={photo._id}
                        // Al clicar guardamos la URL original, el hero la optimiza con el preset
                        onClick={() => setHeroImage(photo.url)}
                        className={`flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200
                           ${heroImage === photo.url
                        ? 'border-orange-500 opacity-100 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-90'
                     }`}
                     >
                        <img
                           // thumbnail: 200x150 fill — más que suficiente para w-16 h-16
                           src={cloudinaryPresets.thumbnail(photo.url)}
                           alt=""
                           className="w-full h-full object-cover"
                        />
                     </button>
                  ))}
               </div>
            </div>
         )}

         <Container>
            {/* TITLE */}
            <div className="flex justify-between items-start mt-4">
               <h1 className="text-3xl font-bold">{tapa.name}</h1>

               <div style={{ textAlign: 'right' }}>
                  {tapa.modalities
                     ?.filter(m => m.available)
                     .map((mod, i) => (
                        <div key={i} style={{ marginBottom: '0.25rem' }}>
                           {mod.isFree ? (
                              <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                                 Tapa Gratis
                              </span>
                           ) : (
                              ''
                           )}
                        </div>
                     ))}
               </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-neutral-500 mt-2">{tapa.description}</p>

            {/* MODALIDADES */}
            {tapa.modalities?.length > 0 && (
               <div className="flex gap-2 mt-4 flex-wrap">
                  {tapa.modalities.map((mod, i) => (
                     <div key={i} className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${
                        mod.isFree
                           ? "bg-green-500/10 border-green-500/30"
                           : "bg-neutral-800 border-neutral-700"
                     }`}>
                        <span className="text-sm text-neutral-300">{mod.label}</span>
                        {mod.isFree ? (
                           <span className="text-xs font-bold text-green-400">Gratis</span>
                        ) : (
                           <span className="text-sm font-bold text-orange-400">{mod.price}€</span>
                        )}
                        {!mod.available && (
                           <span className="text-xs text-neutral-600">· No disponible</span>
                        )}
                     </div>
                  ))}
               </div>
            )}

            {/* CATEGORÍAS + ALÉRGENOS + DIETA */}
            {(tapa.categories?.length > 0 || tapa.allergens?.length > 0 || tapa.dietaryOptions?.length > 0) && (
               <div className="grid grid-cols-3 gap-3 mt-6">

                  {/* Categorías */}
                  <div className="bg-neutral-800 rounded-xl p-3">
                     <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide mb-2">
                        Categorías
                     </p>
                     <div className="flex flex-col gap-1.5">
                        {tapa.categories?.length > 0 ? (
                           tapa.categories.map((cat, i) => (
                              <span
                                 key={i}
                                 className="text-xs text-white bg-orange-500/20 border border-orange-500/30 rounded-lg px-2 py-1 text-center"
                              >
                                 {cat}
                              </span>
                           ))
                        ) : (
                           <span className="text-xs text-neutral-600 text-center">—</span>
                        )}
                     </div>
                  </div>

                  {/* Alérgenos */}
                  <div className="bg-neutral-800 rounded-xl p-3">
                     <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide mb-2">
                        Alérgenos
                     </p>
                     <div className="flex flex-col gap-1.5">
                        {tapa.allergens?.length > 0 ? (
                           tapa.allergens.map((allergen, i) => (
                              <span
                                 key={i}
                                 className="text-xs text-white bg-red-500/20 border border-red-500/30 rounded-lg px-2 py-1 text-center"
                              >
                                 {allergen}
                              </span>
                           ))
                        ) : (
                           <span className="text-xs text-neutral-600 text-center">—</span>
                        )}
                     </div>
                  </div>

                  {/* Opciones dietéticas */}
                  <div className="bg-neutral-800 rounded-xl p-3">
                     <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide mb-2">
                        Dieta
                     </p>
                     <div className="flex flex-col gap-1.5">
                        {tapa.dietaryOptions?.length > 0 ? (
                           tapa.dietaryOptions.map((diet, i) => (
                              <span
                                 key={i}
                                 className="text-xs text-white bg-green-500/20 border border-green-500/30 rounded-lg px-2 py-1 text-center"
                              >
                                 {diet}
                              </span>
                           ))
                        ) : (
                           <span className="text-xs text-neutral-600 text-center">—</span>
                        )}
                     </div>
                  </div>

               </div>
            )}


            {/* DISPONIBILIDAD */}
            <Section title="Disponibilidad">
               <p>
                  {!tapa.available ? (
                     "No disponible"
                  ) : tapa.specialDays && tapa.specialDays.length > 0 ? (
                     <>
                        {(() => {
                           const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                           const disponibleHoy = tapa.specialDays.includes(hoy);
                           return (
                              <>
                                 <span style={{ color: disponibleHoy ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                                    {disponibleHoy ? '✓ Disponible hoy' : '✗ No disponible hoy'}
                                 </span>
                                 {' — solo disponible los '}
                                 {tapa.specialDays.join(', ')}
                              </>
                           );
                        })()}
                     </>
                  ) : (
                     <span style={{ color: '#16a34a' }}>✓ Disponible todos los días</span>
                  )}
                  {' '}
                  {tapa.seasonalItem && <em style={{ color: '#b45309' }}>(Producto de temporada)</em>}
               </p>
            </Section>

            {/* RATING */}
            <Section title="Valoración">
               <div className="flex items-center gap-4">
                  <div>
                     <p className="text-3xl font-bold">{tapa.averageRating}</p>
                     <p className="text-sm text-neutral-400">{tapa.totalReviews} opiniones</p>
                  </div>
                  <div className="flex-1 space-y-2">
                     <RatingBar stars={5} value={Math.round((tapa.averageRating / 5) * 100)} />
                  </div>
               </div>
            </Section>

            {/* GALERÍA */}
            <Section title={`Todas las tapas de ${tapa.establishment.name}`}>
               <ItemGallery establishmentId={tapa.establishment._id} />
            </Section>

            {/* BOTON BAR */}
            <div className="mt-8 mb-6">
               <Button
                  onClick={() => navigate(`/establishment/${tapa.establishment.slug}`)}
                  className="w-full bg-orange-500 py-4 rounded-xl text-white font-semibold hover:bg-orange-600"
               >
                  Volver al establecimiento {tapa.establishment.name}
               </Button>
            </div>
         </Container>
      </div>
   );
};