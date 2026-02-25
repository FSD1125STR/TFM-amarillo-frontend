

import { memo } from 'react';
import { TagSelector } from './TagSelector';

const CATEGORIES = [
   { value: 'carne', label: '🥩 Carne' },
   { value: 'pescado', label: '🐟 Pescado' },
   { value: 'marisco', label: '🦐 Marisco' },
   { value: 'verduras', label: '🥦 Verduras' },
   { value: 'queso', label: '🧀 Queso' },
   { value: 'embutido', label: '🥓 Embutido' },
   { value: 'jamon', label: '🍖 Jamón' },
   { value: 'huevo', label: '🍳 Huevo' },
   { value: 'frito', label: '🍟 Frito' },
   { value: 'plancha', label: '🔥 A la Plancha' },
   { value: 'horno', label: '♨️ Al Horno' },
   { value: 'guiso', label: '🍲 Guiso' },
   { value: 'ensalada', label: '🥗 Ensalada' },
   { value: 'croqueta', label: '🟤 Croqueta' },
   { value: 'patatas', label: '🥔 Patatas' },
   { value: 'pan', label: '🍞 Pan/Tostada' },
];


export const Categories = memo(({ form, handleChange }) => {
   return (
      <section className="admin-section">
         <h2 className="admin-section-title">Categorías</h2>
         <TagSelector
            label="Selecciona las categorías que mejor describen esta tapa"
            options={CATEGORIES}
            selected={form.categories}
            onChange={val => handleChange('categories', val)}
         />
      </section>
   );
});