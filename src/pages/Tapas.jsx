import { useNavigate } from "react-router-dom";

import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Tag from "../components/common/Tag";
import RatingBar from "../components/common/RatingBar";

export default function Tapas() {
  const navigate = useNavigate();

  // DATOS MOCK (de momento sin backend)
  const tapa = {
    id: 1,
    name: "Patatas Bravas Royale",
    price: 6.5,
    images: [
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      "https://images.unsplash.com/photo-1604908177522-429a7c04b6a4",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87"
    ],
    description:
      "Patatas triple cocción con salsa brava secreta y alioli de ajo negro. Crujientes por fuera y cremosas por dentro.",
    rating: 4.9,
    totalReviews: 120,
    tags: ["Vegetariana", "Picante", "Signature"],
    ingredients: ["Patata", "Pimentón", "Ajo negro", "Aceite de oliva"],
    establishmentName: "El Tigre Tapas Bar",
  };

  return (
    <div>
      {/* HERO IMAGES */}
      <div className="relative max-w-3xl mx-auto mt-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-80">

          {/* Imagen grande */}
          <div className="col-span-2 row-span-2 relative">
            <img
              src={tapa.images[0]}
              className="w-full h-full object-cover rounded-xl"
              alt={tapa.name}
            />
            <div className="absolute inset-0 bg-black/30 rounded-xl" />
          </div>

          {/* Imagen pequeña 1 */}
          <div>
            <img
              src={tapa.images[1]}
              className="w-full h-full object-cover rounded-xl"
              alt="tapa extra 1"
            />
          </div>

          {/* Imagen pequeña 2 */}
          <div>
            <img
              src={tapa.images[2]}
              className="w-full h-full object-cover rounded-xl"
              alt="tapa extra 2"
            />
          </div>
        </div>

        {/* TOP BAR */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center"
          >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          </button>
          <span className="text-white font-semibold">nexTapa</span>
          <button className="bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>
      </div>

      <Container>
        {/* TITLE + PRICE */}
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold">{tapa.name}</h1>
          <span className="text-xl font-semibold text-orange-500">
            {tapa.price}€
          </span>
        </div>

        {/* RESTAURANT */}
        <p className="text-sm text-neutral-400 mb-2">
          {tapa.establishmentName}
        </p>

        {/* RATING */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold">
            ⭐ {tapa.rating}
          </span>
          <span className="text-sm text-neutral-400">
            ({tapa.totalReviews} reviews)
          </span>
        </div>

        {/* TAGS */}
        <div className="flex gap-2 mb-6">
          {tapa.tags.map((tag, i) => (
            <Tag key={i} label={tag} />
          ))}
        </div>

        {/* DESCRIPTION */}
        <Section title="Sobre esta tapa">
          <p className="text-sm text-neutral-600">
            {tapa.description}
          </p>
        </Section>

        {/* INGREDIENTS */}
        <Section title="Ingredientes">
          <div className="flex flex-wrap">
            {tapa.ingredients.map((ing, i) => (
              <Badge key={i} variant="feature" className="mr-2 mb-2">
                {ing}
              </Badge>
            ))}
          </div>
        </Section>

        {/* RATINGS */}
        <Section title="Valoraciones">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold">
                {tapa.rating}
              </p>
              <p className="text-sm text-neutral-400">
                {tapa.totalReviews} opiniones
              </p>
            </div>
            <div className="flex-1 space-y-2">
              <RatingBar stars={5} value={80} />
              <RatingBar stars={4} value={15} />
              <RatingBar stars={3} value={5} />
            </div>
          </div>
        </Section>

        {/* CTA */}
        <div className="mt-8 mb-6">
          <Button className="w-full bg-orange-500 py-4 rounded-xl text-white font-semibold hover:bg-orange-600">
            Llévame allí
          </Button>
        </div>
      </Container>
    </div>
  );
}
