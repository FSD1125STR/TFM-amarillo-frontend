

import { memo } from 'react';
import { TagSelector } from './TagSelector';

const CATEGORIES = [
   { value: 'Carne', label: '🥩 Carne' },
   { value: 'Pescado', label: '🐟 Pescado' },
   { value: 'Marisco', label: '🦐 Marisco' },
   { value: 'Verduras', label: '🥦 Verduras' },
   { value: 'Queso', label: '🧀 Queso' },
   { value: 'Embutido', label: '🥓 Embutido' },
   { value: 'Jamon', label: '🍖 Jamón' },
   { value: 'Huevo', label: '🍳 Huevo' },
   { value: 'Frito', label: '🍟 Frito' },
   { value: 'Plancha', label: '🔥 A la Plancha' },
   { value: 'Horno', label: '♨️ Al Horno' },
   { value: 'Guiso', label: '🍲 Guiso' },
   { value: 'Ensalada', label: '🥗 Ensalada' },
   { value: 'Croqueta', label: '🟤 Croqueta' },
   { value: 'Patatas', label: '🥔 Patatas' },
   { value: 'Pan', label: '🍞 Pan/Tostada' },
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