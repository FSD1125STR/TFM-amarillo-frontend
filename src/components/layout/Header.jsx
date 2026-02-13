// import Input from "../common/Input";
// import Button from "../common/Button";

// export default function Header() {
//    return (
//       <header className="p-4 space-y-4 max-w-md mx-auto">
//          <div className="flex justify-between items-center">

        
//             <h1 className="text-2xl font-bold">nexTapa</h1>
//             <Button className="px-4 py-2 rounded-full bg-orange-500">Login Up</Button>
//          </div>
//          <Input 
//             placeholder="Tu proxima tapa aqui..."
//             className="w-full px-4 py-3 rounded-xl bg-neutral-800" />
//       </header>
//    );
// }



// Importamos el hook de navegación de React Router
import { useNavigate } from 'react-router-dom';

// Importamos nuestro hook personalizado de autenticación desde el contexto
// Este hook nos proporciona acceso al estado de autenticación global de la app
import { useAuth } from '../../context/AuthContext';

// Importamos componentes reutilizables de UI
import Input from "../common/Input";
import Button from "../common/Button";

export default function Header() {
   // Hook para navegación programática entre rutas
   const navigate = useNavigate();
   
   // Desestructuramos del contexto de autenticación:
   // - user: objeto con datos del usuario logueado (nombre, email, rol, etc.)
   // - isAuthenticated: boolean que indica si hay un usuario autenticado
   // - logout: función para cerrar sesión (limpia token y estado)
   const { user, isAuthenticated, logout } = useAuth();

   /**
    * Manejador unificado para la acción del botón de autenticación
    * Comportamiento dinámico basado en el estado de autenticación:
    * - Si está logueado → ejecuta logout (cierra sesión)
    * - Si NO está logueado → navega a la página de login
    */
   const handleAuthAction = () => {
      if (isAuthenticated) {
         // Usuario autenticado: llamamos a logout que limpiará el token y el estado
         logout();
      } else {
         // Usuario no autenticado: redirigimos a la página de login
         navigate('/login');
      }
   };

   return (
      
   <>
      <header className="p-4 max-w-3xl mx-auto">
      
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold cursor-pointer hover:text-orange-400 transition-colors"
               onClick={() => navigate('/')}
            >
               nexTapa
            </h1>
            
            {/* 
               Renderizado condicional del área de autenticación:
               Si el usuario está autenticado Y tenemos sus datos → mostramos saludo + botón salir
               Si NO está autenticado → mostramos solo botón de login
            */}
            {isAuthenticated && user ? (
               // Vista para usuario autenticado: saludo personalizado + botón logout
               <div className="flex items-center gap-3">
                  {/* Mensaje de bienvenida con el nombre del usuario */}
                  <span className="text-sm text-neutral-400">
                     Hola, <span className="text-white font-medium">{user.nombre}</span>
                  </span>
                  
                  {/* Botón de logout con estilo neutral/gris */}
                  <Button 
                     className="px-4 py-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors text-sm"
                     onClick={handleAuthAction}
                  >
                     Salir
                  </Button>
               </div>
            ) : (
               // Vista para usuario NO autenticado: solo botón de login con color naranja (CTA)
               <Button 
                  className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors"
                  onClick={handleAuthAction}
               >
                  Login
               </Button>
            )}
         </div>
         
         {/* 
            Barra de búsqueda principal
            Input reutilizable con placeholder descriptivo y estilo dark
            TODO: Implementar funcionalidad de búsqueda de establecimientos
         */}
         <br />
         <div className="flex justify-center">
            <div className="w-full max-w-3xl px-4">
            <Input placeholder="Tu próxima tapa aquí..." />
            </div>
         </div>
      </header>
   </>
   );
}