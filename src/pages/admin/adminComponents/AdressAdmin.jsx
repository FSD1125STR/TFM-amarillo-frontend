

//src admin/adminComponents/AdressAdmin.jsx

import { memo } from 'react'; // Usamos memo para evitar renders innecesarios si las props no cambian
import { SaveButton } from './SaveButton';

export const AdressAdmin = memo(({ address, onChange, saving }) => {    
   return (
      <section className="admin-section">
         <h2 className="admin-section-title">Dirección</h2>
         <div className="admin-grid-2">
            <div className="admin-field">
               <label>Street *</label>
               <input className="admin-input" name="street" value={address.street} onChange={onChange} required />
            </div>
            <div className="admin-field">
               <label>Número</label>
               <input className="admin-input" name="number" value={address.number} onChange={onChange} />
            </div>
            <div className="admin-field">
               <label>Ciudad</label>
               <input className="admin-input" name="city" value={address.city} onChange={onChange} required />
            </div>
            <div className="admin-field">
               <label>Provincia </label>
               <input className="admin-input" name="province" value={address.province} onChange={onChange} required />
            </div>
            <div className="admin-field">
               <label>Código Postal</label>
               <input className="admin-input" name="postalCode" value={address.postalCode} onChange={onChange} required />
            </div>
            <div className="admin-field">
               <label>País</label>
               <input className="admin-input" name="country" value={address.country} onChange={onChange} />
            </div>
            <SaveButton saving={saving} />
         </div>
      </section>
   );
});