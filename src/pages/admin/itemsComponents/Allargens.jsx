


import { memo } from 'react';
import { TagSelector } from './TagSelector';

const ALLERGENS = [
   { value: 'gluten', label: '🌾 Gluten' },
   { value: 'lactosa', label: '🥛 Lácteos' },
   { value: 'huevo', label: '🥚 Huevo' },
   { value: 'pescado', label: '🐟 Pescado' },
   { value: 'marisco', label: '🦐 Marisco' },
   { value: 'frutos_secos', label: '🥜 Frutos Secos' },
   { value: 'cacahuetes', label: '🥜 Cacahuetes' },
   { value: 'soja', label: '🫘 Soja' },
   { value: 'apio', label: '🥬 Apio' },
   { value: 'mostaza', label: '🌿 Mostaza' },
   { value: 'sesamo', label: '🌰 Sésamo' },
   { value: 'sulfitos', label: '🍷 Sulfitos' },
   { value: 'altramuz', label: '🌼 Altramuz' },
   { value: 'moluscos', label: '🐚 Moluscos' },
];

export const Allergens = memo(({ form, handleChange }) => {
   return (
      <section className="admin-section">
         <h2 className="admin-section-title">Alérgenos</h2>
         <p className="admin-section-desc">
                  Marca todos los alérgenos presentes. Esta información es importante para la seguridad de los clientes.
         </p>
         <TagSelector
            label=""
            options={ALLERGENS}
            selected={form.allergens}
            onChange={val => handleChange('allergens', val)}
         />
      </section>
   );
});