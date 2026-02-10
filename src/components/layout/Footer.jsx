import { useState } from "react";

const items = [
  { id: "home", label: "Home", icon: "home" },
  { id: "explore", label: "Explore", icon: "explore" },
  { id: "saved", label: "Saved", icon: "favorite" },
  { id: "profile", label: "Profile", icon: "person" },
];

export default function Footer() {
  const [active, setActive] = useState("home");

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 py-3 md:hidden">
      <div className="max-w-md mx-auto flex justify-between px-6">
        {items.map(item => {
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
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
