import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import Button from "../components/common/Button";
import RatingBar from "../components/common/RatingBar";
import Footer from "../components/layout/Footer";

import { itemService } from "../services/itemService";
import { photoService } from "../services/photoService";
import { ItemGallery } from "../components/common/ItemGallery";
import { cloudinaryPresets } from "../utils/cloudinaryHelpers";
import {
  CheckCircle,
  XCircle,
  HeartHandshake,
  SquareArrowLeft,
  Tags,
  AlertTriangle,
  Leaf,
} from "lucide-react";

export const Tapas = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [tapa, setTapa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [photos, setPhotos] = useState([]);
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    if (slug) {
      loadTapa();
    }
  }, [slug]);

  const loadTapa = async () => {
    try {
      setLoading(true);
      const response = await itemService.getBySlug(slug);
      if (!response || !response.data) {
        setError("Tapa no encontrada");
        return;
      }
      const data = response.data;
      setTapa(data);
      setHeroImage(data.mainImage || null);

      const fotosData = await photoService.getByItem(data._id);
      const sorted = [...(fotosData || [])].sort((a, b) => a.order - b.order);
      setPhotos(sorted);
    } catch (err) {
      console.error("Error al cargar la tapa:", err);
      setError("No se pudo cargar la tapa.");
    } finally {
      setLoading(false);
    }
  };

  const primaryImage =
    photos.find((p) => p.isPrimary)?.url || tapa?.mainImage || "/fallback.png";

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">Cargando tapa...</p>
        </div>
      </Container>
    );
  }

  if (error || !tapa) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-lg text-red-500 mb-4">
            {error || "Tapa no encontrada"}
          </p>
          <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
      </Container>
    );
  }

  const hasImage = !!tapa.mainImage;

  return (
    <div>
      {/* HERO */}
      <div className="relative max-w-3xl mx-auto mt-4 h-96">
        {hasImage ? (
          <>
            <img
              src={tapa.mainImage}
              alt={tapa.name}
              className="w-full h-full object-cover rounded-xl shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/Logo.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black/20 rounded-xl" />
          </>
        ) : (
          <div className="w-full h-full rounded-xl bg-neutral-800 overflow-hidden">
            <img
              src="/Logo.jpg"
              alt="nexTapa"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        )}

        {/* TOP BAR */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center"
          >
            <SquareArrowLeft />
          </button>

          <span className="text-white font-semibold">nexTapa</span>

          <button className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
            <HeartHandshake />
          </button>
        </div>
      </div>

      <Container>
        {/* DESCRIPCIÓN */}
        {tapa.description && (
          <div className="mt-6 bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-white">{tapa.name}</h2>
              <div className="w-16 h-1 bg-orange-500 rounded-full mt-3 mx-auto" />
            </div>

            <p className="text-sm text-white leading-relaxed text-center">
              {tapa.description}
            </p>
          </div>
        )}

        {/* MODALIDADES + DISPONIBILIDAD */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mt-4">
          {/* Modalidades */}
          {tapa.modalities?.length > 0 && (
            <div className="flex flex-wrap gap-2 md:max-w-[60%]">
              {tapa.modalities.map((mod, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${
                    mod.isFree
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-neutral-800 border-neutral-700"
                  }`}
                >
                  <span className="text-sm text-neutral-300">{mod.label}</span>

                  {mod.isFree ? (
                    <span className="text-xs font-bold text-green-400">
                      Gratis
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-orange-400">
                      {mod.price}€
                    </span>
                  )}

                  {!mod.available && (
                    <span className="text-xs text-neutral-600">
                      · No disponible
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Disponibilidad */}
          <div className="mt-4 md:mt-0">
            <Section title="Disponibilidad">
              <div className="flex items-center gap-3">
                {tapa.available ? (
                  <>
                    <CheckCircle className="text-green-500 w-5 h-5" />
                    <span className="text-green-400 font-semibold">
                      Disponible
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 w-5 h-5" />
                    <span className="text-red-400 font-semibold">
                      No disponible
                    </span>
                  </>
                )}
              </div>
            </Section>
          </div>
        </div>

        {/* INFORMACIÓN ADICIONAL */}
        <Section title="Información adicional">
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            {/* CATEGORÍAS */}
            <div className="flex-1 bg-neutral-900 rounded-2xl p-6 border-2 border-blue-500 text-center min-h-55 flex flex-col">
              <div>
                <Tags className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-lg mb-4">
                  Categorías
                </h3>
              </div>

              <div className="flex flex-wrap justify-center gap-2 grow items-center">
                {tapa.categories?.length > 0 ? (
                  tapa.categories.map((cat, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full"
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-500">—</span>
                )}
              </div>
            </div>

            {/* ALÉRGENOS */}
            <div className="flex-1 bg-neutral-900 rounded-2xl p-6 border-2 border-red-500 text-center min-h-55 flex flex-col">
              <div>
                <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-lg mb-4">
                  Alérgenos
                </h3>
              </div>

              <div className="flex flex-wrap justify-center gap-2 grow items-center">
                {tapa.allergens?.length > 0 ? (
                  tapa.allergens.map((allergen, i) => (
                    <span
                      key={i}
                      className="text-xs bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-full"
                    >
                      {allergen}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-500">—</span>
                )}
              </div>
            </div>

            {/* DIETA */}
            <div className="flex-1 bg-neutral-900 rounded-2xl p-6 border-2 border-green-500 text-center min-h-55 flex flex-col">
              <div>
                <Leaf className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-lg mb-4">Dieta</h3>
              </div>

              <div className="flex flex-wrap justify-center gap-2 grow items-center">
                {tapa.dietaryOptions?.length > 0 ? (
                  tapa.dietaryOptions.map((diet, i) => (
                    <span
                      key={i}
                      className="text-xs bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full"
                    >
                      {diet}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-500">—</span>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* RATING */}
        <Section title="Valoración">
          <RatingBar
            average={tapa.averageRating}
            totalReviews={tapa.totalReviews}
            breakdown={tapa.ratingBreakdown}
          />
        </Section>

        {/* GALERÍA */}
        <Section title={`Todas las tapas de ${tapa.establishment.name}`}>
          <ItemGallery establishmentId={tapa.establishment._id} />
        </Section>

        {/* BOTÓN BAR */}
        <div className="mt-8 mb-6">
          <Button
            onClick={() =>
              navigate(`/establishment/${tapa.establishment.slug}`)
            }
            className="w-full bg-orange-500 py-4 rounded-xl text-white font-semibold hover:bg-orange-600"
          >
            Volver al establecimiento {tapa.establishment.name}
          </Button>
        </div>

        <Footer />
      </Container>
    </div>
  );
};
