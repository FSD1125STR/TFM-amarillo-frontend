import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import { establishmentService } from "../../services/establishmentService";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

export default function NearbySection() {
   const navigate = useNavigate();
   const [establishments, setEstablishments] = useState([]);
   const [currentIndex, setCurrentIndex] = useState(0);

   useEffect(() => {
      loadEstablishments();
   }, []);

   const loadEstablishments = async () => {
      try {
         const response = await establishmentService.getAll();
         setEstablishments(response.data || []);
      } catch (error) {
         console.error("Error cargando establecimientos:", error);
      }
   };

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

   if (!establishments.length) {return null;}

   return (
      <section className="px-4 mt-8">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
               Establecimientos cercanos
            </h2>
            <span
               onClick={() => navigate("/establishments")}
               className="text-orange-400 cursor-pointer hover:text-orange-500 transition-colors"
            >
               Ver todos
            </span>
         </div>

         <div className="relative w-full max-w-md mx-auto overflow-hidden"/>

         {/* SLIDES */}
         <div className="relative w-full overflow-hidden">
            <div
               className="flex transition-transform duration-500 ease-in-out"
               style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
               }}
            >  
               {establishments.map((establishment) => (
                  <div
                     key={establishment._id}
                     className="w-full shrink-0"
                  >
                     <div
                        onClick={() =>
                           navigate(`/establishment/${establishment.slug}`)
                        }
                        className="bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-lg"
                     >
                        <img
                           src={establishment.mainImage || "/Logo.jpg"}
                           alt={establishment.name}
                           className="h-56 w-full object-cover"
                           onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/Logo.jpg";
                           }}
                        />

                        <div className="p-4 space-y-2">
                           <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-lg truncate">
                                 {establishment.name}
                              </h3>
                              <Badge>
                                 {establishment.averageRating?.toFixed(1) || "0.0"}
                              </Badge>
                           </div>

                           <p className="text-sm text-neutral-400">
                              {establishment.cuisineType?.[0] || "Restaurante"}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* BOTÓN IZQUIERDA */}
            <button
               onClick={prevSlide}
               className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
               <ArrowLeftFromLine />
            </button>

            {/* BOTÓN DERECHA */}
            <button
               onClick={nextSlide}
               className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
               <ArrowRightFromLine />
            </button>
         </div>

         {/* INDICADORES */}
         <div className="flex justify-center mt-4 gap-2">
            {establishments.map((_, index) => (
               <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full cursor-pointer transition-all ${
                     index === currentIndex
                        ? "bg-orange-500 w-4"
                        : "bg-neutral-600"
                  }`}
               />
            ))}
         </div>
      </section>
   );
}