import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, User, ChefHat, LayoutDashboard } from "lucide-react";
import { getAccountRouteByRole } from "../../utils/authRedirect";

const baseItems = [
   { id: "home",   label: "Home",   Icon: Home,   path: "/" },
   { id: "search", label: "Search", Icon: Search, path: "/search" },
];

export const Footer = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { isAuthenticated, user } = useAuth();

   const profilePath = isAuthenticated ? "/profile" : "/profile";
   const profileAvatar = isAuthenticated && user?.role === "cliente" ? user?.avatar : null;

   const profileItem = {
      id: "profile",
      label: isAuthenticated ? "Perfil" : "Login",
      Icon: User,
      path: profilePath,
      avatar: profileAvatar,
   };

   const adminItem = (() => {
      if (user?.role === "admin") {
         return { id: "admin", label: "Admin", Icon: LayoutDashboard, path: "/admin" };
      }
      if (user?.role === "hostelero") {
         return { id: "admin", label: "Admin", Icon: ChefHat, path: "/host/dashboard" };
      }
      return null;
   })();

   const items = [...baseItems, ...(adminItem ? [adminItem] : []), profileItem];

   const isPathActive = (path) => {
      if (path === "/admin") {return location.pathname.startsWith("/admin");}
      if (path === "/host/dashboard") {return location.pathname.startsWith("/host");}
      return location.pathname === path;
   };

   return (
      <>
         <div className="h-16" />
         <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50">
            <div className="flex justify-around items-center px-4 py-2 max-w-3xl mx-auto">
               {items.map((item) => {
                  const isActive = isPathActive(item.path);
                  const ItemIcon = item.Icon;

                  return (
                     <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 active:scale-90 ${
                           isActive
                              ? "text-orange-500"
                              : "text-neutral-500 hover:text-neutral-300"
                        }`}
                     >
                        <div className="relative">
                           {item.id === "profile" && item.avatar ? (
                              <img
                                 src={item.avatar}
                                 alt="avatar"
                                 className={`w-6 h-6 rounded-full object-cover ${
                                    isActive ? "ring-2 ring-orange-500" : "ring-1 ring-neutral-600"
                                 }`}
                              />
                           ) : (
                              <ItemIcon
                                 size={22}
                                 strokeWidth={isActive ? 2.5 : 1.8}
                                 fill={isActive ? "currentColor" : "none"}
                              />
                           )}
                           {isActive && (
                              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                           )}
                        </div>
                        <span className={`text-[10px] tracking-wide ${isActive ? "font-semibold" : "font-normal"}`}>
                           {item.label}
                        </span>
                     </button>
                  );
               })}
            </div>
         </footer>
      </>
   );
};