

// src/pages/admin/ItemAdmin.jsx
// Página de administración para crear o editar tapas

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { itemService } from '../../services/itemService';
import { SaveButton } from './adminComponents/SaveButton';
import { BasicInformationItem } from './itemsComponents/BasicInformationItem';
import { PriceInformation } from './itemsComponents/PriceInformation';
import { StateAndVisibility } from './itemsComponents/StateAndVisibility';
import { Categories } from './itemsComponents/Categories';
import { Allergens } from './itemsComponents/Allargens';
import { DietaryOptions } from './itemsComponents/DietaryOptions';
import { ItemPhotoSection } from './itemsComponents/ItemPhotoSection';
import { ViewItemInAppButton } from './itemsComponents/ViewItemInApp';

import './styles/admin.css';
import './styles/itemAdmin.css';

export const ItemAdmin = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const isNew = id === 'new';

   const [item, setItem] = useState(null);
   const [loading, setLoading] = useState(!isNew);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);
   const location = useLocation();
   const establishmentIdFromState = location.state?.establishmentId;

   const [form, setForm] = useState({
      name: '',
      description: '',
      modalities: [{ label: 'Tapa', price: 0, isFree: false, available: true }], // ← nuevo
      categories: [],
      allergens: [],
      dietaryOptions: [],
      available: true,
      featured: false,
      seasonalItem: false,
      specialDays: [],
      order: 0,
   });

   useEffect(() => {
      if (!isNew) { fetchItem(); }
   }, [id]);

   const fetchItem = async () => {
      try {
         setLoading(true);
         const res = await itemService.getById(id);
         const data = res.data;
         setItem(data);
         setForm({
            name: data.name || '',
            description: data.description || '',
            modalities: data.modalities?.length  // ← nuevo
               ? data.modalities
               : [{ label: 'Tapa', price: 0, isFree: false, available: true }],
            categories: data.categories || [],
            allergens: data.allergens || [],
            dietaryOptions: data.dietaryOptions || [],
            available: data.available !== undefined ? data.available : true,
            featured: data.featured || false,
            seasonalItem: data.seasonalItem || false,
            specialDays: data.specialDays || [],
            order: data.order || 0,
         });
      } catch (err) {
         setError('Error al cargar la tapa', err);
      } finally {
         setLoading(false);
      }
   };

   const handleChange = (field, value) => {
      setForm(prev => ({ ...prev, [field]: value }));
      setSuccess(false);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         setSaving(true);
         setError(null);
         const payload = {
            ...form,
            modalities: form.modalities.map(m => ({
               ...m,
               isFree: m.price === 0,
            })), 
            ...(isNew && establishmentIdFromState ? { establishment: establishmentIdFromState } : {}),
         };
         if (isNew) {
            await itemService.create(payload);
         } else {
            await itemService.update(id, payload);
         }
         setSuccess(true);
         setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
         setError('Error al guardar la tapa', err);
      } finally {
         setSaving(false);
      }
   };

   if (loading) {
      return <div className="admin-page"><p className="admin-loading">Cargando tapa...</p></div>;
   }

   return (
      <div className="admin-page">

         {/* Header */}
         <div className="admin-page-header">
            <button
               className="admin-btn admin-btn-secondary admin-btn-sm"
               onClick={() => navigate(-1)}
            >
               ← Volver
            </button>
            <div>
               <h1 className="admin-title">
                  {isNew ? 'Nueva Tapa' : `Editar: ${item?.name || ''}`}
               </h1>
               {!isNew && item?.establishment && (
                  <p className="admin-page-subtitle">{item.establishment.name}</p>
               )}
            </div>
         </div>

         {error && <div className="admin-alert admin-alert-error">{error}</div>}
         {success && <div className="admin-alert admin-alert-success">Tapa guardada correctamente</div>}

         <form onSubmit={handleSubmit} className="admin-form">

            {/* Foto principal — ancho completo, protagonista */}
            <div className="admin-section">
               <h2 className="admin-section-title">Fotos</h2>
               <ItemPhotoSection
                  itemId={isNew ? null : id}
                  mainImage={form.mainImage || item?.mainImage}
                  onMainImageChange={(url) => handleChange('mainImage', url)}
               />
            </div>

            {/* Fila 1: Info básica + Precio */}
            <div className="admin-row">
               <BasicInformationItem form={form} handleChange={handleChange} />
               <StateAndVisibility form={form} handleChange={handleChange} />
              
            </div>

            {/* Fila 2: Estado y visibilidad + Categorías */}
            <div className="admin-row">
               
               <PriceInformation form={form} handleChange={handleChange} />
               <Categories form={form} handleChange={handleChange} />
            </div>

            {/* Fila 3: Alérgenos + Opciones dietéticas */}
            <div className="admin-row">
               <Allergens form={form} handleChange={handleChange} />
               <DietaryOptions form={form} handleChange={handleChange} />
            </div>

            <div className="admin-form-footer">
               <SaveButton saving={saving} />
               {!isNew && <ViewItemInAppButton slug={item?.slug} />}
            </div>

         </form>

      </div>
   );
};