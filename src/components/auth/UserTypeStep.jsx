

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userTypeStepSchema } from '../../schemas/authSchemas';
import { useState } from 'react';

/**
 * PASO 2: SELECCIÓN DE TIPO DE USUARIO
 * 
 * Cards visuales grandes para elegir entre Cliente o Hostelero.
 * Diseño mobile-first con iconos y descripciones claras.
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Datos iniciales
 * @param {Function} props.onNext - Callback al siguiente paso
 * @param {Function} props.onBack - Callback al paso anterior
 */
export default function UserTypeStep({ initialData, onNext, onBack }) {
   // ============================================
   // ESTADO
   // ============================================
  
   const [selectedType, setSelectedType] = useState(initialData?.tipoUsuario || '');

   const {
      setValue,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(userTypeStepSchema),
      defaultValues: initialData,
   });

   // ============================================
   // CONFIGURACIÓN DE CARDS
   // ============================================
  
   const userTypes = [
      {
         id: 'cliente',
         title: 'Cliente',
         description: 'Descubre y valora tapas en tu ciudad',
         icon: 'restaurant',
         features: [
            'Busca establecimientos cerca de ti',
            'Guarda tus tapas favoritas',
            'Comparte opiniones y fotos',
         ],
         color: 'orange',
      },
      {
         id: 'hostelero',
         title: 'Hostelero',
         description: 'Gestiona tu establecimiento y atrae clientes',
         icon: 'store',
         features: [
            'Crea el perfil de tu local',
            'Publica tu carta de tapas',
            'Recibe valoraciones y mejora',
         ],
         color: 'blue',
      },
   ];

   // ============================================
   // HANDLERS
   // ============================================
  
   const handleSelectType = (type) => {
      setSelectedType(type);
      setValue('tipoUsuario', type);
   };

   const onSubmit = (data) => {
      onNext(data);
   };

   // ============================================
   // RENDER
   // ============================================
  
   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         {/* ========== CARDS DE SELECCIÓN ========== */}
         <div className="space-y-4">
            {userTypes.map((type) => {
               const isSelected = selectedType === type.id;
               const colorClasses = type.color === 'orange' 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-blue-500 bg-blue-500/10';
               const iconColorClass = type.color === 'orange'
                  ? 'text-orange-500'
                  : 'text-blue-500';

               return (
                  <button
                     key={type.id}
                     type="button"
                     onClick={() => handleSelectType(type.id)}
                     className={`
                w-full p-6 rounded-2xl border-2 text-left
                transition-all duration-200
                active:scale-[0.98]
                ${isSelected 
                     ? colorClasses
                     : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
                  }
              `}
                  >
                     {/* Header del card */}
                     <div className="flex items-start gap-4 mb-4">
                        {/* Icono */}
                        <div className={`
                  p-3 rounded-xl
                  ${isSelected 
                     ? type.color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                     : 'bg-neutral-800'
                  }
                `}>
                           <span className={`
                    material-symbols-outlined text-3xl
                    ${isSelected ? 'text-white' : iconColorClass}
                  `}>
                              {type.icon}
                           </span>
                        </div>

                        {/* Título y descripción */}
                        <div className="flex-1">
                           <h3 className="text-xl font-bold text-white mb-1">
                              {type.title}
                           </h3>
                           <p className="text-sm text-neutral-400">
                              {type.description}
                           </p>
                        </div>

                        {/* Checkmark si está seleccionado */}
                        {isSelected && (
                           <span className={`
                    material-symbols-outlined text-2xl
                    ${type.color === 'orange' ? 'text-orange-500' : 'text-blue-500'}
                  `}>
                    check_circle
                           </span>
                        )}
                     </div>

                     {/* Lista de características */}
                     <ul className="space-y-2">
                        {type.features.map((feature, index) => (
                           <li 
                              key={index}
                              className="flex items-start gap-2 text-sm text-neutral-300"
                           >
                              <span className={`
                      material-symbols-outlined text-base mt-0.5
                      ${isSelected ? iconColorClass : 'text-neutral-500'}
                    `}>
                      check
                              </span>
                              {feature}
                           </li>
                        ))}
                     </ul>
                  </button>
               );
            })}
         </div>

         {/* ========== MENSAJE DE ERROR ========== */}
         {errors.tipoUsuario && (
            <p className="text-red-500 text-sm flex items-center gap-1">
               <span className="material-symbols-outlined text-base">error</span>
               {errors.tipoUsuario.message}
            </p>
         )}

         {/* ========== BOTONES DE NAVEGACIÓN ========== */}
         <div className="flex gap-3">
            {/* Botón Atrás */}
            <button
               type="button"
               onClick={onBack}
               className="
            px-6 py-3 rounded-xl
            bg-neutral-700 hover:bg-neutral-600
            text-white font-semibold
            transition-all duration-200
            active:scale-95
            flex items-center justify-center gap-2
          "
            >
               <span className="material-symbols-outlined">arrow_back</span>
          Atrás
            </button>

            {/* Botón Continuar */}
            <button
               type="submit"
               disabled={!selectedType}
               className="
            flex-1 px-6 py-3 rounded-xl
            bg-orange-500 hover:bg-orange-600
            text-white font-semibold
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95
            flex items-center justify-center gap-2
          "
            >
          Continuar
               <span className="material-symbols-outlined">arrow_forward</span>
            </button>
         </div>
      </form>
   );
}
