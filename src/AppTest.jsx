

import { useState } from 'react';
import PhotoUploadForm from './components/Photouploadform';
import PhotoGallery from './components/Photogallery';
import './App.css';

function AppTest() {
   const [refreshGallery, setRefreshGallery] = useState(0);

   // Callback para refrescar la galería cuando se sube una foto
   const handlePhotoUploaded = () => {
      setRefreshGallery(prev => prev + 1);
   };

   return (
      <div className="app">
         <header className="app-header">
            <h1>🍷 nexTapa</h1>
            <p>Gestor de Fotos - Prueba de Cloudinary</p>
         </header>

         <main className="app-main">
            <div className="container">
               {/* Formulario de subida */}
               <section className="upload-section">
                  <PhotoUploadForm onPhotoUploaded={handlePhotoUploaded} />
               </section>

               {/* Galería de fotos */}
               <section className="gallery-section">
                  <PhotoGallery key={refreshGallery} />
               </section>
            </div>
         </main>

         <footer className="app-footer">
            <p>⚠️ Modo de prueba - Sin autenticación</p>
         </footer>
      </div>
   );
}

export default AppTest;