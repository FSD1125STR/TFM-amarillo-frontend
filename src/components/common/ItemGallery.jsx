import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../../services/itemService.js';
import Section from '../layout/Section.jsx';
import { cloudinaryPresets } from '../../utils/cloudinaryHelpers.js';

const DEFAULT_IMAGE = '/Logo.png';

export const ItemGallery = ({ establishmentId, currentItemId, establishmentName, distance }) => {
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchItems = async () => {
         try {
            const response = await itemService.getByEstablishment(establishmentId, { available: true });
            setItems(response.data || []);
         } catch (error) {
            console.error('Error fetching items:', error);
         } finally {
            setLoading(false);
         }
      };
      if (establishmentId) {fetchItems();}
   }, [establishmentId]);

   const filtered = currentItemId ? items.filter(item => item._id !== currentItemId) : items;

   if (loading || filtered.length === 0) {return null;}

   return (
      <Section title={`Tapas de ${establishmentName}`}>
         <div className="flex gap-3 mt-3
            overflow-x-auto pb-4
            snap-x snap-mandatory
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:bg-neutral-100
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-neutral-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            [scrollbar-width:thin]
            [scrollbar-color:#d4d4d4_#f5f5f5]
         ">
            {filtered.map((item) => (
               <button
                  key={item._id}
                  onClick={() => navigate(`/items/${item.slug}`, { state: { distance } })}
                  className="
                     group relative
                     flex-none
                     w-[45%] md:w-[calc(25%-12px)]
                     snap-start
                     aspect-square
                     overflow-hidden rounded-xl bg-neutral-100
                  "
               >
                  {/* tapaCard: 400×300 fill — cuadrado en aspecto, bien cubierto */}
                  <img
                     src={cloudinaryPresets.tapaCard(item.mainImage || DEFAULT_IMAGE)}
                     alt={item.name}
                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                     onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                  />
                  <div className="absolute inset-0 from-black/60 to-transparent flex items-end">
                     <p className="text-white text-[10px] md:text-xs font-medium p-2 md:p-3 line-clamp-1 w-full text-left">
                        {item.name}
                     </p>
                  </div>
               </button>
            ))}
         </div>
      </Section>
   );
};
