import { Utensils, Sparkles } from "lucide-react";

export const ServiceKitchen = ({ features = [], cuisineType = [] }) => {
  if (features.length === 0 && cuisineType.length === 0) return null;

  return (
    <div className="mt-8 p-6 shadow-sm">

      {/* TITULO */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Servicios & Cocina
        </h2>
        <div className="w-12 h-1 bg-orange-500 rounded-full mt-2" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* SERVICIOS */}
        {features.length > 0 && (
          <div className="bg-neutral-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wide">
                Servicios
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="text-xs font-medium bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full border border-neutral-200"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* COCINA */}
        {cuisineType.length > 0 && (
          <div className="bg-neutral-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
            
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wide">
                Cocina
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {cuisineType.map((c, i) => (
                <span
                  key={i}
                  className="text-xs font-medium bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full border border-neutral-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};