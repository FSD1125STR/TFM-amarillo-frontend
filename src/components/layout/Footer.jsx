

// src/components/layout/Footer.jsx

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Heart, User } from "lucide-react";

const items = [
   { id: "home",    label: "Home",    Icon: Home,   path: "/" },
   { id: "search",  label: "Search",  Icon: Search, path: "/search" },
   { id: "saved",   label: "Saved",   Icon: Heart,  path: "/saved" },
   { id: "profile", label: "Profile", Icon: User,   path: "/login" },
];

export const Footer = () => {
   const navigate = useNavigate();
   const location = useLocation();

   const getActiveItem = () => {
      const currentItem = items.find(item => item.path === location.pathname);
      return currentItem ? currentItem.id : "home";
   };

   const [active, setActive] = useState(getActiveItem());

   const handleItemClick = (item) => {
      setActive(item.id);
      navigate(item.path);
   };

   return (
      <>
         <div className="h-16" />
         <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50">
            <div className="flex justify-around items-center px-4 py-2 max-w-3xl mx-auto">
               {items.map(({ id, label, Icon, path }) => {
                  const isActive = active === id;

                  return (
                     <button
                        key={id}
                        onClick={() => handleItemClick({ id, path })}
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