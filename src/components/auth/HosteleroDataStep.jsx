

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hosteleroDataStepSchema } from '../../schemas/authSchemas';
import FormInput from '../common/FormInput';

/**
 * PASO 3B: DATOS PERSONALES DEL HOSTELERO
 * 
 * Similar a ClientDataStep pero incluye el nombre comercial.
 * Para hosteleros que quieren registrar su establecimiento.
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Datos iniciales
 * @param {Function} props.onNext - Callback al siguiente paso
 * @param {Function} props.onBack - Callback al paso anterior
 */
export default function HosteleroDataStep({ initialData, onNext, onBack }) {
   // ============================================
   // CONFIGURACIÓN DEL FORMULARIO
   // ============================================
  
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(hosteleroDataStepSchema),
      defaultValues: initialData,
      mode: 'onChange',
   });

   const password = watch('password');

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
         {/* ========== NOMBRE ========== */}
         <FormInput
            id="nombre"
            label="Nombre"
            type="text"
            autoComplete="given-name"
            placeholder="Juan"
            icon="person"
            register={register('nombre')}
            error={errors.nombre}
         />

         {/* ========== APELLIDOS ========== */}
         <FormInput
            id="apellidos"
            label="Apellidos"
            type="text"
            autoComplete="family-name"
            placeholder="García López"
            icon="badge"
            register={register('apellidos')}
            error={errors.apellidos}
         />

         {/* ========== NOMBRE COMERCIAL ========== */}
         <FormInput
            id="nombreComercial"
            label="Nombre comercial"
            type="text"
            placeholder="Bar Pepe, Restaurante La Esquina..."
            icon="storefront"
            register={register('nombreComercial')}
            error={errors.nombreComercial}
         />

         {/* ========== CONTRASEÑA ========== */}
         <FormInput
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            icon="lock"
            register={register('password')}
            error={errors.password}
         />

         {/* ========== CONFIRMAR CONTRASEÑA ========== */}
         <FormInput
            id="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
            icon="lock"
            register={register('confirmPassword')}
            error={errors.confirmPassword}
         />

         {/* ========== INFO DE REQUISITOS ========== */}
         <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
            <p className="text-xs text-neutral-400 mb-2 font-medium">
          La contraseña debe contener:
            </p>
            <ul className="space-y-1 text-xs text-neutral-500">
               <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm ${
                     password?.length >= 6 ? 'text-green-500' : 'text-neutral-600'
                  }`}>
                     {password?.length >= 6 ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
            Mínimo 6 caracteres
               </li>
               <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm ${
                     /[A-Z]/.test(password) ? 'text-green-500' : 'text-neutral-600'
                  }`}>
                     {/[A-Z]/.test(password) ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
            Al menos una mayúscula
               </li>
               <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm ${
                     /[a-z]/.test(password) ? 'text-green-500' : 'text-neutral-600'
                  }`}>
                     {/[a-z]/.test(password) ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
            Al menos una minúscula
               </li>
               <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm ${
                     /\d/.test(password) ? 'text-green-500' : 'text-neutral-600'
                  }`}>
                     {/\d/.test(password) ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
            Al menos un número
               </li>
            </ul>
         </div>

         {/* ========== BOTONES DE NAVEGACIÓN ========== */}
         <div className="flex gap-3 pt-2">
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

            <button
               type="submit"
               className="
            flex-1 px-6 py-3 rounded-xl
            bg-orange-500 hover:bg-orange-600
            text-white font-semibold
            transition-all duration-200
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