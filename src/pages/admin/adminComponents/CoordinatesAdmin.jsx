

// src/pages/admin/adminComponents/CoordinatesAdmin.jsx

import { memo } from 'react';
import { SaveButton } from './SaveButton';

export const CoordinatesAdmin = memo(({ coordinates, onChange, saving }) => {
   return (
      <section className="admin-section">
         <h2 className="admin-section-title">Coordenadas para el mapa</h2>
         <div className="admin-grid-2">
            <div className="admin-field">
               <label>Longitud</label>
               <input
                  className="admin-input"
                  type="number"
                  step="any"
                  name="lng"
                  value={coordinates[0]}
                  onChange={onChange}
               />
            </div>
            <div className="admin-field">
               <label>Latitud</label>
               <input
                  className="admin-input"
                  type="number"
                  step="any"
                  name="lat"
                  value={coordinates[1]}
                  onChange={onChange}
               />
            </div>
         </div>
         <SaveButton saving={saving} />
      </section>
   );
});