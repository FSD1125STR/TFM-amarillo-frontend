import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import ActionButton from "../components/common/ActionButton";
import Tag from "../components/common/Tag";
import RatingBar from "../components/common/RatingBar";

export default function Establishment() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="relative h-72 max-w-3xl mx-auto">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de"
          className="w-full h-full object-cover rounded-xl"
          alt="Establishment"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
          >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>

          </button>
          <span className="text-white font-semibold">nexTapa</span>
          <button className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>

          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="mb-2 inline-block">VERIFICADO</Badge>
          <h1 className="text-3xl font-bold text-white">
            El olivo de Madrid
          </h1>
          <p className="text-sm text-neutral-300">
            ⭐ 4.8 - 124 reviews
          </p>
        </div>
      </div>

      <Container>
        {/* GALERIA DE IMAGENES */}
        <div className="flex gap-3 mt-4 overflow-x-auto">
          {[
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
            "https://images.unsplash.com/photo-1604908177522-429a7c04b6a4",
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
          ].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Gallery ${i + 1}`}
              className="h-20 w-32 object-cover rounded-lg shrink-0"
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <ActionButton label="Menu" />
          <ActionButton label="Telefono" />
          <ActionButton label="Compartir" />
        </div>

        {/* CARACTERISTICAS */}
        <Section title="Servicios">
          <div className="flex flex-wrap">
            <Badge variant="feature" className="mr-2 mb-2">Wi-Fi</Badge>
            <Badge variant="feature" className="mr-2 mb-2">Terraza</Badge>
            <Badge variant="feature" className="mr-2 mb-2">Grupos</Badge>
            <Badge variant="feature" className="mr-2 mb-2">Opcion Vegana</Badge>
          </div>
        </Section>

        {/* ESPECIALIDADES */}
        <Section title="Platos Estrellas">
          <div className="flex flex-wrap">
            <Tag label="Patatas Bravas" />
            <Tag label="Gambas al Ajillo" />
            <Tag label="Tortilla Casera" />
            <Tag label="Croquetas Ibericas" />
          </div>
        </Section>

        {/* GEOLOCALIZACION */}
        <Section title="Ubicacion">
          <p className="text-sm text-neutral-400">
            Carrer de Mallorca, 236 <br />
            08008 Barcelona, Spain
          </p>
          <img
            src="https://maps.googleapis.com/maps/api/staticmap?center=Barcelona&zoom=13&size=600x300&key=YOUR_API_KEY"
            alt="Map location"
            className="mt-3 rounded-xl w-full"
          />
        </Section>

        {/* HORARIOS */}
        <Section title="Horarios">
          <p className="text-sm">
            Apertura: 12:00 AM / Cierre: 12:00 PM
          </p>
        </Section>

        <Section title="Opiniones">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold">4.8</p>
              <p>⭐⭐⭐⭐⭐</p>
              <p className="text-sm text-neutral-400">
                124 reviews
              </p>
            </div>
            <div className="flex-1 space-y-2">
              <RatingBar stars={5} value={80} />
              <RatingBar stars={4} value={10} />
              <RatingBar stars={3} value={5} />
            </div>
          </div>
        </Section>
    
        <div className="mt-8 mb-6">
            <Button className="w-full bg-orange-500 py-4 rounded-xl text-white font-semibold hover:bg-orange-600 transition-colors">
            Registrate Aqui
            </Button>
        </div>
    </Container>
</div>
  );
}