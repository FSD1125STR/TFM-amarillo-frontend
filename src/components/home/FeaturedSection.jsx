import Card from "../common/Card";

const items = [
   { name: "Patatas Bravas", price: "€6.50", img: "https://images.unsplash.com/photo-1604908177225-6f5a8f38c0f2" },
   { name: "Gambas al Ajillo", price: "€12.00", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" },
   { name: "Jamón Ibérico", price: "€18.00", img: "https://images.unsplash.com/photo-1625944525971-6f2b4e3b0b58" },
   { name: "Tortilla", price: "€4.50", img: "https://images.unsplash.com/photo-1625943913983-5b8d0b9f16e3" },
];

export default function FeaturedSection() {
   return (
      <section className="px-4 mt-6">
         <h2 className="text-lg font-semibold mb-3">Las Mejores Tapas</h2>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
               <Card key={item.name}>
                  <img src={item.img} className="h-32 w-full object-cover" />
                  <div className="p-2">
                     <p className="font-semibold">{item.name}</p>
                     <p className="text-orange-400">{item.price}</p>
                  </div>
               </Card>
            ))}
         </div>
      </section>
   );
}
