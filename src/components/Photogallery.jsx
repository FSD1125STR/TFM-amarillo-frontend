

import { useState, useEffect } from 'react';
import axios from 'axios';
import './PhotoGallery.css';

const API_URL = 'http://localhost:4000/api';

const PhotoGallery = () => {
   const [photos, setPhotos] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectedPhoto, setSelectedPhoto] = useState(null);

   // Obtener fotos
   useEffect(() => {
      fetchPhotos();
   }, []);

   const fetchPhotos = async () => {
      try {
         setLoading(true);
         setError(null);

         const response = await axios.get(`${API_URL}/photos`);
      
         console.log('Fotos obtenidas:', response.data);
         setPhotos(response.data.data || []);

      } catch (err) {
         console.error('Error al obtener fotos:', err);
         setError(err.response?.data?.message || 'Error al cargar las fotos');
      } finally {
         setLoading(false);
      }
   };

   // Eliminar foto
   const handleDelete = async (photoId) => {
      if (!window.confirm('¿Estás seguro de eliminar esta foto?')) {
         return;
      }

      try {
         await axios.delete(`${API_URL}/photos/test/${photoId}`);
      
         // Actualizar lista
         setPhotos(prev => prev.filter(p => p._id !== photoId));
         setSelectedPhoto(null);
      
         alert('Foto eliminada exitosamente');
      } catch (err) {
         console.error('Error al eliminar:', err);
         alert(err.response?.data?.message || 'Error al eliminar la foto');
      }
   };

   // Loading
   if (loading) {
      return (
         <div className="photo-gallery">
            <h2>📷 Galería de Fotos</h2>
            <div className="loading">
               <div className="spinner"></div>
               <p>Cargando fotos...</p>
            </div>
         </div>
      );
   }

   // Error
   if (error) {
      return (
         <div className="photo-gallery">
            <h2>📷 Galería de Fotos</h2>
            <div className="alert alert-error">
               <p>{error}</p>
               <button onClick={fetchPhotos} className="btn-retry">
            Reintentar
               </button>
            </div>
         </div>
      );
   }

   // Sin fotos
   if (photos.length === 0) {
      return (
         <div className="photo-gallery">
            <h2>📷 Galería de Fotos</h2>
            <div className="empty-state">
               <p>📭 No hay fotos todavía</p>
               <small>Sube tu primera foto usando el formulario arriba</small>
            </div>
         </div>
      );
   }

   return (
      <div className="photo-gallery">
         <div className="gallery-header">
            <h2>📷 Galería de Fotos</h2>
            <span className="photo-count">{photos.length} {photos.length === 1 ? 'foto' : 'fotos'}</span>
         </div>

         <div className="gallery-grid">
            {photos.map(photo => (
               <div key={photo._id} className="gallery-item">
                  <div 
                     className="gallery-image-wrapper"
                     onClick={() => setSelectedPhoto(photo)}
                  >
                     <img 
                        src={photo.thumbnailUrl || photo.url} 
                        alt={photo.alt || photo.caption || 'Foto'} 
                        className="gallery-image"
                     />
                     {photo.isPrimary && (
                        <span className="badge-primary">⭐ Principal</span>
                     )}
                  </div>
            
                  <div className="gallery-item-info">
                     {photo.caption && (
                        <p className="photo-caption">{photo.caption}</p>
                     )}
              
                     <div className="photo-meta">
                        <span className="photo-size">
                           {(photo.size / 1024).toFixed(0)} KB
                        </span>
                        <span className="photo-dimensions">
                           {photo.dimensions.width} × {photo.dimensions.height}
                        </span>
                     </div>

                     {photo.tags && photo.tags.length > 0 && (
                        <div className="photo-tags">
                           {photo.tags.map((tag, idx) => (
                              <span key={idx} className="tag">{tag}</span>
                           ))}
                        </div>
                     )}

                     <div className="gallery-item-actions">
                        <a 
                           href={photo.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="btn-view"
                        >
                  Ver original
                        </a>
                        <button 
                           onClick={() => handleDelete(photo._id)}
                           className="btn-delete"
                        >
                  🗑️ Eliminar
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Modal para ver foto completa */}
         {selectedPhoto && (
            <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
               <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button 
                     className="modal-close"
                     onClick={() => setSelectedPhoto(null)}
                  >
              ✕
                  </button>
            
                  <img 
                     src={selectedPhoto.url} 
                     alt={selectedPhoto.alt || selectedPhoto.caption || 'Foto'} 
                     className="modal-image"
                  />
            
                  <div className="modal-info">
                     {selectedPhoto.caption && (
                        <h3>{selectedPhoto.caption}</h3>
                     )}
                     <p>
                        <strong>ID:</strong> {selectedPhoto._id}
                     </p>
                     <p>
                        <strong>Tamaño:</strong> {(selectedPhoto.size / 1024).toFixed(2)} KB
                     </p>
                     <p>
                        <strong>Dimensiones:</strong> {selectedPhoto.dimensions.width} × {selectedPhoto.dimensions.height}px
                     </p>
                     {selectedPhoto.establishment && (
                        <p>
                           <strong>Establecimiento:</strong> {selectedPhoto.establishment.name}
                        </p>
                     )}
                     {selectedPhoto.item && (
                        <p>
                           <strong>Item:</strong> {selectedPhoto.item.name}
                        </p>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default PhotoGallery;