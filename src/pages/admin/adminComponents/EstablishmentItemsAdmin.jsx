


// src/components/admin/adminComponents/ItemsAdmin.jsx
// componente para listar y gestionar las tapas de un establecimiento en el panel admin

// src/components/admin/adminComponents/ItemsAdmin.jsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../../../services/itemService';
import {
   DndContext,
   closestCenter,
   PointerSensor,
   useSensor,
   useSensors,
} from '@dnd-kit/core';
import {
   SortableContext,
   useSortable,
   arrayMove,
   verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ── Fila sortable ──────────────────────────────────────────────────────────
const SortableRow = ({ item, onToggleAvailable, onToggleFeatured, onDelete, onEdit }) => {
   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
   } = useSortable({ id: item._id });

   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.4 : 1,
      background: isDragging ? 'var(--admin-bg-hover, #f5f5f5)' : undefined,
   };

   return (
      <tr ref={setNodeRef} style={style}>
         {/* Handle de arrastre */}
         <td>
            <span
               className="drag-handle"
               {...attributes}
               {...listeners}
               title="Arrastrar para reordenar"
            >
               ⠿
            </span>
         </td>
         <td>{item.name}</td>
         <td>
            {item.modalities?.length === 1 ? (
            // Una sola modalidad: mostrar inline
               <span>
                  {item.modalities[0].label} · {' '}
                  {item.modalities[0].isFree || item.modalities[0].price === 0
                     ? <span style={{ color: '#16a34a', fontWeight: 600 }}>Gratis</span>
                     : `${item.modalities[0].price}€`
                  }
               </span>
            ) : (
            // Varias modalidades: select
               <select
                  style={{
                     border: '1px solid var(--admin-border)',
                     borderRadius: '6px',
                     padding: '0.2rem 0.4rem',
                     fontSize: '0.85rem',
                     background: 'var(--admin-bg)',
                     color: 'var(--admin-text)',
                     cursor: 'default',
                  }}
                  defaultValue=""
                  onChange={e => e.target.value = ""} // solo lectura
               >
                  <option value="" disabled>
                     {item.modalities.length} Opciones
                  </option>
                  {item.modalities.map((m, i) => (
                     <option key={i} disabled>
                        {m.label} · {m.isFree || m.price === 0 ? 'Gratis' : `${m.price}€`}
                     </option>
                  ))}
               </select>
            )}
         </td>
         <td>
            <button
               type="button"
               className={`admin-toggle-btn ${item.available ? 'is-open' : 'is-closed'}`}
               onClick={() => onToggleAvailable(item._id, item.available)}
            >
               {item.available ? 'Sí' : 'No'}
            </button>
         </td>
         <td>
            <button
               type="button"
               className={`admin-toggle-btn ${item.featured ? 'is-open' : 'is-closed'}`}
               onClick={() => onToggleFeatured(item._id, item.featured)}
            >
               {item.featured ? 'Sí' : 'No'}
            </button>
         </td>
         <td>
            <div className="admin-actions">
               <button
                  className="admin-btn admin-btn-warning admin-btn-sm"
                  onClick={() => onEdit(item._id)}
               >
                  Editar
               </button>
               {/* <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => onToggleAvailable(item._id, item.available)}
               >
                  {item.available ? 'Desactivar' : 'Activar'}
               </button> */}
               <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => onDelete(item._id)}
               >
                  Borrar
               </button>
            </div>
         </td>
      </tr>
   );
};

// ── Componente principal ───────────────────────────────────────────────────
export const EstablishmentItems = ({ establishmentId }) => {
   const navigate = useNavigate();

   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState(null);
   const [successMsg, setSuccessMsg] = useState(null);
   const [orderChanged, setOrderChanged] = useState(false);

   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: { distance: 8 },
      })
   );

   useEffect(() => {
      fetchItems();
   }, [establishmentId]);

   const fetchItems = async () => {
      try {
         setLoading(true);
         const res = await itemService.getByEstablishment(establishmentId, { available: undefined });
         const sorted = [...(res.data || [])].sort((a, b) => a.order - b.order);
         setItems(sorted);
         setOrderChanged(false);
      } catch (err) {
         setError('Error loading tapas', err);
      } finally {
         setLoading(false);
      }
   };

   const showSuccess = (msg) => {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3000);
   };

   // ── Drag end ────────────────────────────────────────────────────────────
   const handleDragEnd = useCallback((event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) { return; }

      setItems(prev => {
         const oldIndex = prev.findIndex(i => i._id === active.id);
         const newIndex = prev.findIndex(i => i._id === over.id);
         return arrayMove(prev, oldIndex, newIndex);
      });
      setOrderChanged(true);
   }, []);

   // ── Guardar orden ───────────────────────────────────────────────────────
   const handleSaveOrder = async () => {
      try {
         setSaving(true);
         setError(null);
         const payload = items.map((item, index) => ({ id: item._id, order: index }));
         await itemService.reorder(payload);
         setItems(prev => prev.map((item, i) => ({ ...item, order: i })));
         setOrderChanged(false);
         showSuccess('Orden guardado correctamente');
      } catch (err) {
         setError('Error al guardar el orden', err);
      } finally {
         setSaving(false);
      }
   };

   // ── Toggles ─────────────────────────────────────────────────────────────
   const handleToggleAvailable = async (itemId, currentAvailable) => {
      try {
         await itemService.update(itemId, { available: !currentAvailable });
         setItems(prev =>
            prev.map(item => item._id === itemId ? { ...item, available: !currentAvailable } : item)
         );
      } catch (err) {
         setError('Error al cambiar disponibilidad', err);
      }
   };

   const handleToggleFeatured = async (itemId, currentFeatured) => {
      try {
         await itemService.update(itemId, { featured: !currentFeatured });
         setItems(prev =>
            prev.map(item => item._id === itemId ? { ...item, featured: !currentFeatured } : item)
         );
      } catch (err) {
         setError('Error al cambiar destacado', err);
      }
   };

   // ── Delete (soft) ───────────────────────────────────────────────────────
   const handleDelete = async (itemId) => {
      if (!confirm('¿Seguro que quieres eliminar esta tapa?')) { return; }
      try {
         await itemService.delete(itemId);
         setItems(prev => prev.filter(item => item._id !== itemId));
         showSuccess('Tapa eliminada');
      } catch (err) {
         setError('Error al eliminar la tapa', err);
      }
   };

   // ── Render ──────────────────────────────────────────────────────────────
   return (
      <section className="admin-section admin-items-section">

         <div className="admin-section-header">
            <h2 className="admin-section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>
               Tapas ({items.length})
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
               {orderChanged && (
                  <button
                     className="admin-btn admin-btn-primary admin-btn-sm"
                     onClick={handleSaveOrder}
                     disabled={saving}
                  >
                     {saving ? 'Guardando...' : '💾 Guardar orden'}
                  </button>
               )}
               <button
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => navigate('/admin/items/new', { state: { establishmentId } })}
               >
                  + Añadir tapa
               </button>
            </div>
         </div>

         {error && <div className="admin-alert admin-alert-error">{error}</div>}
         {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

         {loading ? (
            <p className="admin-loading">Cargando tapas...</p>
         ) : items.length === 0 ? (
            <p className="admin-empty">No hay tapas para este establecimiento.</p>
         ) : (
            <div className="admin-table-wrapper">
               <table className="admin-table">
                  <thead>
                     <tr>
                        <th style={{ width: '32px' }}></th>
                        <th>Nombre</th>
                        <th>Opciones</th>
                        <th>Disponible</th>
                        <th>Destacado</th>
                        <th>Acciones</th>
                     </tr>
                  </thead>
                  <tbody>
                     <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                     >
                        <SortableContext
                           items={items.map(i => i._id)}
                           strategy={verticalListSortingStrategy}
                        >
                           {items.map(item => (
                              <SortableRow
                                 key={item._id}
                                 item={item}
                                 onToggleAvailable={handleToggleAvailable}
                                 onToggleFeatured={handleToggleFeatured}
                                 onDelete={handleDelete}
                                 onEdit={(id) => navigate(`/admin/items/${id}`)}
                              />
                           ))}
                        </SortableContext>
                     </DndContext>
                  </tbody>
               </table>
            </div>
         )}
      </section>
   );
};