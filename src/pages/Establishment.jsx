import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import ActionButton from "../components/common/ActionButton";
import Tag from "../components/common/Tag";
import RatingBar from "../components/common/RatingBar";

import { establishmentService } from "../services/establishmentService.js";
import { ItemGallery } from "../components/common/ItemGallery";


export const Establishment = () => {
   const navigate = useNavigate();
   const { id } = useParams(); //para obtener el id de los parametros de la bbdd

   const [establishment, setEstablishment] = useState(null); //variable para guardar los datos que vienen de la bbdd
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   //  CARGAR DATOS CUANDO EL COMPONENTE SE MONTA
   useEffect(() => {
      loadEstablishmentData();
   }, [id]); // Se ejecuta cuando cambia el ID


   // FUNCIÓN PARA CARGAR DATOS
   const loadEstablishmentData = async () => {
      try {
         setLoading(true);
         setError(null);

         // Llamar a la API
         const response = await establishmentService.getById(id);
         
         // Guardar los datos en el estado
         setEstablishment(response.data);         
         console.log(' Datos cargados:', response.data);

      } catch (err) {
         console.error(' Error cargando establecimiento:', err);
         setError('No se pudo cargar el establecimiento');
      } finally {
         setLoading(false);
      }
   };
   //  MIENTRAS CARGA, MOSTRAR UN LOADING
   if (loading) {
      return (
         <Container>
            <div className="flex items-center justify-center h-screen">
               <p className="text-lg">Cargando establecimiento...</p>
            </div>
         </Container>
      );
   }

   
   
   // SI HAY ERROR O NO HAY DATOS
   if (error || !establishment) {
      return (
         <Container>
            <div className="flex flex-col items-center justify-center h-screen">
               <p className="text-lg text-red-500 mb-4">
                  {error || 'Establecimiento no encontrado'}
               </p>
               <Button onClick={() => navigate('/')}>Volver al inicio</Button>
            </div>
         </Container>
      );
   }





   // PINTAR LOS DATOS REALES
   return (
      <div>
         <div className="relative h-72 max-w-3xl mx-auto">
            <img
               src={establishment.mainImage || "https://images.unsplash.com/photo-1559339352-11d035aa65de"}
               className="w-full h-full object-cover rounded-xl"
               alt={establishment.name}
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
               <button
                  onClick={() => navigate(-1)}
                  className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
               </button>
               <span className="text-white font-semibold">nexTapa</span>
               <button className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
               </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
               {establishment.verified && (
                  <Badge className="mb-2 inline-block">VERIFICADO</Badge>
               )}
               <h1 className="text-3xl font-bold text-white">
                  {establishment.name}
               </h1>
               <p className="text-sm text-neutral-300">
                  ⭐ {establishment.averageRating?.toFixed(1) || '0.0'} - {establishment.totalReviews || 0} reviews
               </p>
            </div>
         </div>

         <Container>
            {/* GALERIA DE IMAGENES  */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
               {[
                  establishment.mainImage || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
                  "https://images.unsplash.com/photo-1604908177522-429a7c04b6a4",
                  "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
               ].map((img, i) => (
                  <img
                     key={i}
                     src={img}
                     alt={`Gallery ${i + 1}`}
                     className="h-20 w-32 object-cover rounded-lg shrink-0"
                  />
               ))}
               
            </div>
            {/* GALERÍA DE TAPAS */}
            <Section title="Nuestras Tapas">
               <ItemGallery establishmentId={establishment._id} />
            </Section>

            <div className="grid grid-cols-3 gap-3 mt-6">
               <ActionButton label="Menu" />
               <ActionButton 
                  label="Telefono" 
                  onClick={() => window.location.href = `tel:${establishment.phone}`}
               />
               <ActionButton label="Compartir" />
            </div>

            {/* DESCRIPCION */}
            {establishment.description && (
               <Section title="Descripción">
                  <p className="text-sm text-neutral-600">
                     {establishment.description}
                  </p>
               </Section>
            )}

            {/* SERVICIOS/CARACTERISTICAS */}
            {establishment.features && establishment.features.length > 0 && (
               <Section title="Servicios">
                  <div className="flex flex-wrap">
                     {establishment.features.map((feature, i) => (
                        <Badge key={i} variant="feature" className="mr-2 mb-2">
                           {feature}
                        </Badge>
                     ))}
                  </div>
               </Section>
            )}

            {/* TIPO DE COCINA */}
            {establishment.cuisineType && establishment.cuisineType.length > 0 && (
               <Section title="Tipo de Cocina">
                  <div className="flex flex-wrap">
                     {establishment.cuisineType.map((cuisine, i) => (
                        <Tag key={i} label={cuisine} />
                     ))}
                  </div>
               </Section>
            )}

            {/* RANGO DE PRECIOS */}
            {establishment.priceRange && (
               <Section title="Rango de precios">
                  <p className="text-sm text-neutral-50">
                     {establishment.priceRange.toString().includes(' €') 
                        ? establishment.priceRange 
                        : `${establishment.priceRange}€`}
                  </p>
               </Section>
            )}

            {/* RANGO DE PRECIOS */}
            {establishment.email && (
               <Section title="Rango de precios">
                  <p className="text-sm text-neutral-50">
                     {establishment.email}
                  </p>
               </Section>
            )}

            {/* UBICACION */}
            <Section title="Ubicación">
               <p className="text-sm text-neutral-400">
                  {establishment.address?.street}<br />
                  {establishment.address?.postalCode} {establishment.address?.city}, {establishment.address?.province}
               </p>
               
               {/* MAPA CON COORDENADAS REALES */}
               {establishment.location?.coordinates && (
                  <div className="mt-3 rounded-xl overflow-hidden">
                     <iframe
                        width="100%"
                        height="300"
                        frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${establishment.location.coordinates[0]-0.01},${establishment.location.coordinates[1]-0.01},${establishment.location.coordinates[0]+0.01},${establishment.location.coordinates[1]+0.01}&layer=mapnik&marker=${establishment.location.coordinates[1]},${establishment.location.coordinates[0]}`}
                        style={{ border: 0 }}
                     />
                  </div>
               )}
            </Section>

            {/* HORARIOS */}
            {establishment.schedule && Object.keys(establishment.schedule).length > 0 && (
               <Section title="Horarios">
                  {Object.entries(establishment.schedule).map(([day, hours]) => (
                     <div key={day} className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{day}:</span>
                        <span className="text-neutral-600">
                           {hours.open} - {hours.close}
                        </span>
                     </div>
                  ))}
               </Section>
            )}

            {/* OPINIONES */}
            <Section title="Opiniones">
               <div className="flex items-center gap-4">
                  <div>
                     <p className="text-3xl font-bold">
                        {establishment.averageRating?.toFixed(1) || '0.0'}
                     </p>
                     <p>{'⭐'.repeat(Math.round(establishment.averageRating || 0))}</p>
                     <p className="text-sm text-neutral-400">
                        {establishment.totalReviews || 0} reviews
                     </p>
                  </div>
                  <div className="flex-1 space-y-2">
                     <RatingBar stars={5} value={80} />
                     <RatingBar stars={4} value={10} />
                     <RatingBar stars={3} value={5} />
                  </div>
               </div>
            </Section>
             
            <div className="mt-8 mb-6">
               <Button className="w-full bg-orange-500 py-4 rounded-xl text-white font-semibold hover:bg-orange-600 transition-colors">
                  Registrate Aqui
               </Button>
            </div>
         </Container>
      </div>
   );
};