

// import { useState } from "react";

// const items = [
//    { id: "home", label: "Home", icon: "home" },
//    { id: "explore", label: "Explore", icon: "explore" },
//    { id: "saved", label: "Saved", icon: "favorite" },
//    { id: "profile", label: "Profile", icon: "person" },
// ];

// export default function Footer() {
//    const [active, setActive] = useState("home");

//    return (
//       <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50">
      
//          <div className="max-w-md mx-auto flex justify-between px-6 py-3">
//             {items.map(item => {
//                const isActive = active === item.id;

//                return (
//                   <button
//                      key={item.id}
//                      onClick={() => setActive(item.id)}
//                      className={`flex flex-col items-center gap-1 transition active:scale-95 ${
//                         isActive ? "text-orange-500" : "text-neutral-400"
//                      }`}
//                   >
//                      <span className="material-symbols-outlined text-xl">
//                         {item.icon}
//                      </span>
//                      <span
//                         className={`text-xs ${
//                            isActive ? "font-semibold" : "font-medium"
//                         }`}
//                      >
//                         {item.label}
//                      </span>
//                   </button>
//                );
//             })}
//          </div>
//       </footer>
//    );
// }


import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
   { id: "home", label: "Home", icon: "home", path: "/" },
   { id: "explore", label: "Explore", icon: "explore", path: "/explore" },
   { id: "saved", label: "Saved", icon: "favorite", path: "/saved" },
   { id: "profile", label: "Profile", icon: "person", path: "/login" },
];

export default function Footer() {
   const navigate = useNavigate();
   const location = useLocation();
   
   // Determinar cuál está activo basado en la ruta actual
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
      <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50">
         <div className="max-w-md mx-auto flex justify-between px-6 py-3">
            {items.map(item => {
               const isActive = active === item.id;

               return (
                  <button
                     key={item.id}
                     onClick={() => handleItemClick(item)}
                     className={`flex flex-col items-center gap-1 transition active:scale-95 ${
                        isActive ? "text-orange-500" : "text-neutral-400"
                     }`}
                  >
                     <span className="material-symbols-outlined text-xl">
                        {item.icon}
                     </span>
                     <span
                        className={`text-xs ${
                           isActive ? "font-semibold" : "font-medium"
                        }`}
                     >
                        {item.label}
                     </span>
                  </button>
               );
            })}
         </div>
      </footer>
   );
}