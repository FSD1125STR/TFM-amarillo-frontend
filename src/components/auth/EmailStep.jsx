

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailStepSchema } from '../../schemas/authSchemas.js';

/**
 * PASO 1: CAPTURA DE EMAIL
 * 
 * Primer paso del registro donde el usuario ingresa su email.
 * Valida en tiempo real con Zod y muestra errores inline.
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Datos iniciales (si el usuario vuelve atrás)
 * @param {Function} props.onNext - Callback cuando el paso se completa
 */
export default function EmailStep({ initialData, onNext }) {
   // ============================================
   // CONFIGURACIÓN DEL FORMULARIO
   // ============================================
  
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(emailStepSchema), // Validación con Zod
      defaultValues: initialData, // Pre-llenamos si hay datos previos
      mode: 'onChange', // Valida mientras el usuario escribe
   });

   // ============================================
   // HANDLERS
   // ============================================
  
   /**
   * Se ejecuta cuando el formulario es válido
   * @param {Object} data - Datos validados del formulario
   */
   const onSubmit = (data) => {
      // Pasamos los datos al componente padre (RegisterFlow)
      onNext(data);
   };

   // ============================================
   // RENDER
   // ============================================
  
   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         {/* ========== CAMPO DE EMAIL ========== */}
         <div className="space-y-2">
            <label 
               htmlFor="email" 
               className="block text-sm font-medium text-neutral-300"
            >
          Correo electrónico
            </label>
        
            <input
               id="email"
               type="email"
               autoComplete="email"
               autoFocus
               placeholder="tu@email.com"
               className={`
            w-full px-4 py-3 rounded-xl
            bg-neutral-900 border
            text-white placeholder-neutral-500
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-500
            ${errors.email 
         ? 'border-red-500 focus:ring-red-500' 
         : 'border-neutral-700'
      }
          `}
               {...register('email')}
            />
        
            {/* Mensaje de error */}
            {errors.email && (
               <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">error</span>
                  {errors.email.message}
               </p>
            )}
         </div>

         {/* ========== INFO ADICIONAL ========== */}
         <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
            <div className="flex gap-3">
               <span className="material-symbols-outlined text-orange-500 text-xl">
            info
               </span>
               <div className="text-sm text-neutral-400">
                  <p className="font-medium text-neutral-300 mb-1">
              Te enviaremos un email de verificación
                  </p>
                  <p>
              Asegúrate de usar un email al que tengas acceso.
                  </p>
               </div>
            </div>
         </div>

         {/* ========== BOTÓN DE CONTINUAR ========== */}
         <button
            type="submit"
            disabled={isSubmitting}
            className="
          w-full px-6 py-3 rounded-xl
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
            Validando...
               </>
            ) : (
               <>
            Continuar
                  <span className="material-symbols-outlined">arrow_forward</span>
               </>
            )}
         </button>
      </form>
   );
}