

import { memo } from 'react';
import { TagSelector } from './TagSelector';

const DIETARY_OPTIONS = [
   { value: 'vegetariano', label: '🥕 Vegetariano' },
   { value: 'vegano', label: '🌱 Vegano' },
   { value: 'sin_gluten', label: '🚫🌾 Sin Gluten' },
   { value: 'sin_lactosa', label: '🚫🥛 Sin Lactosa' },
   { value: 'sin_azucar', label: '🚫🍬 Sin Azúcar' },
   { value: 'halal', label: '☪️ Halal' },
   { value: 'kosher', label: '✡️ Kosher' },
];

export const DietaryOptions = memo(({ form, handleChange }) => {
   return (
      <section className="admin-section">
         <h2 className="admin-section-title">Opciones dietéticas</h2>
         <TagSelector
            label="Selecciona las opciones que aplican"
            options={DIETARY_OPTIONS}
            selected={form.dietaryOptions}
            onChange={val => handleChange('dietaryOptions', val)}
         />
      </section>
   );
});