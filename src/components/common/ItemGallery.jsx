// ItemGallery.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../../services/itemService.js';

const DEFAULT_IMAGE = 'https://placehold.co/400x400/f5f5f0/a3a3a3?text=🍽️';

export const ItemGallery = ({ establishmentId }) => {
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchItems = async () => {
         try {
            const response = await itemService.getByEstablishment(establishmentId, {
               available: true
            });
            setItems(response.data);
            console.log('Item cargado:', response.data);
         } catch (err) {
            console.error('Error al cargar galería:', err);
         } finally {
            setLoading(false);
         }
      };
      if (establishmentId) {fetchItems();}
   }, [establishmentId]);

   if (loading) {return null;}
   if (items.length === 0) {return null;}

   return (
      <div className="
      flex gap-2 mt-3
      overflow-x-auto md:overflow-x-visible
      scrollbar-none
      md:grid md:grid-cols-4
    ">
         {items.map((item) => (
            <button
               key={item._id}
               onClick={() => navigate(`/items/${item._id}`)}
               className="
            group relative shrink-0
            w-[38vw] md:w-auto
            aspect-square
            overflow-hidden rounded-xl bg-neutral-100
          "
            >
               <img
                  src={item.mainImage || DEFAULT_IMAGE}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <p className="text-white text-xs font-medium p-2 line-clamp-1">
                     {item.name}
                  </p>
               </div>
            </button>
         ))}
      </div>
   );
};