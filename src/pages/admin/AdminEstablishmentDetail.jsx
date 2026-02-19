// src/pages/admin/AdminEstablishmentDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { establishmentService } from '../../services/establishmentService';
import './styles/admin.css';

import { EstablishmentItems } from './adminComponents/ItemsAdmin';
import { EstablishmentStatus } from './adminComponents/StatusAdmin';
import { BasicInformationAdmin } from './adminComponents/BasicInformationAdmin';
import { CuisineTypeAdmin } from './adminComponents/CuisineTypeAdmin';
import { AdressAdmin } from './adminComponents/AdressAdmin';
import { CoordinatesAdmin } from './adminComponents/CoordinatesAdmin';
import { ContactAdmin } from './adminComponents/ContactAdmin';
import { ScheduleAdmin } from './adminComponents/ScheduleAdmin';
import { FeaturesAdmin } from './adminComponents/FeaturesAdmin';
import { ViewInAppButton } from './adminComponents/ViewInAppButton';

export const AdminEstablishmentDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();

   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState(null);
   const [successMsg, setSuccessMsg] = useState(null);

   const [form, setForm] = useState({//estructura del establecimiento, con valores por defecto para evitar errores de undefined
      name: '',
      slug: '',
      description: '',
      type: 'bar',
      cuisineType: [],
      address: { street: '', number: '', city: '', province: '', postalCode: '', country: 'España' },
      location: { type: 'Point', coordinates: [0, 0] },
      phone: '',
      email: '',
      website: '',
      schedule: {
         lunes:     { open: '', close: '', closed: true },
         martes:    { open: '', close: '', closed: true },
         miercoles: { open: '', close: '', closed: true },
         jueves:    { open: '', close: '', closed: true },
         viernes:   { open: '', close: '', closed: true },
         sabado:    { open: '', close: '', closed: true },
         domingo:   { open: '', close: '', closed: true },
      },
      features: [],
      priceRange: '',
      verified: false,
      active: true,
   });

   useEffect(() => {
      const load = async () => {
         try {
            setLoading(true);
            const res = await establishmentService.getById(id);
            const est = res.data;
            setForm({
               name: est.name || '',
               slug: est.slug || '',
               description: est.description || '',
               type: est.type || 'bar',
               cuisineType: est.cuisineType || [],
               address: {
                  street: est.address?.street || '',
                  number: est.address?.number || '',
                  city: est.address?.city || '',
                  province: est.address?.province || '',
                  postalCode: est.address?.postalCode || '',
                  country: est.address?.country || 'España',
               },
               location: { type: 'Point', coordinates: est.location?.coordinates || [0, 0] },
               phone: est.phone || '',
               email: est.email || '',
               website: est.website || '',
               schedule: {
                  lunes:     { open: est.schedule?.lunes?.open || '',     close: est.schedule?.lunes?.close || '',     closed: est.schedule?.lunes?.closed ?? true },
                  martes:    { open: est.schedule?.martes?.open || '',    close: est.schedule?.martes?.close || '',    closed: est.schedule?.martes?.closed ?? true },
                  miercoles: { open: est.schedule?.miercoles?.open || '', close: est.schedule?.miercoles?.close || '', closed: est.schedule?.miercoles?.closed ?? true },
                  jueves:    { open: est.schedule?.jueves?.open || '',    close: est.schedule?.jueves?.close || '',    closed: est.schedule?.jueves?.closed ?? true },
                  viernes:   { open: est.schedule?.viernes?.open || '',   close: est.schedule?.viernes?.close || '',   closed: est.schedule?.viernes?.closed ?? true },
                  sabado:    { open: est.schedule?.sabado?.open || '',    close: est.schedule?.sabado?.close || '',    closed: est.schedule?.sabado?.closed ?? true },
                  domingo:   { open: est.schedule?.domingo?.open || '',   close: est.schedule?.domingo?.close || '',   closed: est.schedule?.domingo?.closed ?? true },
               },
               features: est.features || [],
               priceRange: est.priceRange || '',
               verified: est.verified || false,
               active: est.active !== undefined ? est.active : true,
            });
         } catch (err) {
            setError('Error loading establishment');
         } finally {
            setLoading(false);
         }
      };
      load();
   }, [id]);

   // ── Handlers ───────────────────────────────────────────
   const handleChange = (e) => { //maneja cambios en campos simples y checkbox
      const { name, value, type, checked } = e.target;
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
   };

   const handleAddress = (e) => { //maneja cambios en campos de dirección
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
   };

   const handleCoordinates = (e) => { //maneja cambios en campos de coordenadas
      const { name, value } = e.target;
      const coords = [...form.location.coordinates];
      if (name === 'lng') {coords[0] = parseFloat(value) || 0;}
      if (name === 'lat') {coords[1] = parseFloat(value) || 0;}
      setForm(prev => ({ ...prev, location: { ...prev.location, coordinates: coords } }));
   };

   const handleScheduleChange = (day, field, value) => { //maneja cambios en campos de horario
      console.log('Schedule change:', day, field, value);
      setForm(prev => ({
         ...prev,
         schedule: { ...prev.schedule, [day]: { ...prev.schedule[day], [field]: value } }
      }));
   };

   const handleSubmit = async (e) => { //maneja el envío del formulario
      e.preventDefault();
      console.log('SUBMIT FIRED');
      setError(null);
      setSuccessMsg(null);
      setSaving(true);
      try {
         await establishmentService.update(id, form);
         setSuccessMsg('Establishment updated successfully!');
         setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err) {
         setError(err.response?.data?.message || 'Error updating establishment');
      } finally {
         setSaving(false);
      }
   };

   if (loading) {return <p className="admin-loading">Loading...</p>;}

   return (
      <div className="admin-page">

         <div className="admin-page-header">
            <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/establishments')}>
        ← Back
            </button>
            <h1 className="admin-title">Editar: {form.name}</h1>
            <ViewInAppButton id={id} />
         </div>

         {error && <div className="admin-alert admin-alert-error">{error}</div>}
         {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

         <form onSubmit={handleSubmit} className="admin-form">

            {/* Fila 1: Status + Contact */}
            <div className="admin-row">
               <EstablishmentStatus active={form.active} verified={form.verified} onChange={handleChange} name={form.name} saving={saving} />
               <ContactAdmin contact={{ phone: form.phone, email: form.email, website: form.website }} onChange={handleChange} saving={saving} />
            </div>

            {/* Fila 2: Basic Info - ancho completo */}
            <BasicInformationAdmin form={form} onChange={handleChange} saving={saving} />

            {/* Fila 3: Features + Cuisine Type */}
            <div className="admin-row">
               <FeaturesAdmin
                  features={form.features}
                  onAdd={f => setForm(prev => ({ ...prev, features: [...prev.features, f] }))}
                  onRemove={f => setForm(prev => ({ ...prev, features: prev.features.filter(ft => ft !== f) }))}
                  saving={saving}
               />
               <CuisineTypeAdmin
                  cuisineType={form.cuisineType}
                  onAdd={c => setForm(prev => ({ ...prev, cuisineType: [...prev.cuisineType, c] }))}
                  onRemove={c => setForm(prev => ({ ...prev, cuisineType: prev.cuisineType.filter(ct => ct !== c) }))}
                  saving={saving}
               />
            </div>

            {/* Fila 4: Address + columna con Coordinates y Schedule */}
            <div className="admin-row">
               <AdressAdmin address={form.address} onChange={handleAddress} saving={saving} />
               <div className="admin-col">
                  <CoordinatesAdmin coordinates={form.location.coordinates} onChange={handleCoordinates} saving={saving} />
                  <ScheduleAdmin schedule={form.schedule} onChange={handleScheduleChange} saving={saving} />
               </div>
            </div>

         </form>

         <EstablishmentItems establishmentId={id} />

      </div>
   );
};