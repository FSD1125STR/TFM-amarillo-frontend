



export default function Navbar() {
   return (
      <header className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-background-dark/80">
         <div className="max-w-md mx-auto flex items-center justify-between p-4">
            <span className="material-symbols-outlined text-2xl">
          menu
            </span>

            <h1 className="font-bold text-xl">nexTapa</h1>

            <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
          Sign Up
            </button>
         </div>
      </header>
   );
}
