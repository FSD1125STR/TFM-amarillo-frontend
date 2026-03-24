// src/pages/Establishment.jsx
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
   X, ChevronLeft, ChevronRight, HeartHandshake,
   SquareArrowLeft, Clock, MapPinHouse, Banknote, CalendarDays,
} from "lucide-react";

import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import RatingBar from "../components/common/RatingBar";
import { Footer } from "../components/layout/Footer.jsx";
import { SocialLinks } from "../components/common/SocialLinks.jsx";
import { ReservationModal } from "../components/common/ReservationModal";

import { establishmentService } from "../services/establishmentService.js";
import { ItemGallery } from "../components/common/ItemGallery";
import { photoService } from "../services/photoService.js";
import { ScheduleDisplay } from "../components/common/ScheduleDisplay";
import { ServiceKitchen } from "../components/common/ServiceKitchen";
import { Contact } from "../components/common/Contact";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { cloudinaryPresets } from "../utils/cloudinaryHelpers.js";
import { useAuth } from "../context/AuthContext";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// ─────────────────────────────────────────────
//  Lightbox (sin cambios)
// ─────────────────────────────────────────────

function Lightbox({ images, startIndex, onClose }) {
   const [current, setCurrent] = useState(startIndex);
   const prev = useCallback(
      () => setCurrent((i) => (i - 1 + images.length) % images.length),
      [images.length]
   );
   const next = useCallback(
      () => setCurrent((i) => (i + 1) % images.length),
      [images.length]
   );

   useEffect(() => {
      const onKey = (e) => {
         if (e.key === "Escape")      { onClose(); }
         if (e.key === "ArrowLeft")   { prev(); }
         if (e.key === "ArrowRight")  { next(); }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, [onClose, prev, next]);

   return (
      <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={onClose}>
         <div className="flex justify-end p-4">
            <button onClick={onClose} className="text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
               <X size={24} />
            </button>
         </div>
         <div className="flex-1 flex items-center justify-between px-4 gap-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={prev} className="text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors shrink-0">
               <ChevronLeft size={28} />
            </button>
            <img
               src={images[current]}
               alt={`Foto ${current + 1}`}
               className="max-h-full max-w-full object-contain rounded-xl flex-1"
               style={{ maxHeight: "75vh" }}
            />
            <button onClick={next} className="text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors shrink-0">
               <ChevronRight size={28} />
            </button>
         </div>
         <div className="flex justify-center pb-6 pt-3">
            <div className="flex gap-1.5">
               {images.map((_, i) => (
                  <button
                     key={i}
                     onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                     className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-orange-400" : "bg-white/30"}`}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}

// ─────────────────────────────────────────────
//  Página principal
// ─────────────────────────────────────────────

export const Establishment = () => {
   const navigate  = useNavigate();
   const { slug }  = useParams();
   const location  = useLocation();
   const { user }  = useAuth();

   const preloadedDistance = location.state?.distance ?? null;

   const [establishment, setEstablishment] = useState(null);
   const [loading, setLoading]             = useState(true);
   const [error, setError]                 = useState(null);
   const [photos, setPhotos]               = useState([]);
   const [lightboxOpen, setLightboxOpen]   = useState(false);
   const [lightboxIndex, setLightboxIndex] = useState(0);

   // Modal de reserva
   const [reservationOpen, setReservationOpen] = useState(false);

   const mapInstance = useRef(null);
   const { coords, loading: geoLoading } = useGeolocation();

   const loadEstablishmentData = useCallback(async () => {
      try {
         setLoading(true);
         setError(null);

         const params = (!preloadedDistance && coords?.lat)
            ? { lat: coords.lat, lng: coords.lng }
            : {};

         const response = await establishmentService.getBySlug(slug, params);
         setEstablishment(response.data);

         const photosResponse = await photoService.getByEstablishment(response.data._id);
         setPhotos(photosResponse || []);
      } catch (err) {
         console.error("Error cargando establecimiento:", err);
         setError("No se pudo cargar el establecimiento");
      } finally {
         setLoading(false);
      }
   }, [slug, coords, preloadedDistance]);

   useEffect(() => {
      loadEstablishmentData();
   }, [loadEstablishmentData]);

   const mapContainer = useCallback((node) => {
      if (!node || mapInstance.current || !establishment?.location?.coordinates) { return; }
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
         if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
      };
   }, [establishment]);

   const rawPrimaryUrl    = photos.find((p) => p.isPrimary)?.url || establishment?.mainImage;
   const heroUrl          = rawPrimaryUrl ? cloudinaryPresets.detail(rawPrimaryUrl) : "/Logo.png";
   const lightboxUrls     = photos.map((p) => cloudinaryPresets.detail(p.url)).filter(Boolean);
   const allLightboxImages = lightboxUrls.length > 0
      ? lightboxUrls
      : rawPrimaryUrl ? [cloudinaryPresets.detail(rawPrimaryUrl)] : [];

   const openLightbox = (index = 0) => { setLightboxIndex(index); setLightboxOpen(true); };

   const displayDistance = () => {
      const dist = Number(preloadedDistance ?? establishment?.distance);
      if (isNaN(dist) || dist <= 0) {
         return geoLoading ? "Calculando distancia..." : "Distancia no disponible";
      }
      return dist < 1000 ? `${Math.round(dist)} m` : `${(dist / 1000).toFixed(1)} km`;
   };

   // ── El cliente está logueado
   const isLoggedInClient = user && user.role === "cliente";

   if (loading && !establishment) {
      return (
         <Container>
            <div className="flex items-center justify-center h-screen">
               <p className="text-lg text-white">Cargando establecimiento...</p>
            </div>
         </Container>
      );
   }

   if (error || !establishment) {
      return (
         <Container>
            <div className="flex flex-col items-center justify-center h-screen text-white">
               <p className="text-lg text-red-500 mb-4">{error || "Establecimiento no encontrado"}</p>
               <Button onClick={() => navigate("/")}>Volver al inicio</Button>
            </div>
         </Container>
      );
   }

   return (
      <div className="bg-neutral-950 min-h-screen text-white">
         {lightboxOpen && allLightboxImages.length > 0 && (
            <Lightbox
               images={allLightboxImages}
               startIndex={lightboxIndex}
               onClose={() => setLightboxOpen(false)}
            />
         )}

         {/* Modal de reserva — solo se monta si el cliente está logueado */}
         {reservationOpen && isLoggedInClient && (
            <ReservationModal
               establishment={establishment}
               onClose={() => setReservationOpen(false)}
               onSuccess={() => {
                  // Aquí puedes añadir feedback adicional si lo necesitas
               }}
            />
         )}

         <div className="relative h-72 max-w-3xl mx-auto">
            <img
               src={heroUrl}
               className="w-full h-full object-cover rounded-xl cursor-pointer"
               alt={establishment.name}
               onClick={() => openLightbox(0)}
            />
            <div className="absolute inset-0 bg-black/40 rounded-xl pointer-events-none" />
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
               <button
                  onClick={() => navigate(-1)}
                  className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80"
               >
                  <SquareArrowLeft />
               </button>
               <span className="text-white font-semibold">nexTapa</span>
               <button className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80">
                  <HeartHandshake />
               </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
               {establishment.verified && <Badge className="mb-2 inline-block">VERIFICADO</Badge>}
               <h1 className="text-3xl font-bold text-white">{establishment.name}</h1>
               <span className="text-l text-white font-bold">{displayDistance()}</span>
               <p className="text-sm text-white flex items-center gap-1 font-bold">
                  <span className="text-yellow-400">★</span>
                  {Number(establishment.averageRating || 0).toFixed(1)} · {establishment.totalReviews || 0} reviews
               </p>
            </div>
         </div>

         <Container>
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
               {photos.length > 0
                  ? photos.map((photo, i) => (
                     <img
                        key={photo._id}
                        src={cloudinaryPresets.thumbnail(photo.url)}
                        className="h-20 w-32 object-cover rounded-lg shrink-0 cursor-pointer hover:opacity-80"
                        onClick={() => openLightbox(i)}
                        alt="Foto del establecimiento"
                     />
                  ))
                  : rawPrimaryUrl && (
                     <img
                        src={cloudinaryPresets.thumbnail(rawPrimaryUrl)}
                        className="h-20 w-32 object-cover rounded-lg shrink-0 cursor-pointer"
                        onClick={() => openLightbox(0)}
                        alt="Foto del establecimiento"
                     />
                  )}
            </div>

            <div className="mt-6 bg-neutral-900 rounded-2xl p-5 border border-neutral-800 shadow-sm hover:border-orange-500/30 transition-colors duration-200">
               <div className="flex items-start justify-between mb-4">
                  <div>
                     <h2 className="text-xl font-bold text-white">Descripcion</h2>
                     <div className="w-12 h-1 bg-orange-500 rounded-full mt-2" />
                  </div>
                  {establishment.priceRange && (
                     <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700/60 rounded-xl px-3 py-2 shrink-0 ml-4">
                        <Banknote size={16} className="text-green-400 shrink-0" strokeWidth={1.8} />
                        <div className="flex flex-col leading-tight">
                           <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Precio medio</span>
                           <span className="text-sm font-bold text-white">{establishment.priceRange}</span>
                        </div>
                     </div>
                  )}
               </div>
               {establishment.description && (
                  <p className="text-sm text-white leading-relaxed">{establishment.description}</p>
               )}
            </div>

            <Section>
               <ItemGallery
                  establishmentId={establishment._id}
                  currentItemId={establishment.tapas?.[0]?._id}
                  establishmentName={establishment.name}
                  distance={preloadedDistance ?? establishment.distance}
               />
            </Section>

            <ServiceKitchen
               features={establishment.features || []}
               cuisineType={establishment.cuisineType || []}
            />

            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-sm hover:border-orange-500/30 transition-colors duration-200">
                  <div className="mb-5">
                     <h3 className="text-xl font-bold text-white">Contacto</h3>
                     <div className="w-12 h-1 bg-orange-500 rounded-full mt-2" />
                  </div>
                  <Contact phone={establishment.phone} email={establishment.email} website={establishment.website} />
               </div>
               <SocialLinks socialLinks={establishment.socialLinks || {}} />
            </div>

            <div className="mt-4 rounded-2xl p-5 shadow-sm">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl overflow-hidden border border-neutral-700/60 h-full min-h-96">
                     <div ref={mapContainer} className="w-full h-full" />
                  </div>
                  <div className="flex flex-col justify-between gap-6">
                     <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/40">
                        <h3 className="flex items-center gap-2 text-2xl font-bold text-white mb-3">
                           <MapPinHouse className="text-orange-500" /> Direccion
                        </h3>
                        <p className="text-sm text-neutral-200">
                           {establishment.address?.street}, {establishment.address?.number}<br />
                           {establishment.address?.postalCode} {establishment.address?.city}, {establishment.address?.province}
                        </p>
                        <button
                           onClick={() => {
                              const [lng, lat] = establishment.location.coordinates;
                              window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
                           }}
                           className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all text-sm font-medium"
                        >
                  Como llegar
                        </button>
                     </div>
                     <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/40">
                        <h3 className="flex items-center gap-2 text-2xl font-bold text-white mb-3">
                           <Clock className="text-orange-500" /> Horario
                        </h3>
                        <ScheduleDisplay schedule={establishment.schedule} isOpen={establishment.isOpen} />
                     </div>
                  </div>
               </div>
            </div>

            <Section title="Valoracion">
               <RatingBar average={establishment.averageRating} totalReviews={establishment.totalReviews} />
            </Section>

            {/* ── CTA final — condicional según estado de login ────────────── */}
            <div className="mt-8 mb-6">
               {isLoggedInClient ? (
               // Cliente logueado → botón de reservar
                  <button
                     onClick={() => setReservationOpen(true)}
                     className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-bold text-white transition hover:bg-orange-600 active:scale-[0.98]"
                  >
                     <CalendarDays size={18} />
              Reservar mesa
                  </button>
               ) : (
               // No logueado → invitar a registrarse
                  <button
                     onClick={() => navigate("/register")}
                     className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-bold text-white transition hover:bg-orange-600 active:scale-[0.98]"
                  >
              Regístrate aquí
                  </button>
               )}
            </div>

            <Footer />
         </Container>
      </div>
   );
};