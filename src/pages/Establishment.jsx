import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
   X,
   ChevronLeft,
   ChevronRight,
   HeartHandshake,
   SquareArrowLeft,
   Clock,
   MapPinHouse,
} from "lucide-react";

import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import RatingBar from "../components/common/RatingBar";
import Footer from "../components/layout/Footer.jsx";

import { establishmentService } from "../services/establishmentService.js";
import { ItemGallery } from "../components/common/ItemGallery";
import { photoService } from "../services/photoService.js";
import { cloudinaryPresets } from "../utils/cloudinaryHelpers";
import { ScheduleDisplay } from "../components/common/ScheduleDisplay";
import { ServiceKitchen } from "../components/common/ServiceKitchen";
import { PriceMedium } from "../components/common/PriceMedium";
import { Contact } from "../components/common/Contact";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Lightbox({ images, startIndex, onClose }) {
   const [current, setCurrent] = useState(startIndex);
   const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
   const next = () => setCurrent((i) => (i + 1) % images.length);

   useEffect(() => {
      const onKey = (e) => {
         if (e.key === "Escape") {onClose();}
         if (e.key === "ArrowLeft") {prev();}
         if (e.key === "ArrowRight") {next();}
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, []);

   return (
      <div
         className="fixed inset-0 z-50 bg-black/95 flex flex-col"
         onClick={onClose}
      >
         <div className="flex justify-end p-4">
            <button
               onClick={onClose}
               className="text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
               <X size={24} />
            </button>
         </div>
         <div
            className="flex-1 flex items-center justify-between px-4 gap-4"
            onClick={(e) => e.stopPropagation()}
         >
            <button
               onClick={prev}
               className="text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors shrink-0"
            >
               <ChevronLeft size={28} />
            </button>
            <img
               src={images[current]}
               alt={`Foto ${current + 1}`}
               className="max-h-full max-w-full object-contain rounded-xl flex-1"
               style={{ maxHeight: "75vh" }}
            />
            <button
               onClick={next}
               className="text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors shrink-0"
            >
               <ChevronRight size={28} />
            </button>
         </div>
         <div className="flex justify-center pb-6 pt-3">
            <div className="flex gap-1.5">
               {images.map((_, i) => (
                  <button
                     key={i}
                     onClick={(e) => {
                        e.stopPropagation();
                        setCurrent(i);
                     }}
                     className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === current ? "bg-orange-400" : "bg-white/30"
                     }`}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}

export const Establishment = () => {
   const navigate = useNavigate();
   const { slug } = useParams();

   const [establishment, setEstablishment] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [photos, setPhotos] = useState([]);
   const [lightboxOpen, setLightboxOpen] = useState(false);
   const [lightboxIndex, setLightboxIndex] = useState(0);
   const mapInstance = useRef(null);

   useEffect(() => {
      loadEstablishmentData();
   }, [slug]);

   const loadEstablishmentData = async () => {
      try {
         setLoading(true);
         setError(null);
         const response = await establishmentService.getBySlug(slug);
         setEstablishment(response.data);
         const photosResponse = await photoService.getByEstablishment(
            response.data._id,
         );
         setPhotos(photosResponse || []);
      } catch (err) {
         console.error("Error cargando establecimiento:", err);
         setError("No se pudo cargar el establecimiento");
      } finally {
         setLoading(false);
      }
   };

   const mapContainer = useCallback(
      (node) => {
         if (!node || mapInstance.current) {return;}
         if (!establishment?.location?.coordinates) {return;}

         const [lng, lat] = establishment.location.coordinates;
         const map = new mapboxgl.Map({
            container: node,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: 15,
         });
         new mapboxgl.Marker({ color: "#f97316" }).setLngLat([lng, lat]).addTo(map);
         mapInstance.current = map;

         return () => {
            if (mapInstance.current) {
               mapInstance.current.remove();
               mapInstance.current = null;
            }
         };
      },
      [establishment],
   );

   const primaryPhoto = photos.find((p) => p.isPrimary);
   const primaryUrl = primaryPhoto?.url || establishment?.mainImage;
   const otherPhotos = photos
      .filter((p) => !p.isPrimary)
      .map((p) => p.url)
      .filter(Boolean);

   const allImages = [...(primaryUrl ? [primaryUrl] : []), ...otherPhotos];
   const openLightbox = (index = 0) => {
      setLightboxIndex(index);
      setLightboxOpen(true);
   };

   if (loading) {
      return (
         <Container>
            <div className="flex items-center justify-center h-screen">
               <p className="text-lg">Cargando establecimiento...</p>
            </div>
         </Container>
      );
   }

   if (error || !establishment) {
      return (
         <Container>
            <div className="flex flex-col items-center justify-center h-screen">
               <p className="text-lg text-red-500 mb-4">
                  {error || "Establecimiento no encontrado"}
               </p>
               <Button onClick={() => navigate("/")}>Volver al inicio</Button>
            </div>
         </Container>
      );
   }

   return (
      <div>
         {lightboxOpen && allImages.length > 0 && (
            <Lightbox
               images={allImages}
               startIndex={lightboxIndex}
               onClose={() => setLightboxOpen(false)}
            />
         )}

         <div className="relative h-72 max-w-3xl mx-auto">
            <img
               src={primaryUrl || "https://images.unsplash.com/photo-1559339352-11d035aa65de"}
               className="w-full h-full object-cover rounded-xl cursor-pointer"
               alt={establishment.name}
               onClick={() => openLightbox(0)}
            />
            <div className="absolute inset-0 bg-black/40 rounded-xl pointer-events-none" />
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
               <button
                  onClick={() => navigate(-1)}
                  className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
               >
                  <SquareArrowLeft />
               </button>
               <span className="text-white font-semibold">nexTapa</span>
               <button className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                  <HeartHandshake />
               </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
               {establishment.verified && (
                  <Badge className="mb-2 inline-block">VERIFICADO</Badge>
               )}
               <h1 className="text-3xl font-bold text-white">{establishment.name}</h1>
               <p className="text-sm text-neutral-300 flex items-center gap-1">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="size-4"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                     />
                  </svg>
                  {establishment.averageRating?.toFixed(1) || "0.0"} ·{" "}
                  {establishment.totalReviews || 0} reviews
               </p>
            </div>
         </div>

         <Container>
            {/* MINIATURAS */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
               {photos.length > 0 ? (
                  photos.map((photo, i) => (
                     <img
                        key={photo._id}
                        src={photo.url}
                        alt={photo.alt || establishment.name}
                        className="h-20 w-32 object-cover rounded-lg shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openLightbox(i + 1)}
                     />
                  ))
               ) : (
                  <img
                     src={primaryUrl}
                     alt={establishment.name}
                     className="h-20 w-32 object-cover rounded-lg shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                     onClick={() => openLightbox(0)}
                  />
               )}
            </div>

            {/* DESCRIPCIÓN */}
            {establishment.description && (
               <div className="mt-6 bg-neutral-900 rounded-2xl p-5 border border-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="mb-6">
                     <h2 className="text-xl font-bold text-white">Descripción</h2>
                     <div className="w-12 h-1 bg-orange-500 rounded-full mt-2" />
                  </div>
                  <p className="text-sm text-white leading-relaxed">
                     {establishment.description}
                  </p>
               </div>
            )}

            {/* TAPAS */}
            <Section title="Nuestras Tapas">
               <ItemGallery establishmentId={establishment._id} />
            </Section>

            {/* SERVICIOS + COCINA */}
            <ServiceKitchen
               features={establishment.features || []}
               cuisineType={establishment.cuisineType || []}
            />

            {/* PRECIO MEDIO - CONTACTO */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
               <Contact
                  phone={establishment.phone}
                  email={establishment.email}
                  website={establishment.website}
               />
               <PriceMedium priceRange={establishment.priceRange} />
            </div>

            {/* UBICACIÓN + DIRECCIÓN + HORARIO */}
            <div className="mt-4 rounded-2xl p-5 shadow-sm">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* MAPA */}
                  <div className="rounded-2xl overflow-hidden border border-neutral-700/60 h-full min-h-96 shadow-md">
                     <div ref={mapContainer} className="w-full h-full" />
                  </div>

                  {/* INFO DERECHA */}
                  <div className="flex flex-col justify-between gap-6">
                     {/* DIRECCIÓN */}
                     <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/40">
                        <h3 className="flex items-center gap-2 text-2xl font-bold text-white mb-3">
                           <MapPinHouse className="w-6 h-6 text-orange-500" />
                  Dirección
                        </h3>
                        <p className="text-sm text-neutral-200 leading-relaxed">
                           {establishment.address?.street}
                           <br />
                           {establishment.address?.postalCode}{" "}
                           {establishment.address?.city},{" "}
                           {establishment.address?.province}
                        </p>
                        <button
                           onClick={() => {
                              const [lng, lat] = establishment.location.coordinates;
                              window.open(
                                 `https://www.google.com/maps?q=${lat},${lng}`,
                                 "_blank",
                              );
                           }}
                           className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md shadow-orange-500/20"
                        >
                  Cómo llegar
                        </button>
                     </div>

                     {/* HORARIO */}
                     <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/40">
                        <h3 className="flex items-center gap-2 text-2xl font-bold text-white mb-3">
                           <Clock className="w-6 h-6 text-orange-500" />
                  Horario
                        </h3>
                        <ScheduleDisplay schedule={establishment.schedule} />
                     </div>
                  </div>
               </div>
            </div>

            {/* RATING */}
            <Section title="Valoración">
               <RatingBar
                  average={establishment.averageRating}
                  totalReviews={establishment.totalReviews}
               />
            </Section>

            <div className="mt-8 mb-6">
               <Button className="w-full bg-orange-500 py-4 rounded-xl text-white font-semibold hover:bg-orange-600 transition-colors">
            Registrate Aqui
               </Button>
            </div>
            <Footer />
         </Container>
      </div>
   );
};