

// src/pages/SearchPage.jsx
// Página /search — carga inicial rápida + lazy loading al hacer scroll

import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Search, X, Loader2, Store, UtensilsCrossed,
   Star, Gift, Sparkles, MapPin, BadgeCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useSearch } from '../hooks/useSearch';
import { Footer } from '../components/layout/Footer.jsx';

// ── Helpers ───────────────────────────────────────────────────────────────────

const getMainPrice = (modalities = []) => {
   if (!modalities?.length) {return null;}
   const first = modalities[0];
   if (first.isFree) {return 'Gratis';}
   return first.price != null ? `${first.price.toFixed(2)} €` : null;
};

const categoryMeta = {
   nearby:    { label: 'Cercano',    color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
   verified:  { label: 'Verificado', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
   top_rated: { label: 'Top',        color: 'text-yellow-400',  bg: 'bg-yellow-500/10'  },
   free:      { label: 'Gratis',     color: 'text-green-400',   bg: 'bg-green-500/10'   },
   recent:    { label: 'Nuevo',      color: 'text-orange-400',  bg: 'bg-orange-500/10'  },
};

const highlight = (text = '', query = '') => {
   if (!query || query.length < 2) {return text;}
   const regex = new RegExp(`(${query.trim()})`, 'gi');
   return text.split(regex).map((part, i) =>
      regex.test(part)
         ? <mark key={i} className="bg-orange-500/20 text-orange-400 rounded-sm px-0.5 not-italic">{part}</mark>
         : part
   );
};

// ── GridCard ──────────────────────────────────────────────────────────────────

const GridCard = ({ item, onClick, index = 0 }) => {
   const isEst = item._type === 'establishment';
   const meta  = categoryMeta[item._category] || categoryMeta.recent;
   const price = !isEst ? getMainPrice(item.modalities) : null;
   const img   = item.mainImage || null;

   return (
      <button
         onClick={onClick}
         className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/60 group active:scale-95 transition-transform duration-150"
         style={{
            aspectRatio: '4/3',
            animationDelay: `${index * 30}ms`,
            animation: 'fadeUp 0.3s ease forwards',
            opacity: 0,
         }}
      >
         {img ? (
            <img
               src={img}
               alt={item.name}
               loading="lazy"
               decoding="async"
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
         ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-800/60">
               {isEst
                  ? <Store className="w-8 h-8 text-neutral-700" />
                  : <UtensilsCrossed className="w-8 h-8 text-neutral-700" />
               }
            </div>
         )}

         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

         <span className={`absolute top-1.5 left-1.5 text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-full backdrop-blur-sm ${meta.bg} ${meta.color}`}>
            {meta.label}
         </span>

         {isEst && (
            <span className={`absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm ${
               item.isOpen
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-black/40 text-neutral-600'
            }`}>
               {item.isOpen ? '●' : '○'}
            </span>
         )}

         <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-white text-[11px] font-bold leading-tight truncate">{item.name}</p>
            <p className="text-neutral-400 text-[10px] truncate mt-0.5">
               {isEst
                  ? (item.address?.neighborhood || item.address?.city || '')
                  : (item.establishment?.name || '')
               }
            </p>
            {price && <span className="text-orange-400 text-[10px] font-bold">{price}</span>}
         </div>
      </button>
   );
};

// ── DropdownResult ────────────────────────────────────────────────────────────

const DropdownResult = ({ item, query, onClick }) => {
   const isEst = item._type === 'establishment';
   const price = !isEst ? getMainPrice(item.modalities) : null;

   return (
      <button
         onMouseDown={onClick}
         className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800/50 transition-colors text-left"
      >
         <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800 flex items-center justify-center">
            {item.mainImage
               ? <img src={item.mainImage} alt={item.name} className="w-full h-full object-cover" />
               : isEst
                  ? <Store className="w-4 h-4 text-neutral-600" />
                  : <UtensilsCrossed className="w-4 h-4 text-neutral-600" />
            }
         </div>
         <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{highlight(item.name, query)}</p>
            <p className="text-xs text-neutral-500 truncate">
               {isEst ? (item.address?.neighborhood || item.address?.city) : item.establishment?.name}
            </p>
         </div>
         <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {price && <span className="text-[11px] font-bold text-orange-400">{price}</span>}
            {isEst && (
               <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  item.isOpen ? 'bg-green-500/15 text-green-400' : 'bg-neutral-800 text-neutral-600'
               }`}>
                  {item.isOpen ? 'Abierto' : 'Cerrado'}
               </span>
            )}
         </div>
      </button>
   );
};

// ── SectionHeader ─────────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, label, color }) => (
   <div className="flex items-center gap-2 px-1 mb-3 mt-6 first:mt-0">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-[11px] font-black tracking-widest uppercase ${color}`}>{label}</span>
   </div>
);

// ── Grid skeleton ─────────────────────────────────────────────────────────────

const GridSkeleton = ({ count = 9 }) => ( // muestra un grid de cards con animación de pulso para indicar carga
   <div className="grid grid-cols-2 gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
         <div
            key={i}
            className="rounded-xl bg-neutral-900 animate-pulse"
            style={{ aspectRatio: '4/3', animationDelay: `${i * 40}ms` }}
         />
      ))}
   </div>
);

// ── Página principal ──────────────────────────────────────────────────────────

export const SearchPage = () => {
   const navigate   = useNavigate();
   const inputRef   = useRef(null);
   const wrapperRef = useRef(null);
   const loaderRef  = useRef(null); // ref para el Intersection Observer

   const [initial, setInitial]         = useState([]);   // carga rápida
   const [more, setMore]               = useState([]);    // carga lazy
   const [loadingInitial, setLoadingInitial] = useState(true);
   const [loadingMore, setLoadingMore]   = useState(false);
   const [moreLoaded, setMoreLoaded]     = useState(false); // evitar cargar dos veces

   const { query, setQuery, results, loading, isOpen, clear, close, open } = useSearch({ limit: 6 });

   // Enfocar input al montar
   useEffect(() => {
      setTimeout(() => inputRef.current?.focus(), 100);
   }, []);

   // ── Carga inicial: establecimientos cercanos + tapas gratis ───────────────
   useEffect(() => {
      const load = async () => {
         try {
            setLoadingInitial(true);
            let url = '/search/suggestions';
            try {
               const pos = await new Promise((resolve, reject) =>
                  navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
               );
               url = `/search/suggestions?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`;
            } catch { /* sin coords, el backend devuelve verificados */ }

            const res = await api.get(url);
            if (res.data.success) {setInitial(res.data.data.grid);}
         } catch { /* silencioso */ }
         finally { setLoadingInitial(false); }
      };
      load();
   }, []);

   // ── Carga lazy: top rated + recientes al hacer scroll ────────────────────
   const loadMore = useCallback(async () => {
      if (moreLoaded || loadingMore) {return;}
      try {
         setLoadingMore(true);
         const res = await api.get('/search/suggestions/more');
         if (res.data.success) {setMore(res.data.data.grid);}
         setMoreLoaded(true);
      } catch { /* silencioso */ }
      finally { setLoadingMore(false); }
   }, [moreLoaded, loadingMore]);

   // Intersection Observer — dispara loadMore cuando el loader entra en viewport
   useEffect(() => {
      if (loadingInitial) {return;} // esperar a que cargue lo inicial
      const observer = new IntersectionObserver(
         (entries) => { if (entries[0].isIntersecting) {loadMore();} },
         { threshold: 0.1 }
      );
      if (loaderRef.current) {observer.observe(loaderRef.current);}
      return () => observer.disconnect();
   }, [loadingInitial, loadMore]);

   // Cerrar dropdown al click fuera
   useEffect(() => {
      const handler = (e) => {
         if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {close();}
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
   }, [close]);

   const handleSelect = (item) => {
      clear();
      if (item._type === 'establishment') {navigate(`/establishment/${item.slug}`);}
      else {navigate(`/items/${item.slug}`);}
   };

   const hasDropdown = isOpen && query.length >= 2;
   const hasResults  = results.establishments?.length > 0 || results.items?.length > 0;

   // Agrupar más resultados por categoría para secciones
   const moreGrouped = more.reduce((acc, item) => {
      const cat = item._category || 'recent';
      if (!acc[cat]) {acc[cat] = [];}
      acc[cat].push(item);
      return acc;
   }, {});

   const moreSections = [
      { key: 'top_rated', icon: Star,     label: 'Mejor valorados', color: 'text-yellow-400' },
      { key: 'recent',    icon: Sparkles, label: 'Recién llegados',  color: 'text-orange-400' },
   ];

   return (
      <>
         {/* Animación global para las cards */}
         <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

         <div className="min-h-screen bg-neutral-950 max-w-3xl mx-auto">

            {/* ── Barra superior sticky ── */}
            <div className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/50 px-4 py-3">
               <div ref={wrapperRef} className="relative">
                  <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-2.5 focus-within:border-orange-500/40 focus-within:ring-1 focus-within:ring-orange-500/10 transition-all">
                     {loading
                        ? <Loader2 className="w-4 h-4 text-neutral-500 animate-spin flex-shrink-0" />
                        : <Search className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                     }
                     <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onFocus={open}
                        placeholder="Busca tapas, bares, barrios..."
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                     />
                     {query && (
                        <button onClick={clear} className="text-neutral-500 hover:text-neutral-300 transition-colors flex-shrink-0">
                           <X className="w-4 h-4" />
                        </button>
                     )}
                  </div>

                  {/* Dropdown */}
                  {hasDropdown && (
                     <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                        {!hasResults && !loading && (
                           <div className="px-4 py-8 text-center">
                              <p className="text-sm text-neutral-500">Sin resultados para <span className="text-white">"{query}"</span></p>
                           </div>
                        )}
                        {results.establishments?.length > 0 && (
                           <>
                              <div className="px-4 pt-3 pb-1">
                                 <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">Establecimientos</p>
                              </div>
                              {results.establishments.map(item => (
                                 <DropdownResult key={item._id} item={item} query={query} onClick={() => handleSelect(item)} />
                              ))}
                           </>
                        )}
                        {results.establishments?.length > 0 && results.items?.length > 0 && (
                           <div className="mx-4 border-t border-neutral-800/60" />
                        )}
                        {results.items?.length > 0 && (
                           <>
                              <div className="px-4 pt-3 pb-1">
                                 <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">Tapas</p>
                              </div>
                              {results.items.map(item => (
                                 <DropdownResult key={item._id} item={item} query={query} onClick={() => handleSelect(item)} />
                              ))}
                           </>
                        )}
                        {hasResults && (
                           <div className="px-4 py-2.5 border-t border-neutral-800/40 bg-neutral-950/60 text-center">
                              <p className="text-[11px] text-neutral-600">
                                 {results.total} resultado{results.total !== 1 ? 's' : ''} para "{query}"
                              </p>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>

            {/* ── Contenido ── */}
            <div className="px-3 pb-24 pt-4">

               {/* Carga inicial */}
               {loadingInitial ? (
                  <GridSkeleton count={9} />
               ) : initial.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                     <Search className="w-10 h-10 text-neutral-800" />
                     <p className="text-neutral-600 text-sm">Empieza a buscar tu próxima tapa</p>
                  </div>
               ) : (
                  <>
                     {/* Sección inicial: cercanos + gratis intercalados */}
                     <div className="flex items-center gap-2 px-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[11px] font-black tracking-widest uppercase text-blue-400">Cerca de ti</span>
                        <span className="mx-1 text-neutral-700">·</span>
                        <Gift className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-[11px] font-black tracking-widest uppercase text-green-400">Tapas gratis</span>
                     </div>

                     <div className="grid grid-cols-2 gap-1.5">
                        {initial.map((item, i) => (
                           <GridCard key={`${item._id}-${i}`} item={item} onClick={() => handleSelect(item)} index={i} />
                        ))}
                     </div>

                     {/* ── Trigger lazy load ── */}
                     <div ref={loaderRef} className="mt-6">
                        {loadingMore && (
                           <>
                              <div className="flex items-center gap-2 px-1 mb-3 mt-2">
                                 <Star className="w-3.5 h-3.5 text-yellow-400" />
                                 <span className="text-[11px] font-black tracking-widest uppercase text-yellow-400">Cargando más...</span>
                              </div>
                              <GridSkeleton count={6} />
                           </>
                        )}

                        {/* Secciones lazy ya cargadas */}
                        {moreLoaded && moreSections.map(({ key, icon, label, color }) => {
                           const items = moreGrouped[key];
                           if (!items?.length) {return null;}
                           return (
                              <div key={key}>
                                 <SectionHeader icon={icon} label={label} color={color} />
                                 <div className="grid grid-cols-2 gap-1.5 mb-2">
                                    {items.map((item, i) => (
                                       <GridCard
                                          key={`${item._id}-${key}-${i}`}
                                          item={item}
                                          onClick={() => handleSelect(item)}
                                          index={i}
                                       />
                                    ))}
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </>
               )}
            </div>
            <Footer />
         </div>
      </>
   );
};