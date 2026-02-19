

// src/pages/admin/adminComponents/BasicInformationAdmin.jsx

import { memo } from 'react';
import { SaveButton } from './SaveButton';

const TYPES = ['bar', 'restaurante', 'cafeteria', 'cerveceria', 'tasca', 'gastrobar', 'otro'];

export const BasicInformationAdmin = memo(({ form, onChange, saving, name }) => {
   return (
      <section className="admin-section">
         <h2 className="admin-section-title">Información Básica de {form.name}</h2>

         <div className="admin-field">
            <label>Name *</label>
            <input className="admin-input" name="name" value={form.name} onChange={onChange} required />
         </div>

         <div className="admin-field">
            <label>Description *</label>
            <textarea className="admin-input" name="description" value={form.description} onChange={onChange} rows={4} required />
         </div>

         <div className="admin-grid-2">
            <div className="admin-field">
               <label>Type</label>
               <select className="admin-input" name="type" value={form.type} onChange={onChange}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
            <div className="admin-field">
               <label>Price Range</label>
               <input className="admin-input" name="priceRange" value={form.priceRange} onChange={onChange} placeholder="e.g. €€" />
            </div>
         </div>

         <SaveButton saving={saving} />
      </section>
   );
});