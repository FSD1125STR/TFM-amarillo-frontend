import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schemas/authSchemas';
import FormInput from '../common/FormInput';
import { useAuth } from '../../context/AuthContext'; // 👈 NUEVO

export default function LoginForm() {
   const navigate = useNavigate();
   const { login } = useAuth(); // 👈 NUEVO
   const [loginError, setLoginError] = useState(null);

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(loginSchema),
      mode: 'onChange',
   });

   const onSubmit = async (data) => {
      try {
         setLoginError(null);

         // 👇 AHORA USA LA FUNCIÓN REAL DEL CONTEXTO
         await login(data);
      
         // Si llega aquí, el login fue exitoso
         navigate('/');
      
      } catch (error) {
         console.error('❌ Error en login:', error);
         setLoginError(
            error.message || 'Email o contraseña incorrectos'
         );
      }
   };

   // ... resto del código igual
   return (
      <div className="space-y-6">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
               id="email"
               label="Correo electrónico"
               type="email"
               autoComplete="email"
               autoFocus
               placeholder="tu@email.com"
               icon="mail"
               register={register('email')}
               error={errors.email}
            />

            <FormInput
               id="password"
               label="Contraseña"
               type="password"
               autoComplete="current-password"
               placeholder="Tu contraseña"
               icon="lock"
               register={register('password')}
               error={errors.password}
            />

            <div className="text-right">
               <Link 
                  to="/forgot-password" 
                  className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
               >
            ¿Olvidaste tu contraseña?
               </Link>
            </div>

            {loginError && (
               <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                  <div className="flex gap-3">
                     <span className="material-symbols-outlined text-red-500">
                error
                     </span>
                     <p className="text-red-500 text-sm">{loginError}</p>
                  </div>
               </div>
            )}

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
              Iniciando sesión...
                  </>
               ) : (
                  <>
              Iniciar sesión
                     <span className="material-symbols-outlined">login</span>
                  </>
               )}
            </button>
         </form>

         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
               <span className="px-4 bg-neutral-800 text-neutral-400">
            ¿No tienes cuenta?
               </span>
            </div>
         </div>

         <Link
            to="/register"
            className="
          block w-full px-6 py-3 rounded-xl
          bg-neutral-700 hover:bg-neutral-600
          text-white font-semibold text-center
          transition-all duration-200
          active:scale-95
        "
         >
        Crear una cuenta
         </Link>
      </div>
   );
}