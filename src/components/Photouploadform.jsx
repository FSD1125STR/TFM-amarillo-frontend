

import { useState, useRef } from 'react';
import axios from 'axios';
import './PhotoUploadForm.css';

const API_URL = 'http://localhost:4000/api';

const PhotoUploadForm = ({ onPhotoUploaded }) => {
   // Estados
   const [file, setFile] = useState(null);
   const [preview, setPreview] = useState(null);
   const [loading, setLoading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);

   // Datos del formulario
   const [formData, setFormData] = useState({
      establishmentId: '',
      itemId: '',
      caption: '',
      alt: '',
      tags: '',
      isPrimary: false
   });

   const fileInputRef = useRef(null);

   // Manejar cambios en inputs
   const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value
      }));
   };

   // Manejar selección de archivo
   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
    
      if (!selectedFile) {return;}

      // Validar tipo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
         setError('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)');
         setFile(null);
         setPreview(null);
         return;
      }

      // Validar tamaño (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
         setError('La imagen no debe superar 5MB');
         setFile(null);
         setPreview(null);
         return;
      }

      setFile(selectedFile);
      setError(null);
      setSuccess(null);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
         setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
   };

   // Limpiar formulario
   const resetForm = () => {
      setFile(null);
      setPreview(null);
      setFormData({
         establishmentId: '',
         itemId: '',
         caption: '',
         alt: '',
         tags: '',
         isPrimary: false
      });
      setUploadProgress(0);
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   // Subir foto
   const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Validaciones
      if (!file) {
         setError('Debes seleccionar una imagen');
         return;
      }

      if (!formData.establishmentId && !formData.itemId) {
         setError('Debes proporcionar un ID de establecimiento o item');
         return;
      }

      if (formData.establishmentId && formData.itemId) {
         setError('Solo puedes asociar la foto a un establecimiento O un item, no ambos');
         return;
      }

      setLoading(true);
      setError(null);
      setSuccess(null);
      setUploadProgress(0);

      try {
      // Crear FormData
         const data = new FormData();
         data.append('photo', file);
      
         if (formData.establishmentId) {
            data.append('establishment', formData.establishmentId.trim());
         }
      
         if (formData.itemId) {
            data.append('item', formData.itemId.trim());
         }
      
         if (formData.caption) {
            data.append('caption', formData.caption);
         }
      
         if (formData.alt) {
            data.append('alt', formData.alt);
         }
      
         if (formData.tags) {
            data.append('tags', formData.tags);
         }
      
         data.append('isPrimary', formData.isPrimary);

         // Hacer petición
         const response = await axios.post(
            "http://localhost:4000/api/photos/test-upload",
            data,
            {
               headers: {
                  'Content-Type': 'multipart/form-data'
               },
               onUploadProgress: (progressEvent) => {
                  const percentCompleted = Math.round(
                     (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setUploadProgress(percentCompleted);
               }
            }
         );

         console.log('✓ Foto subida:', response.data);
      
         setSuccess({
            message: '¡Foto subida exitosamente!',
            data: response.data.data
         });

         // Resetear formulario
         resetForm();

         // Notificar al padre
         if (onPhotoUploaded) {
            onPhotoUploaded(response.data.data);
         }

      } catch (err) {
         console.error('✗ Error:', err);
      
         const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error al subir la imagen';
      
         setError(errorMessage);
         setUploadProgress(0);
      } finally {
         setLoading(false);
      }
   };

   // Remover imagen
   const handleRemoveImage = () => {
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   return (
      <div className="photo-upload-form">
         <h2>📸 Subir Foto</h2>

         <form onSubmit={handleSubmit}>
            {/* Seleccionar Establecimiento o Item */}
            <div className="form-row">
               <div className="form-group">
                  <label htmlFor="establishmentId">
              ID de Establecimiento
                  </label>
                  <input
                     type="text"
                     id="establishmentId"
                     name="establishmentId"
                     value={formData.establishmentId}
                     onChange={handleInputChange}
                     placeholder="Ej: 67a1b2c3d4e5f6a7b8c9d0e1"
                     disabled={formData.itemId !== ''}
                  />
                  <small>Asociar foto a un establecimiento</small>
               </div>

               <div className="form-divider">O</div>

               <div className="form-group">
                  <label htmlFor="itemId">
              ID de Item (Tapa)
                  </label>
                  <input
                     type="text"
                     id="itemId"
                     name="itemId"
                     value={formData.itemId}
                     onChange={handleInputChange}
                     placeholder="Ej: 67a1b2c3d4e5f6a7b8c9d0e1"
                     disabled={formData.establishmentId !== ''}
                  />
                  <small>Asociar foto a una tapa/ración</small>
               </div>
            </div>

            {/* Seleccionar imagen */}
            <div className="form-group">
               <label htmlFor="photo">
            Imagen * <span className="label-info">(JPG, PNG, GIF, WEBP - Max 5MB)</span>
               </label>
          
               <div className="file-input-wrapper">
                  <input
                     ref={fileInputRef}
                     type="file"
                     id="photo"
                     accept="image/*"
                     onChange={handleFileChange}
                     className="file-input"
                  />
                  <label htmlFor="photo" className="file-input-label">
                     {file ? '✓ Imagen seleccionada' : '📁 Seleccionar imagen'}
                  </label>
               </div>
            </div>

            {/* Preview */}
            {preview && (
               <div className="preview-container">
                  <div className="preview-header">
                     <span>Vista previa</span>
                     <button 
                        type="button" 
                        onClick={handleRemoveImage}
                        className="btn-remove"
                     >
                ✕ Quitar
                     </button>
                  </div>
                  <img src={preview} alt="Preview" className="preview-image" />
                  <div className="file-info">
                     <span>{file.name}</span>
                     <span>{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
               </div>
            )}

            {/* Descripción */}
            <div className="form-group">
               <label htmlFor="caption">
            Descripción
               </label>
               <textarea
                  id="caption"
                  name="caption"
                  value={formData.caption}
                  onChange={handleInputChange}
                  placeholder="Descripción de la imagen..."
                  rows="3"
               />
            </div>

            {/* Texto alternativo */}
            <div className="form-group">
               <label htmlFor="alt">
            Texto alternativo (ALT)
               </label>
               <input
                  type="text"
                  id="alt"
                  name="alt"
                  value={formData.alt}
                  onChange={handleInputChange}
                  placeholder="Descripción breve para accesibilidad"
               />
            </div>

            {/* Tags */}
            <div className="form-group">
               <label htmlFor="tags">
            Etiquetas
               </label>
               <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="exterior, terraza, comida (separadas por comas)"
               />
               <small>Separa las etiquetas con comas</small>
            </div>

            {/* Imagen principal */}
            <div className="form-group-checkbox">
               <label>
                  <input
                     type="checkbox"
                     name="isPrimary"
                     checked={formData.isPrimary}
                     onChange={handleInputChange}
                  />
                  <span>Marcar como imagen principal</span>
               </label>
            </div>

            {/* Barra de progreso */}
            {loading && (
               <div className="progress-container">
                  <div className="progress-bar">
                     <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                     />
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
               </div>
            )}

            {/* Botón submit */}
            <button
               type="submit"
               disabled={loading || !file || (!formData.establishmentId && !formData.itemId)}
               className="btn-submit"
            >
               {loading ? 'Subiendo...' : 'Subir Foto 📸'}
            </button>
         </form>

         {/* Mensajes */}
         {error && (
            <div className="alert alert-error">
               <strong>❌ Error:</strong> {error}
            </div>
         )}

         {success && (
            <div className="alert alert-success">
               <strong>✅ {success.message}</strong>
               <div className="success-details">
                  <p><strong>ID:</strong> {success.data._id}</p>
                  <p><strong>URL:</strong> <a href={success.data.url} target="_blank" rel="noopener noreferrer">Ver en Cloudinary</a></p>
                  <p><strong>Tamaño:</strong> {(success.data.size / 1024).toFixed(2)} KB</p>
                  <p><strong>Dimensiones:</strong> {success.data.dimensions.width} x {success.data.dimensions.height}px</p>
               </div>
               {success.data.url && (
                  <div className="success-image">
                     <img src={success.data.thumbnailUrl || success.data.url} alt="Uploaded" />
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default PhotoUploadForm;