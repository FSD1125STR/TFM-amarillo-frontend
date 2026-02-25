

// src/pages/admin/itemsComponents/ViewItemInApp.jsx
// Botón para ver la tapa en la app
import { memo } from 'react';

export const ViewItemInAppButton = memo(({ id }) => {
   if (!id) {return null;}

   return (
       
      <a
         href={`/items/${id}`}
         target="_blank"
         rel="noopener noreferrer"
         className="admin-btn admin-btn-secondary admin-btn-sm"
      >  
      Ver en la app ↗
      </a>
     
      
   );
});