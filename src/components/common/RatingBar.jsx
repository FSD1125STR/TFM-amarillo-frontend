import { Star } from "lucide-react";

export default function RatingBar({
   average = 0,
   totalReviews = 0
}) {
   const maxStars = 5;

   return (
      <div className="w-full max-w-md mx-auto text-center py-6">

         {/* Puntuación principal */}
         <p className="text-4xl font-bold text-white tracking-tight">
            {average?.toFixed(1)}
         </p>

         {/* Estrellas */}
         <div className="flex justify-center gap-1 mt-2">
            {[...Array(maxStars)].map((_, i) => {
               const starNumber = i + 1;

               return (
                  <Star
                     key={i}
                     className={`w-5 h-5 transition-colors ${
                        average >= starNumber
                           ? "text-yellow-400 fill-yellow-400"
                           : "text-neutral-600"
                     }`}
                  />
               );
            })}
         </div>

         {/* Total reviews */}
         <p className="text-xs text-neutral-400 mt-2 tracking-wide">
            {totalReviews} opiniones
         </p>

      </div>
   );
}