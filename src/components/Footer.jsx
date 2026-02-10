



export default function Footer() {
  const icons = ["home", "explore", "favorite", "person"];

  return (
    <nav className="fixed bottom-0 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur border-t">
      <div className="max-w-md mx-auto flex justify-between px-10 py-4 text-xs">
        {icons.map((icon, i) => (
          <div
            key={icon}
            className={`flex flex-col items-center ${
              i === 0 ? "text-primary font-bold" : "text-slate-400"
            }`}
          >
            <span className="material-symbols-outlined">
              {icon}
            </span>
            {icon.charAt(0).toUpperCase() + icon.slice(1)}
          </div>
        ))}
      </div>
    </nav>
  );
}
