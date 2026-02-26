

// src/pages/admin/itemsComponents/ViewItemInApp.jsx
// Botón para ver la tapa en la app
import { memo } from 'react';

export const ViewItemInAppButton = memo(({ slug }) => {
   if (!slug) {return null;}

   return (
       
      <a
         href={`/items/${slug}`}
         target="_blank"
         rel="noopener noreferrer"
         className="admin-btn admin-btn-secondary admin-btn-sm"
      >  
      Ver en la app ↗
      </a>
     
      
   );
});