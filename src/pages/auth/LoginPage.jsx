import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDefaultRouteByRole } from "../../utils/authRedirect";
import { toastService } from "../../services/toastService";

const inputWrapStyle = {
  background: "linear-gradient(180deg, #181c28, #141924)",
};

const primaryButtonStyle = {
  background: "linear-gradient(180deg, #ff7a2f, #f76622)",
  boxShadow: "0 12px 24px rgba(247, 102, 34, 0.34)",
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      const message = "Completa correo electrónico y contraseña";
      setError(message);
      toastService.error(message);
      return;
    }

    try {
      setSubmitting(true);
      const response = await login({
        email: form.email,
        password: form.password,
      });

      const role = response?.data?.role;
      toastService.success("Sesión iniciada correctamente");
      navigate(getDefaultRouteByRole(role), { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "No se pudo iniciar sesión";
      setError(message);
      toastService.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen px-4 pb-9 pt-7 text-slate-100">
      <div className="mx-auto w-full max-w-[490px]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3.5 grid place-items-center">
            <img
              src="/Logo.png"
              alt="Logo nexTapa"
              className="h-[86px] w-[86px] object-contain drop-shadow-[0_12px_24px_rgba(247,105,34,0.35)]"
            />
          </div>
          <h1 className="m-0 text-4xl font-bold tracking-tight sm:text-5xl">
            nex<span className="text-orange-500">Tapa</span>
          </h1>
          <p className="mt-1.5 text-base text-orange-400 sm:text-lg">
            Tus tapas favoritas a un click
          </p>
        </div>

        <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Bienvenido de nuevo</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-base font-semibold text-slate-300">Correo electrónico</span>
            <span
              className="flex min-h-[60px] items-center gap-2.5 rounded-2xl border border-[#2f3f66] px-3.5 transition focus-within:border-[#f77827] focus-within:ring-2 focus-within:ring-[#f77827]/25"
              style={inputWrapStyle}
            >
              <Mail size={22} className="shrink-0 text-[#7787ab]" />
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="auth-input w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
              />
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-base font-semibold text-slate-300">Contraseña</span>
              <a href="#" className="text-sm font-semibold text-[#f77827] no-underline">
                ¿Olvidaste tu contraseña?
              </a>
            </span>
            <span
              className="flex min-h-[60px] items-center gap-2.5 rounded-2xl border border-[#2f3f66] px-3.5 transition focus-within:border-[#f77827] focus-within:ring-2 focus-within:ring-[#f77827]/25"
              style={inputWrapStyle}
            >
              <Lock size={22} className="shrink-0 text-[#7787ab]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="auth-input w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
              />
              <button
                type="button"
                className="grid cursor-pointer place-items-center bg-transparent p-0 text-[#7a8cae]"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </span>
          </label>

          {error && <p className="m-0 text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl border-0 text-2xl font-bold tracking-tight text-white transition active:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-75 sm:text-3xl"
            style={primaryButtonStyle}
          >
            {submitting ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mb-0 mt-5 text-center text-lg text-slate-400">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-bold text-[#ff7a2f] no-underline">
            Regístrate
          </Link>
        </p>

        <div className="my-5 flex items-center gap-3 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <span>o continúa con</span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#263859] bg-[#131824]/65 text-lg font-semibold text-slate-200 opacity-80"
            disabled
          >
            <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-white text-xs font-bold text-slate-900">
              G
            </span>
            Google
          </button>
          <button
            type="button"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#263859] bg-[#131824]/65 text-lg font-semibold text-slate-200 opacity-80"
            disabled
          >
            <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
              f
            </span>
            Facebook
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <a href="#" className="text-xs text-slate-400 no-underline">
            Privacidad
          </a>
          <a href="#" className="text-xs text-slate-400 no-underline">
            Términos
          </a>
          <a href="#" className="text-xs text-slate-400 no-underline">
            Soporte
          </a>
        </div>
      </div>
    </section>
  );
}
