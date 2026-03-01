import Card from "../common/Card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { itemService } from "../../services/itemService";
import Container from "../layout/Container";

export const FeaturedSection = () => {
   const [featuredItems, setFeaturedItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const navigate = useNavigate();

   useEffect(() => {
      loadAllItems();
   }, []);

   const loadAllItems = async () => {
      try {
         setLoading(true);
         setError(null);
         const response = await itemService.getTopRatedItems();
         setFeaturedItems(response.data || response);
      } catch (err) {
         setError("Error al cargar las tapas destacadas.", err);
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return (
         <Container>
            <div className="flex items-center justify-center h-40">
               <p className="text-lg">Cargando tapas...</p>
            </div>
         </Container>
      );
   }

   if (error) {
      return (
         <Container>
            <p className="text-red-500 p-4 text-center">{error}</p>
         </Container>
      );
   }

   const displayedItems = featuredItems.slice(0, 8);

   return (
      <section className="px-4 mt-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Las Mejores Tapas</h2>
            <button
               onClick={() => navigate("/items")}
               className="text-orange-400 cursor-pointer hover:text-orange-500 transition-colors"
            >
               Ver todas
            </button>
         </div>

         {displayedItems.length === 0 ? (
            <p>No hay tapas disponibles en este momento.</p>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {displayedItems.map((item, index) => (
                  <Card
                     key={item.id || index}
                     onClick={() => navigate(`/items/${item.slug}`)}
                     className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                     <img
                        src={item.mainImage || "/Logo.jpg"}
                        alt={item.name}
                        className="h-32 w-full object-cover"
                     />
                     <div className="p-2">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-orange-400">
                           {item.modalities[0]?.price > 0
                              ? `${item.modalities[0].price}€`
                              : "Gratis"}
                        </p>
                     </div>
                  </Card>
               ))}
            </div>
         )}
      </section>
   );
};