import { Phone, Mail, Globe } from "lucide-react";

export const Contact = ({ phone, email, website }) => {
  return (
    <div className="p-4 text-center">

      {/* Título */}
      <h3 className="text-white text-lg font-semibold mb-6">
        Contacto
      </h3>

      <div className="space-y-4 flex flex-col items-center">

        {/* Teléfono */}
        {phone && (
          <button
            onClick={() => (window.location.href = `tel:${phone}`)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Phone className="w-4 h-4 text-orange-500" />
            <span className="text-white text-sm font-medium">{phone}</span>
          </button>
        )}

        {/* Email */}
        {email && (
          <button
            onClick={() => (window.location.href = `mailto:${email}`)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="text-white text-sm font-medium">{email}</span>
          </button>
        )}

        {/* Website */}
        {website && (
          <button
            onClick={() => window.open(website, "_blank")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Globe className="w-4 h-4 text-green-500" />
            <span className="text-white text-sm font-medium truncate max-w-50">
              {website}
            </span>
          </button>
        )}

        {!phone && !email && !website && (
          <span className="text-neutral-600 text-sm">—</span>
        )}

      </div>
    </div>
  );
};