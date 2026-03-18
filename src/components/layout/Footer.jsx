import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Heart, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAccountRouteByRole } from "../../utils/authRedirect";

const baseItems = [
   { id: "home", label: "Home", Icon: Home, path: "/" },
   { id: "explore", label: "Explore", Icon: Compass, path: "/explore" },
   { id: "saved", label: "Saved", Icon: Heart, path: "/saved" },
];

export const Footer = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { isAuthenticated, user } = useAuth();

   const profilePath = isAuthenticated ? getAccountRouteByRole(user?.role) : "/login";

   const items = [
      ...baseItems,
      { id: "profile", label: "Profile", Icon: User, path: profilePath },
   ];

   const isPathActive = (path) => {
      if (path === "/admin") {
         return location.pathname.startsWith("/admin");
      }

      if (path === "/host/dashboard") {
         return location.pathname.startsWith("/host");
      }

      return location.pathname === path;
   };

   const handleItemClick = (path) => {
      navigate(path);
   };

   return (
      <>
         <div className="h-16" />
         <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50">
            <div className="flex justify-around items-center px-4 py-2 max-w-3xl mx-auto">
               {items.map(({ id, label, Icon, path }) => {
                  const isActive = isPathActive(path);

                  return (
                     <button
                        key={id}
                        onClick={() => handleItemClick(path)}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 active:scale-90 ${
                           isActive
                              ? "text-orange-500"
                              : "text-neutral-500 hover:text-neutral-300"
                        }`}
                     >
                        <div className="relative">
                           <Icon
                              size={22}
                              strokeWidth={isActive ? 2.5 : 1.8}
                              fill={isActive ? "currentColor" : "none"}
                           />
                           {isActive && (
                              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                           )}
                        </div>
                        <span className={`text-[10px] tracking-wide ${isActive ? "font-semibold" : "font-normal"}`}>
                           {label}
                        </span>
                     </button>
                  );
               })}
            </div>
         </footer>
      </>
   );
};
