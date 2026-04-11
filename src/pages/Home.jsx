import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Container from "../components/layout/Container";
import { SearchDropdown } from "../components/search/SearchDropdown";
import NearbySection from "../components/home/NearbySection";
import { FeaturedSection } from "../components/home/FeaturedSection";
import TopCities from "../components/home/TopCities";
import QuickFilters from "../components/home/QuickFilters";
import HowItWorks from "../components/home/HowItWorks";
import HostCTA from "../components/home/HostCTA";

export const Home = () => {
   const navigate = useNavigate();

   return (
      <>
         <Header showSearch={false} />

         <Container>
            <section className="px-4 pt-2" aria-labelledby="home-hero-title">
               <div className="relative z-40 rounded-3xl border border-neutral-800 bg-neutral-950/90 px-4 py-5 sm:px-5">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                     <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-orange-500/15 blur-3xl" />
                     <div className="absolute -bottom-16 left-4 h-28 w-28 rounded-full bg-orange-500/10 blur-2xl" />
                  </div>

                  <div className="relative">
                     <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-300/90">
                        Tu ruta de tapas empieza aquí
                     </p>
                     <h2 id="home-hero-title" className="mt-2 text-2xl font-black leading-tight text-white">
                        Descubre locales y tapas cerca de ti
                     </h2>
                     <p className="mt-2 text-sm text-neutral-300">
                        Busca por nombre y salta directo a los sitios mejor valorados.
                     </p>

                     <div className="mt-4">
                        <SearchDropdown placeholder="Busca locales, tapas o zonas..." />
                     </div>

                     <QuickFilters onNavigate={navigate} />
                  </div>
               </div>
            </section>

            <NearbySection />
            <FeaturedSection />
            <TopCities />
            <HowItWorks />
            <HostCTA />
         </Container>
      </>
   );
};
