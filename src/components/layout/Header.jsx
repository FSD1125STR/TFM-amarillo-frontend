import { useEffect, useRef, useState } from "react";
import {
   Search,
   CircleUserRound,
   Circle,
   ChevronDown,
   LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAccountRouteByRole } from "../../utils/authRedirect";
import Input from "../common/Input";

export default function Header() {
   const navigate = useNavigate();
   const { isAuthenticated, user, logout } = useAuth();
   const [menuOpen, setMenuOpen] = useState(false);
   const menuRef = useRef(null);

   const accountPath = getAccountRouteByRole(user?.role);
   const accountLabel = user?.role === "cliente" ? "Mi perfil" : "Mi panel";

   useEffect(() => {
      const handleOutsideClick = (event) => {
         if (!menuRef.current?.contains(event.target)) {
            setMenuOpen(false);
         }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
         document.removeEventListener("mousedown", handleOutsideClick);
      };
   }, []);

   const handleLogout = () => {
      logout();
      setMenuOpen(false);
      navigate("/");
   };

   return (
      <header className="bg-neutral-950 border-b border-neutral-800/60 px-4 pt-5 pb-4 max-w-3xl mx-auto">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
               <Circle className="text-orange-500 text-2xl leading-none" />
               <h1 className="text-2xl font-black tracking-tight text-white">
            nex<span className="text-orange-500">Tapa</span>
               </h1>
            </div>

            {!isAuthenticated ? (
               <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors text-sm font-semibold text-white no-underline"
               >
                  <CircleUserRound className="w-4 h-4" />
                  Login
               </Link>
            ) : (
               <div className="relative" ref={menuRef}>
                  <button
                     type="button"
                     onClick={() => setMenuOpen((prev) => !prev)}
                     className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                     <CircleUserRound className="h-4 w-4" />
                     <span className="max-w-[110px] truncate">
                        {user?.name || "Cuenta"}
                     </span>
                     <ChevronDown
                        className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                     />
                  </button>

                  {menuOpen && (
                     <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl">
                        <div className="border-b border-neutral-800 px-4 py-3">
                           <p className="m-0 text-xs text-neutral-400">Sesion iniciada como</p>
                           <p className="m-0 truncate text-sm font-semibold text-white">
                              {user?.email || "usuario"}
                           </p>
                        </div>

                        <Link
                           to={accountPath}
                           onClick={() => setMenuOpen(false)}
                           className="flex items-center gap-2 px-4 py-3 text-sm text-neutral-100 no-underline transition-colors hover:bg-neutral-800"
                        >
                           <CircleUserRound className="h-4 w-4 text-orange-400" />
                           {accountLabel}
                        </Link>

                        <button
                           type="button"
                           onClick={handleLogout}
                           className="flex w-full items-center gap-2 border-t border-neutral-800 px-4 py-3 text-left text-sm text-rose-300 transition-colors hover:bg-neutral-800"
                        >
                           <LogOut className="h-4 w-4" />
                           Cerrar sesion
                        </button>
                     </div>
                  )}
               </div>
            )}
         </div>

         <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <Input
               placeholder="Tu próxima tapa aquí..."
               className="pl-9"
            />
         </div>

      </header>
   );
}
