

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * CONTEXTO DE AUTENTICACIÓN
 * 
 * Maneja el estado global del usuario autenticado y provee funciones
 * para login, registro, logout y verificación de sesión.
 * 
 * Este contexto envuelve toda la aplicación y hace que el estado
 * de autenticación esté disponible en cualquier componente.
 */

// ============================================
// CREAR CONTEXTO
// ============================================

const AuthContext = createContext(null);

// ============================================
// HOOK PERSONALIZADO PARA USAR EL CONTEXTO
// ============================================

/**
 * Hook para acceder al contexto de autenticación
 * Lanza error si se usa fuera del Provider
 * 
 * @returns {Object} Estado y funciones de autenticación
 */
export const useAuth = () => {
   const context = useContext(AuthContext);
  
   if (!context) {
      throw new Error('useAuth debe usarse dentro de AuthProvider');
   }
  
   return context;
};

// ============================================
// PROVIDER DEL CONTEXTO
// ============================================

/**
 * Componente Provider que envuelve la app
 * Provee el estado de autenticación a todos los componentes hijos
 */
export const AuthProvider = ({ children }) => {
   // ============================================
   // ESTADO
   // ============================================
  
   /**
   * Usuario actual autenticado
   * null = no autenticado
   * object = usuario logueado con sus datos
   */
   const [user, setUser] = useState(null);
  
   /**
   * Indica si estamos verificando la sesión inicial
   * true = cargando, false = ya verificó
   */
   const [isLoading, setIsLoading] = useState(true);
  
   /**
   * Indica si el usuario está autenticado
   */
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   // ============================================
   // VERIFICACIÓN DE SESIÓN AL CARGAR LA APP
   // ============================================
  
   /**
   * Al montar el componente, verifica si hay una sesión activa
   * Esto permite que el usuario permanezca logueado al recargar
   */
   useEffect(() => {
      checkUserSession();
   }, []);

   /**
   * Verifica si hay un usuario logueado (cookie válida)
   */
   const checkUserSession = async () => {
      try {
         setIsLoading(true);
      
         const userData = await authService.checkAuth();
      
         if (userData && userData.user) {
            setUser(userData.user);
            setIsAuthenticated(true);
            console.log('✅ Sesión recuperada:', userData.user);
         } else {
            setUser(null);
            setIsAuthenticated(false);
            console.log('ℹ️ No hay sesión activa');
         }
      } catch (error) {
         console.error('❌ Error verificando sesión:', error);
         setUser(null);
         setIsAuthenticated(false);
      } finally {
         setIsLoading(false);
      }
   };

   // ============================================
   // FUNCIONES DE AUTENTICACIÓN
   // ============================================

   /**
   * REGISTRO DE NUEVO USUARIO
   * 
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Usuario registrado
   * @throws {Error} Si el registro falla
   */
   const register = async (userData) => {
      try {
         console.log('📝 Registrando usuario...');
      
         const response = await authService.register(userData);
      
         // Después del registro exitoso, loguear automáticamente
         if (response.user) {
            setUser(response.user);
            setIsAuthenticated(true);
            console.log('✅ Usuario registrado y logueado:', response.user);
         }
      
         return response;
      } catch (error) {
         console.error('❌ Error en registro:', error);
         throw error;
      }
   };

   /**
   * LOGIN DE USUARIO EXISTENTE
   * 
   * @param {Object} credentials - Email y password
   * @returns {Promise<Object>} Usuario logueado
   * @throws {Error} Si el login falla
   */
   const login = async (credentials) => {
      try {
         console.log('🔐 Iniciando sesión...');
      
         const response = await authService.login(credentials);
      
         if (response.user) {
            setUser(response.user);
            setIsAuthenticated(true);
            console.log('✅ Usuario logueado:', response.user);
         }
      
         return response;
      } catch (error) {
         console.error('❌ Error en login:', error);
         throw error;
      }
   };

   /**
   * LOGOUT DEL USUARIO
   * Limpia el estado y la cookie de sesión
   * 
   * @returns {Promise<void>}
   */
   const logout = async () => {
      try {
         console.log('👋 Cerrando sesión...');
      
         await authService.logout();
      
         // Limpiar estado local
         setUser(null);
         setIsAuthenticated(false);
      
         console.log('✅ Sesión cerrada correctamente');
      } catch (error) {
         console.error('❌ Error en logout:', error);
      
         // Aunque falle la petición, limpiamos el estado local
         setUser(null);
         setIsAuthenticated(false);
      }
   };

   /**
   * ACTUALIZA LOS DATOS DEL USUARIO
   * Útil después de editar perfil, cambiar foto, etc.
   * 
   * @param {Object} updatedUserData - Datos actualizados del usuario
   */
   const updateUser = (updatedUserData) => {
      setUser(prev => ({
         ...prev,
         ...updatedUserData,
      }));
      console.log('🔄 Usuario actualizado:', updatedUserData);
   };

   // ============================================
   // VALOR DEL CONTEXTO
   // ============================================
  
   /**
   * Objeto con todo lo que exponemos a los componentes
   */
   const value = {
      // Estado
      user,
      isAuthenticated,
      isLoading,
    
      // Funciones
      register,
      login,
      logout,
      updateUser,
      checkUserSession,
   };

   // ============================================
   // RENDER
   // ============================================
  
   /**
   * Mientras verificamos la sesión inicial, mostramos un loading
   * Esto evita que se vea un "flash" de contenido no autenticado
   */
   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-neutral-900">
            <div className="text-center space-y-4">
               <span className="material-symbols-outlined text-6xl text-orange-500 animate-spin">
            progress_activity
               </span>
               <p className="text-neutral-400">Cargando...</p>
            </div>
         </div>
      );
   }

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
};

export default AuthContext;