

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientDataStepSchema } from '../../schemas/authSchemas';
import FormInput from '../common/FormInput';

/**
 * PASO 3A: DATOS PERSONALES DEL CLIENTE
 * 
 * Captura nombre, apellidos y contraseña del usuario tipo cliente.
 * Incluye validación de que las contraseñas coincidan.
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Datos iniciales
 * @param {Function} props.onNext - Callback al siguiente paso o submit final
 * @param {Function} props.onBack - Callback al paso anterior
 * @param {boolean} props.isLastStep - Si es el último paso (para clientes lo es)
 * @param {boolean} props.isSubmitting - Estado de envío
 */
export default function ClientDataStep({ 
   initialData, 
   onNext, 
   onBack, 
   isLastStep,
   isSubmitting 
}) {
   // ============================================
   // CONFIGURACIÓN DEL FORMULARIO
   // ============================================
  
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(clientDataStepSchema),
      defaultValues: initialData,
      mode: 'onChange',
   });

   // Observamos el campo password para validar confirmación en tiempo real
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

         {/* ========== INFO DE REQUISITOS DE CONTRASEÑA ========== */}
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
            {/* Botón Atrás */}
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

            {/* Botón Continuar / Crear cuenta */}
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
               ) : isLastStep ? (
                  <>
              Crear cuenta
                     <span className="material-symbols-outlined">check</span>
                  </>
               ) : (
                  <>
              Continuar
                     <span className="material-symbols-outlined">arrow_forward</span>
                  </>
               )}
            </button>
         </div>
      </form>
   );
}