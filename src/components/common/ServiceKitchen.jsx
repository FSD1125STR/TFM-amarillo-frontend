

// src/components/common/ServiceKitchen.jsx
// Este componente muestra los servicios y tipos de cocina de un establecimiento.
import { Utensils, Sparkles } from "lucide-react";

export const ServiceKitchen = ({ features = [], cuisineType = [] }) => {
   if (features.length === 0 && cuisineType.length === 0) { return null; }

   return (
      <div className="mt-8">
         {/* TÍTULO SECCIÓN  */}
         <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Servicios & Cocina</h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full mt-2" />
         </div>

         <div className="flex flex-col md:flex-row gap-4">
            
            {/* SERVICIOS - ESTILO AZUL/NARANJA */}
            {features.length > 0 && (
               <div className="flex-1 bg-neutral-900 rounded-2xl p-6 border-2 border-orange-500 text-center min-h-[220px] flex flex-col">
                  <div>
                     <Sparkles className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                     <h3 className="text-white font-semibold text-lg mb-4">
                        Servicios
                     </h3>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 grow items-center">
                     {features.map((f, i) => (
                        <span
                           key={i}
                           className="text-xs bg-orange-500/20 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full"
                        >
                           {f}
                        </span>
                     ))}
                  </div>
               </div>
            )}

            {/* COCINA - ESTILO AZUL */}
            {cuisineType.length > 0 && (
               <div className="flex-1 bg-neutral-900 rounded-2xl p-6 border-2 border-blue-500 text-center min-h-[220px] flex flex-col">
                  <div>
                     <Utensils className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                     <h3 className="text-white font-semibold text-lg mb-4">
                        Tipo de Cocina
                     </h3>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 grow items-center">
                     {cuisineType.map((c, i) => (
                        <span
                           key={i}
                           className="text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full"
                        >
                           {c}
                        </span>
                     ))}
                  </div>
               </div>
            )}
            
         </div>
      </div>
   );
};