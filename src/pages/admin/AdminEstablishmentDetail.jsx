// src/pages/admin/AdminEstablishmentDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { establishmentService } from "../../services/establishmentService";
import "./styles/admin.css";

import { EstablishmentItems } from "./adminComponents/EstablishmentItemsAdmin";
import { EstablishmentStatus } from "./adminComponents/StatusAdmin";
import { BasicInformationAdmin } from "./adminComponents/BasicInformationAdmin";
import { CuisineTypeAdmin } from "./adminComponents/CuisineTypeAdmin";
import { AdressAdmin } from "./adminComponents/AdressAdmin";
import { MapboxPicker } from "./adminComponents/MapboxPicker";
import { ContactAdmin } from "./adminComponents/ContactAdmin";
import { SocialLinksAdmin } from "./adminComponents/SocialLinksAdmin";
import { ScheduleAdmin } from "./adminComponents/ScheduleAdmin";
import { FeaturesAdmin } from "./adminComponents/FeaturesAdmin";
import { ViewInAppButton } from "./adminComponents/ViewInAppButton";
import { EstablishmentPhotosAdmin } from "./adminComponents/EstablishmentPhotosAdmin";

const makeDay = (closed = false, open = "09:00", close = "00:00") => ({
  open, close, split: false,
  afternoon: { open: "", close: "" },
  closed,
});

const mapDay = (d) => ({
  open:      d?.open      || "",
  close:     d?.close     || "",
  split:     d?.split     ?? false,
  afternoon: d?.afternoon ?? { open: "", close: "" },
  closed:    d?.closed    ?? true,
});

const EMPTY_FORM = {
  name: "", slug: "", description: "", mainImage: "",
  type: "bar", cuisineType: [],
  address: { street: "", number: "", city: "", province: "", postalCode: "", country: "España" },
  location: { type: "Point", coordinates: [-3.7038, 40.4168] },
  phone: "", email: "", website: "",
  socialLinks: { instagram: "", facebook: "", twitter: "", googleBusiness: "" },
  schedule: {
    lunes:     makeDay(true),
    martes:    makeDay(false),
    miercoles: makeDay(false),
    jueves:    makeDay(false),
    viernes:   makeDay(false),
    sabado:    makeDay(false),
    domingo:   makeDay(false),
  },
  features: [], priceRange: "€€", owner: "", verified: false, active: true,
};

export const AdminEstablishmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [loading, setLoading]       = useState(!isNew);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await establishmentService.getById(id);
        const est = res.data;
        setForm({
          name:        est.name        || "",
          slug:        est.slug        || "",
          description: est.description || "",
          mainImage:   est.mainImage   || est.image || "",
          type:        est.type        || "bar",
          cuisineType: est.cuisineType || [],
          address: {
            street:     est.address?.street     || "",
            number:     est.address?.number     || "",
            city:       est.address?.city       || "",
            province:   est.address?.province   || "",
            postalCode: est.address?.postalCode || "",
            country:    est.address?.country    || "España",
          },
          location: { type: "Point", coordinates: est.location?.coordinates || [0, 0] },
          phone:   est.phone   || "",
          email:   est.email   || "",
          website: est.website || "",
          socialLinks: {
            instagram:      est.socialLinks?.instagram      || "",
            facebook:       est.socialLinks?.facebook       || "",
            twitter:        est.socialLinks?.twitter        || "",
            googleBusiness: est.socialLinks?.googleBusiness || "",
          },
          schedule: {
            lunes:     mapDay(est.schedule?.lunes),
            martes:    mapDay(est.schedule?.martes),
            miercoles: mapDay(est.schedule?.miercoles),
            jueves:    mapDay(est.schedule?.jueves),
            viernes:   mapDay(est.schedule?.viernes),
            sabado:    mapDay(est.schedule?.sabado),
            domingo:   mapDay(est.schedule?.domingo),
          },
          features:   est.features   || [],
          priceRange: est.priceRange || "",
          verified:   est.verified   || false,
          active:     est.active !== undefined ? est.active : true,
          owner:      est.owner?._id || est.owner || "",
        });
      } catch (err) {
        setError("Error al cargar el establecimiento", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddress = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
  };

  const handleScheduleChange = (day, field, value) => {
    setForm((prev) => {
      const prevDay = prev.schedule[day] || {};
      const updatedDay = field === "afternoon"
        ? { ...prevDay, afternoon: { open: prevDay.afternoon?.open || "", close: prevDay.afternoon?.close || "", ...value } }
        : { ...prevDay, [field]: value };
      return { ...prev, schedule: { ...prev.schedule, [day]: updatedDay } };
    });
  };

  const handleMapCoordinates         = (newCoords)  => setForm((prev) => ({ ...prev, location: { type: "Point", coordinates: newCoords } }));
  const handleAddressFromMap         = (newAddress) => setForm((prev) => ({ ...prev, address: { ...prev.address, ...newAddress } }));
  const handleCoordinatesFromAddress = (newCoords)  => setForm((prev) => ({ ...prev, location: { type: "Point", coordinates: newCoords } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSaving(true);
    try {
      if (isNew) {
        const res = await establishmentService.create(form);
        navigate(`/admin/establishments/${res.data._id}`);
      } else {
        await establishmentService.update(id, form);
        setSuccessMsg("Establecimiento actualizado correctamente");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Error al ${isNew ? "crear" : "actualizar"} el establecimiento`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-loading">Cargando...</p>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <button className="admin-btn admin-btn-secondary" onClick={() => navigate("/admin/establishments")}>
          ← Volver
        </button>
        <h1 className="admin-title">
          {isNew ? "Nuevo Establecimiento" : `Editar: ${form.name}`}
        </h1>
        {!isNew && <ViewInAppButton slug={form.slug} />}
      </div>

      {error      && <div className="admin-alert admin-alert-error">{error}</div>}
      {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="admin-form">

        {isNew && (
          <div className="admin-section">
            <h2 className="admin-section-title">Propietario</h2>
            <div className="admin-field">
              <label className="admin-label">Owner ID</label>
              <input
                className="admin-input"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                placeholder="Dejar vacío o ingresar ID de usuario propietario"
              />
              <span className="admin-hint">Puedes obtenerlo desde la sección Usuarios</span>
            </div>
          </div>
        )}

        <div className="admin-row">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
            {!isNew && (
              <EstablishmentStatus
                active={form.active}
                verified={form.verified}
                onChange={handleChange}
                name={form.name}
                saving={saving}
              />
            )}
            <ContactAdmin
              contact={{ phone: form.phone, email: form.email, website: form.website }}
              onChange={handleChange}
              saving={saving}
            />
          </div>
          <SocialLinksAdmin
            socialLinks={form.socialLinks}
            establishmentId={id}
            isNew={isNew}
            onChange={(links) => setForm((prev) => ({ ...prev, socialLinks: links }))}
            saving={saving}
          />
        </div>

        <div className="admin-row">
          <BasicInformationAdmin form={form} onChange={handleChange} saving={saving} />
          <ScheduleAdmin schedule={form.schedule} onChange={handleScheduleChange} saving={saving} />
        </div>

        <div className="admin-row">
          <FeaturesAdmin
            features={form.features}
            onAdd={(f)    => setForm((prev) => ({ ...prev, features:    [...prev.features,    f] }))}
            onRemove={(f) => setForm((prev) => ({ ...prev, features:    prev.features.filter((ft) => ft !== f) }))}
            saving={saving}
          />
          <CuisineTypeAdmin
            cuisineType={form.cuisineType}
            onAdd={(c)    => setForm((prev) => ({ ...prev, cuisineType: [...prev.cuisineType, c] }))}
            onRemove={(c) => setForm((prev) => ({ ...prev, cuisineType: prev.cuisineType.filter((ct) => ct !== c) }))}
            saving={saving}
          />
        </div>

        <div className="admin-row">
          <AdressAdmin
            address={form.address}
            onChange={handleAddress}
            onCoordinatesChange={handleCoordinatesFromAddress}
            saving={saving}
          />
          <MapboxPicker
            coordinates={form.location.coordinates}
            onChange={handleMapCoordinates}
            onAddressChange={handleAddressFromMap}
            saving={saving}
          />
        </div>

        <div className="admin-form-footer">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving
              ? isNew ? "Creando..."   : "Guardando..."
              : isNew ? "Crear Establecimiento" : "Guardar Cambios"
            }
          </button>
        </div>

      </form>

      {!isNew && (
        <div className="admin-row">
          <EstablishmentPhotosAdmin
            establishmentId={id}
            mainImage={form.mainImage}
            onMainImageChange={(url) => setForm((prev) => ({ ...prev, mainImage: url }))}
          />
          <EstablishmentItems establishmentId={id} />
        </div>
      )}

      {!isNew && <ViewInAppButton slug={form.slug} />}
    </div>
  );
};