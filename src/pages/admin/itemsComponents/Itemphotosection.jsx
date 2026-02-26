

// src/pages/admin/itemsComponents/ItemPhotoSection.jsx
// Componente para gestionar las fotos de un establecimiento: subir, eliminar, ordenar y marcar principal
import { useState, useEffect, useRef, useCallback } from 'react';// React DnD Kit para drag & drop
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
   rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { photoService } from '../../../services/photoService';
import { cloudinaryPresets } from '../../../utils/cloudinaryHelpers';
import '../styles/itemPhotoSection.css';

// ── Miniatura sortable ─────────────────────────────────────────────────────
const SortableThumb = ({ photo, onDelete, onSetPrimary, deletingId }) => {
   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
   } = useSortable({ id: photo._id });

   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
   };

   return (
      <div
         ref={setNodeRef}
         style={style}
         className={`iph-thumb ${photo.isPrimary ? 'iph-thumb--primary' : ''} ${isDragging ? 'iph-thumb--dragging' : ''}`}
         {...attributes}
         {...listeners}
      >
         <img
            // preset thumbnail: 200x150 crop fill, WebP automático
            src={cloudinaryPresets.thumbnail(photo.url)}
            alt={photo.alt || ''}
            className="iph-thumb-img"
            loading="lazy"
         />
         {photo.isPrimary && <span className="iph-thumb-badge">Principal</span>}

         <div className="iph-thumb-actions">
            {!photo.isPrimary && (
               <button
                  type="button"
                  className="iph-icon-btn"
                  title="Establecer como principal"
                  onClick={(e) => { e.stopPropagation(); onSetPrimary(photo); }}
               >⭐</button>
            )}
            <button
               type="button"
               className="iph-icon-btn iph-icon-btn--delete"
               title="Eliminar"
               onClick={(e) => { e.stopPropagation(); onDelete(photo._id); }}
               disabled={deletingId === photo._id}
            >
               {deletingId === photo._id ? '⏳' : '🗑️'}
            </button>
         </div>
      </div>
   );
};

// ── Componente principal ───────────────────────────────────────────────────
export const ItemPhotoSection = ({ itemId, mainImage, onMainImageChange }) => {
   const [photos, setPhotos] = useState([]);
   const [loading, setLoading] = useState(false);
   const [uploading, setUploading] = useState(false);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState(null);
   const [successMsg, setSuccessMsg] = useState(null);
   const [deletingId, setDeletingId] = useState(null);
   const [orderChanged, setOrderChanged] = useState(false);

   const fileInputRef = useRef(null);

   const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
   );

   useEffect(() => {
      if (itemId) { fetchPhotos(); }
   }, [itemId]);

   const fetchPhotos = async () => {
      try {
         setLoading(true);
         setError(null);
         const data = await photoService.getByItem(itemId);
         const sorted = [...(data || [])].sort((a, b) => a.order - b.order);
         setPhotos(sorted);
         setOrderChanged(false);
      } catch {
         setError('Error al cargar las fotos');
      } finally {
         setLoading(false);
      }
   };

   const showSuccess = (msg) => {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3000);
   };

   const handleDragEnd = useCallback((event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) { return; }
      setPhotos(prev => {
         const oldIndex = prev.findIndex(p => p._id === active.id);
         const newIndex = prev.findIndex(p => p._id === over.id);
         return arrayMove(prev, oldIndex, newIndex);
      });
      setOrderChanged(true);
   }, []);

   const handleSaveOrder = async () => {
      try {
         setSaving(true);
         const payload = photos.map((p, i) => ({ id: p._id, order: i }));
         await photoService.reorder(payload);
         setPhotos(prev => prev.map((p, i) => ({ ...p, order: i })));
         setOrderChanged(false);
         showSuccess('Orden guardado');
      } catch {
         setError('Error al guardar el orden');
      } finally {
         setSaving(false);
      }
   };

   const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) { return; }
      if (!file.type.startsWith('image/')) { setError('Solo JPG, PNG o WEBP'); return; }
      if (file.size > 5 * 1024 * 1024) { setError('Máximo 5MB'); return; }
      try {
         setUploading(true);
         setError(null);
         const isPrimary = photos.length === 0;
         await photoService.uploadToItem(file, itemId, { isPrimary });
         showSuccess('Foto subida correctamente');
         await fetchPhotos();
         if (isPrimary && onMainImageChange) {
            const updated = await photoService.getByItem(itemId);
            const primary = updated?.find(p => p.isPrimary);
            if (primary) { onMainImageChange(primary.url); }
         }
      } catch {
         setError('Error al subir la foto');
      } finally {
         setUploading(false);
         if (fileInputRef.current) { fileInputRef.current.value = ''; }
      }
   };

   const handleDelete = async (photoId) => {
      if (!window.confirm('¿Eliminar esta foto?')) { return; }
      try {
         setDeletingId(photoId);
         await photoService.delete(photoId);
         setPhotos(prev => prev.filter(p => p._id !== photoId));
         showSuccess('Foto eliminada');
      } catch {
         setError('Error al eliminar la foto');
      } finally {
         setDeletingId(null);
      }
   };

   const handleSetPrimary = async (photo) => {
      try {
         await photoService.setPrimary(photo._id);
         await fetchPhotos();
         if (onMainImageChange) { onMainImageChange(photo.url); }
         showSuccess('Foto marcada como principal');
      } catch {
         setError('Error al marcar como principal');
      }
   };

   if (!itemId) {
      return (
         <div className="iph-new-notice">
            💡 Guarda la tapa primero para poder añadir fotos.
         </div>
      );
   }

   const primaryPhoto = photos.find(p => p.isPrimary);
   const displayImage = primaryPhoto?.url || mainImage;

   return (
      <div className="iph-wrapper">
         {error && <div className="admin-alert admin-alert-error">{error}</div>}
         {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

         {loading ? (
            <p className="admin-loading">Cargando fotos...</p>
         ) : (
            <div className="iph-layout">

               {/* Columna izquierda: foto principal + botón */}
               <div className="iph-col-main">
                  <div className="iph-main-img-wrapper">
                     {displayImage ? (
                        <img
                           // preset tapaDetail: 800x600 limit, WebP automático
                           src={cloudinaryPresets.tapaDetail(displayImage)}
                           alt="Imagen principal"
                           className="iph-main-img"
                        />
                     ) : (
                        <div className="iph-main-empty">
                           <span>📷</span>
                           <p>Sin imagen</p>
                        </div>
                     )}
                  </div>
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/jpeg,image/jpg,image/png,image/webp"
                     onChange={handleFileChange}
                     style={{ display: 'none' }}
                  />
                  <button
                     type="button"
                     className="admin-btn admin-btn-primary iph-upload-btn"
                     onClick={() => fileInputRef.current?.click()}
                     disabled={uploading}
                  >
                     {uploading ? '⏳ Subiendo...' : '+ Añadir foto'}
                  </button>
               </div>

               {/* Columna derecha: miniaturas + drag footer */}
               <div className="iph-col-thumbs">
                  {photos.length === 0 ? (
                     <div className="iph-thumbs-empty">
                        <p>Las fotos aparecerán aquí</p>
                     </div>
                  ) : (
                     <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                     >
                        <SortableContext
                           items={photos.map(p => p._id)}
                           strategy={rectSortingStrategy}
                        >
                           <div className="iph-thumbs-grid">
                              {photos.map(photo => (
                                 <SortableThumb
                                    key={photo._id}
                                    photo={photo}
                                    onDelete={handleDelete}
                                    onSetPrimary={handleSetPrimary}
                                    deletingId={deletingId}
                                 />
                              ))}
                           </div>
                        </SortableContext>
                     </DndContext>
                  )}

                  <div className="iph-drag-footer">
                     {orderChanged ? (
                        <button
                           type="button"
                           className="admin-btn admin-btn-primary admin-btn-sm"
                           onClick={handleSaveOrder}
                           disabled={saving}
                        >
                           {saving ? 'Guardando...' : '💾 Guardar orden'}
                        </button>
                     ) : (
                        <p className="iph-drag-hint">⠿ Arrastra para cambiar el orden</p>
                     )}
                  </div>
               </div>

            </div>
         )}
      </div>
   );
};