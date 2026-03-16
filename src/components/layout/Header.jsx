// src/components/layout/Header.jsx

import { Circle, CircleUserRound } from 'lucide-react';
import { SearchDropdown } from '../search/SearchDropdown';
import Button from '../common/Button';

export default function Header() {
   return (
      <header className="bg-neutral-950 border-b border-neutral-800/60 px-4 pt-5 pb-4 max-w-3xl mx-auto">

         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
               <Circle className="text-orange-500 text-2xl leading-none" />
               <h1 className="text-2xl font-black tracking-tight text-white">
            nex<span className="text-orange-500">Tapa</span>
               </h1>
            </div>

            <Button className="flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors text-sm font-semibold text-white">
               <CircleUserRound className="w-4 h-4" />
          Login
            </Button>
         </div>

         {/* Barra de búsqueda con dropdown integrado */}
         <SearchDropdown placeholder="Tu próxima tapa aquí..." />

      </header>
   );
}