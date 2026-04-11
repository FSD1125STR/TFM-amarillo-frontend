import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
   ArrowLeft,
   Target,
   Eye,
   Heart,
   Mail,
   Share2,
} from "lucide-react";
import { toastService } from "../services/toastService";

const HERO_IMAGE = "/public/heroNosotros.avif";

const CARD_BASE =
   "rounded-2xl border border-white/[0.06] bg-[#2A1E16] p-5 sm:p-6 shadow-lg shadow-black/20";

function SocialIconInstagram({ className }) {
   return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
         <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
   );
}

function SocialIconFacebook({ className }) {
   return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
   );
}

function SocialIconX({ className }) {
   return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
         <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
   );
}

const initialErrors = {
   name: "",
   email: "",
   message: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function AboutPage() {
   const navigate = useNavigate();
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
   const [errors, setErrors] = useState(initialErrors);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const validateForm = () => {
      const nextErrors = { ...initialErrors };
      const cleanName = name.trim();
      const cleanEmail = email.trim();
      const cleanMessage = message.trim();

      if (!cleanName) {
         nextErrors.name = "Introduce tu nombre.";
      } else if (cleanName.length < 2) {
         nextErrors.name = "El nombre debe tener al menos 2 caracteres.";
      } else if (cleanName.length > 60) {
         nextErrors.name = "El nombre no puede superar los 60 caracteres.";
      }

      if (!cleanEmail) {
         nextErrors.email = "Introduce tu correo electrónico.";
      } else if (!emailRegex.test(cleanEmail)) {
         nextErrors.email = "Introduce un correo electrónico válido.";
      } else if (cleanEmail.length > 100) {
         nextErrors.email = "El correo no puede superar los 100 caracteres.";
      }

      if (!cleanMessage) {
         nextErrors.message = "Escribe tu mensaje.";
      } else if (cleanMessage.length < 10) {
         nextErrors.message = "El mensaje debe tener al menos 10 caracteres.";
      } else if (cleanMessage.length > 1000) {
         nextErrors.message = "El mensaje no puede superar los 1000 caracteres.";
      }

      setErrors(nextErrors);

      return !nextErrors.name && !nextErrors.email && !nextErrors.message;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      const isValid = validateForm();

      if (!isValid) {
         toastService.error("Revisa los campos del formulario.");
         return;
      }

      try {
         setIsSubmitting(true);

         const payload = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
         };

         console.log("Formulario enviado:", payload);

         toastService.success("¡Gracias! Hemos recibido tu mensaje.");

         setName("");
         setEmail("");
         setMessage("");
         setErrors(initialErrors);
      } catch {
         toastService.error("No se pudo enviar el mensaje. Inténtalo de nuevo.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="min-h-screen pb-24">
         <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#1A120B]/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:py-4">
               <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-orange-500 transition-colors hover:bg-white/5 hover:text-orange-400"
                  aria-label="Volver"
               >
                  <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
               </button>

               <h1 className="flex-1 text-center text-base font-bold tracking-tight text-white sm:text-lg">
                  Sobre nexTapa
               </h1>

               <span className="w-10 shrink-0" aria-hidden />
            </div>
         </header>

         <div className="mx-auto max-w-3xl px-4 pt-2 sm:px-5">
            <section className="relative mt-3 overflow-hidden rounded-2xl sm:rounded-3xl">
               <div
                  className="min-h-[220px] bg-cover bg-center sm:min-h-[280px] md:min-h-[320px]"
                  style={{ backgroundImage: `url(${HERO_IMAGE})` }}
               >
                  <div className="flex min-h-[220px] flex-col justify-end bg-gradient-to-t from-[#1A120B] via-[#1A120B]/75 to-transparent px-5 pb-8 pt-20 sm:min-h-[280px] sm:px-8 sm:pb-10 md:min-h-[320px]">
                     <span className="mb-3 inline-flex w-fit rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white sm:text-xs">
                        Nuestra historia
                     </span>

                     <p className="text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">
                        Descubriendo la esencia de cada bocado.
                     </p>
                  </div>
               </div>
            </section>

            <section className="mt-10 sm:mt-12">
               <h2 className="text-xl font-bold text-white sm:text-2xl">Redefiniendo el descubrimiento</h2>
               <p className="mt-4 text-[15px] leading-relaxed text-neutral-400 sm:text-base">
                  nexTapa nació de una idea sencilla: las mejores experiencias culinarias no están en las
                  grandes cadenas, sino en los platos pequeños y vibrantes que se sirven en rincones
                  auténticos del mundo. Conectamos a quienes aman comer con bares de tapas locales que
                  combinan tradición e innovación.
               </p>
            </section>

            <section className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
               <article className={CARD_BASE}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                     <Target className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Misión</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400 sm:text-[15px]">
                     Conectar a las personas a través del arte de los platos pequeños.
                  </p>
               </article>

               <article className={CARD_BASE}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                     <Eye className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Visión</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400 sm:text-[15px]">
                     Ser el latido global del descubrimiento culinario.
                  </p>
               </article>

               <article className={`${CARD_BASE} sm:col-span-2 lg:col-span-1`}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                     <Heart className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Valores</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400 sm:text-[15px]">
                     Calidad, comunidad y exploración en cada plato.
                  </p>
               </article>
            </section>

            <section className="mt-12 sm:mt-14">
               <h2 className="text-xl font-bold text-white sm:text-2xl">Ponte en contacto</h2>

               <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                  <div>
                     <label htmlFor="about-name" className="sr-only">
                        Nombre completo
                     </label>
                     <input
                        id="about-name"
                        name="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => {
                           setName(e.target.value);
                           if (errors.name) {
                              setErrors((prev) => ({ ...prev, name: "" }));
                           }
                        }}
                        placeholder="Nombre completo"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "about-name-error" : undefined}
                        maxLength={60}
                        className={`auth-input w-full rounded-xl border bg-[#14100c] px-4 py-3.5 text-[15px] text-white placeholder:text-neutral-500 focus:border-orange-500/50 ${
                           errors.name ? "border-red-500/70" : "border-white/[0.08]"
                        }`}
                     />
                     {errors.name && (
                        <p id="about-name-error" className="mt-2 text-sm text-red-400">
                           {errors.name}
                        </p>
                     )}
                  </div>

                  <div>
                     <label htmlFor="about-email" className="sr-only">
                        Correo electrónico
                     </label>
                     <input
                        id="about-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                           setEmail(e.target.value);
                           if (errors.email) {
                              setErrors((prev) => ({ ...prev, email: "" }));
                           }
                        }}
                        placeholder="Correo electrónico"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "about-email-error" : undefined}
                        maxLength={100}
                        className={`auth-input w-full rounded-xl border bg-[#14100c] px-4 py-3.5 text-[15px] text-white placeholder:text-neutral-500 focus:border-orange-500/50 ${
                           errors.email ? "border-red-500/70" : "border-white/[0.08]"
                        }`}
                     />
                     {errors.email && (
                        <p id="about-email-error" className="mt-2 text-sm text-red-400">
                           {errors.email}
                        </p>
                     )}
                  </div>

                  <div>
                     <label htmlFor="about-message" className="sr-only">
                        Mensaje
                     </label>
                     <textarea
                        id="about-message"
                        name="message"
                        rows={5}
                        value={message}
                        onChange={(e) => {
                           setMessage(e.target.value);
                           if (errors.message) {
                              setErrors((prev) => ({ ...prev, message: "" }));
                           }
                        }}
                        placeholder="¿Cómo podemos ayudarte?"
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "about-message-error" : undefined}
                        maxLength={1000}
                        className={`auth-input min-h-[120px] w-full resize-y rounded-xl border bg-[#14100c] px-4 py-3.5 text-[15px] text-white placeholder:text-neutral-500 focus:border-orange-500/50 ${
                           errors.message ? "border-red-500/70" : "border-white/[0.08]"
                        }`}
                     />
                     {errors.message && (
                        <p id="about-message-error" className="mt-2 text-sm text-red-400">
                           {errors.message}
                        </p>
                     )}
                  </div>

                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full rounded-xl bg-orange-500 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
                  >
                     {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                  </button>
               </form>
            </section>

            <footer className="mt-12 border-t border-white/[0.06] pb-6 pt-10 sm:mt-14">
               <a
                  href="mailto:hello@nextapa.com"
                  className="flex flex-wrap items-center justify-center gap-2 text-center text-sm text-neutral-400 no-underline transition-colors hover:text-orange-400 sm:justify-start"
               >
                  <Mail className="h-5 w-5 shrink-0 text-orange-500" aria-hidden />
                  <span>
                     Escríbenos a <strong className="font-semibold text-white">hello@nextapa.com</strong>
                  </span>
               </a>

               <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-neutral-500">
                     <Share2 className="h-5 w-5 text-orange-500" aria-hidden />
                     <span className="text-xs uppercase tracking-wider sm:text-sm">Síguenos</span>
                  </div>

                  <div className="flex items-center gap-4">
                     <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 transition-colors hover:text-orange-400"
                        aria-label="Instagram"
                     >
                        <SocialIconInstagram className="h-6 w-6" />
                     </a>

                     <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 transition-colors hover:text-orange-400"
                        aria-label="X (Twitter)"
                     >
                        <SocialIconX className="h-5 w-5" />
                     </a>

                     <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 transition-colors hover:text-orange-400"
                        aria-label="Facebook"
                     >
                        <SocialIconFacebook className="h-6 w-6" />
                     </a>
                  </div>
               </div>

               <p className="mt-8 text-center text-xs text-neutral-600 sm:text-left">
                  © {new Date().getFullYear()} nexTapa. Todos los derechos reservados.
               </p>
            </footer>
         </div>
      </div>
   );
}
