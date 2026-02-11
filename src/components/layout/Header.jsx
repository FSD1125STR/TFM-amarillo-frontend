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


import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 👈 NUEVO
import Input from "../common/Input";
import Button from "../common/Button";

export default function Header() {
   const navigate = useNavigate();
   const { user, isAuthenticated, logout } = useAuth(); // 👈 NUEVO

   const handleAuthAction = () => {
      if (isAuthenticated) {
         // Si está logueado, hacer logout
         logout();
      } else {
         // Si no está logueado, ir a login
         navigate('/login');
      }
   };

   return (
      <header className="p-4 space-y-4 max-w-md mx-auto">
         <div className="flex justify-between items-center">
            <h1 
               className="text-2xl font-bold cursor-pointer hover:text-orange-400 transition-colors"
               onClick={() => navigate('/')}
            >
               nexTapa
            </h1>
            
            {/* 👇 NUEVO: Mostrar nombre o botón de login */}
            {isAuthenticated && user ? (
               <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-400">
                     Hola, <span className="text-white font-medium">{user.nombre}</span>
                  </span>
                  <Button 
                     className="px-4 py-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors text-sm"
                     onClick={handleAuthAction}
                  >
                     Salir
                  </Button>
               </div>
            ) : (
               <Button 
                  className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors"
                  onClick={handleAuthAction}
               >
                  Login
               </Button>
            )}
         </div>
         
         <Input 
            placeholder="Tu próxima tapa aquí..."
            className="w-full px-4 py-3 rounded-xl bg-neutral-800" 
         />
      </header>
   );
}