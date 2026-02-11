

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { establishmentStepSchema } from '../../schemas/authSchemas';
import FormInput from '../common/FormInput';

/**
 * PASO 4: DATOS DEL ESTABLECIMIENTO
 * 
 * Último paso solo para hosteleros.
 * Captura información del local/negocio.
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Datos iniciales del establecimiento
 * @param {Function} props.onNext - Callback de submit final
 * @param {Function} props.onBack - Callback al paso anterior
 * @param {boolean} props.isSubmitting - Estado de envío
 */
export default function EstablishmentStep({ 
   initialData, 
   onNext, 
   onBack, 
   isSubmitting 
}) {
   // ============================================
   // CONFIGURACIÓN DEL FORMULARIO
   // ============================================
  
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(establishmentStepSchema),
      defaultValues: initialData,
      mode: 'onChange',
   });

   // ============================================
   // HANDLERS
   // ============================================
  
   const onSubmit = (data) => {
      onNext(data);
   };

   // ============================================
   // RENDER
   // ============================================
  
   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         {/* ========== NOMBRE DEL ESTABLECIMIENTO ========== */}
         <FormInput
            id="nombre"
            label="Nombre del establecimiento"
            type="text"
            placeholder="Bar Pepe, Restaurante La Esquina..."
            icon="storefront"
            register={register('nombre')}
            error={errors.nombre}
         />

         {/* ========== TIPO DE ESTABLECIMIENTO ========== */}
         <div className="space-y-2">
            <label 
               htmlFor="tipo" 
               className="block text-sm font-medium text-neutral-300"
            >
          Tipo de establecimiento
            </label>
        
            <div className="relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-500">
            category
               </span>
          
               <select
                  id="tipo"
                  className={`
              w-full pl-11 pr-4 py-3 rounded-xl
              bg-neutral-900 border
              text-white
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-orange-500
              ${errors.tipo 
         ? 'border-red-500 focus:ring-red-500' 
         : 'border-neutral-700'
      }
            `}
                  {...register('tipo')}
               >
                  <option value="">Selecciona un tipo</option>
                  <option value="bar">Bar</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="cafeteria">Cafetería</option>
                  <option value="taperia">Tapería</option>
                  <option value="gastrobar">Gastrobar</option>
               </select>
            </div>
        
            {errors.tipo && (
               <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">error</span>
                  {errors.tipo.message}
               </p>
            )}
         </div>

         {/* ========== DESCRIPCIÓN (OPCIONAL) ========== */}
         <div className="space-y-2">
            <label 
               htmlFor="descripcion" 
               className="block text-sm font-medium text-neutral-300"
            >
          Descripción <span className="text-neutral-500 text-xs">(opcional)</span>
            </label>
        
            <textarea
               id="descripcion"
               rows="3"
               placeholder="Cuéntanos sobre tu establecimiento..."
               className={`
            w-full px-4 py-3 rounded-xl
            bg-neutral-900 border
            text-white placeholder-neutral-500
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-500
            resize-none
            ${errors.descripcion 
         ? 'border-red-500 focus:ring-red-500' 
         : 'border-neutral-700'
      }
          `}
               {...register('descripcion')}
            />
        
            {errors.descripcion && (
               <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">error</span>
                  {errors.descripcion.message}
               </p>
            )}
         </div>

         {/* ========== DIRECCIÓN ========== */}
         <FormInput
            id="direccion"
            label="Dirección"
            type="text"
            placeholder="Calle Principal, 123"
            icon="location_on"
            register={register('direccion')}
            error={errors.direccion}
         />

         {/* ========== CÓDIGO POSTAL Y CIUDAD ========== */}
         <div className="grid grid-cols-2 gap-3">
            <FormInput
               id="codigoPostal"
               label="Código Postal"
               type="text"
               placeholder="28001"
               register={register('codigoPostal')}
               error={errors.codigoPostal}
            />
        
            <FormInput
               id="ciudad"
               label="Ciudad"
               type="text"
               placeholder="Madrid"
               register={register('ciudad')}
               error={errors.ciudad}
            />
         </div>

         {/* ========== PROVINCIA ========== */}
         <FormInput
            id="provincia"
            label="Provincia"
            type="text"
            placeholder="Madrid"
            icon="map"
            register={register('provincia')}
            error={errors.provincia}
         />

         {/* ========== TELÉFONO (OPCIONAL) ========== */}
         <FormInput
            id="telefono"
            label="Teléfono"
            type="tel"
            placeholder="612345678"
            icon="phone"
            register={register('telefono')}
            error={errors.telefono}
         />

         {/* ========== INFO SOBRE MAPBOX ========== */}
         <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex gap-3">
               <span className="material-symbols-outlined text-blue-500 text-xl">
            info
               </span>
               <div className="text-sm text-neutral-300">
                  <p className="font-medium mb-1">Ubicación en el mapa</p>
                  <p className="text-neutral-400 text-xs">
              Próximamente podrás seleccionar la ubicación exacta de tu establecimiento en un mapa interactivo.
                  </p>
               </div>
            </div>
         </div>

         {/* ========== BOTONES DE NAVEGACIÓN ========== */}
         <div className="flex gap-3 pt-2">
            <button
               type="button"
               onClick={onBack}
               disabled={isSubmitting}
               className="
            px-6 py-3 rounded-xl
            bg-neutral-700 hover:bg-neutral-600
            text-white font-semibold
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95
            flex items-center justify-center gap-2
          "
            >
               <span className="material-symbols-outlined">arrow_back</span>
          Atrás
            </button>

            <button
               type="submit"
               disabled={isSubmitting}
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
               {isSubmitting ? (
                  <>
                     <span className="material-symbols-outlined animate-spin">
                progress_activity
                     </span>
              Creando cuenta...
                  </>
               ) : (
                  <>
              Crear cuenta
                     <span className="material-symbols-outlined">check</span>
                  </>
               )}
            </button>
         </div>
      </form>
   );
}
