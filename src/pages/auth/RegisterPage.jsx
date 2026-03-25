import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User, UserRoundPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDefaultRouteByRole } from "../../utils/authRedirect";
import { ImageDropInput } from "../../components/common/ImageDropInput";
import { toastService } from "../../services/toastService";

const avatarOptions = [
  "/avatars/avatar-1.svg",
  "/avatars/avatar-2.svg",
  "/avatars/avatar-3.svg",
  "/avatars/avatar-4.svg",
  "/avatars/avatar-5.svg",
  "/avatars/avatar-6.svg",
];

const inputWrapStyle = {
  background: "linear-gradient(180deg, #181c28, #141924)",
};

const primaryButtonStyle = {
  background: "linear-gradient(180deg, #ff7a2f, #f76622)",
  boxShadow: "0 12px 24px rgba(247, 102, 34, 0.34)",
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: avatarOptions[0],
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedAvatar = useMemo(() => form.avatar, [form.avatar]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return "Completa los campos obligatorios";
    }

    if (form.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }

    if (form.password !== form.confirmPassword) {
      return "Las contraseñas no coinciden";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toastService.error(validationError);
      return;
    }

    try {
      setSubmitting(true);
      const response = await register({
        role: "cliente",
        name: form.name,
        username: form.username || undefined,
        email: form.email,
        password: form.password,
        passwordConfirm: form.confirmPassword,
        avatar: form.avatar,
      });

      const role = response?.data?.role;
      toastService.success("Registro completado correctamente");
      navigate(getDefaultRouteByRole(role), { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "No se pudo completar el registro";
      setError(message);
      toastService.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen px-4 pb-9 pt-7 text-slate-100">
      <div className="mx-auto w-full max-w-[430px]">
        <Link to="/login" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-300 no-underline">
          <ArrowLeft size={18} />
          Volver
        </Link>

        <h1 className="m-0 text-4xl font-bold tracking-tight sm:text-5xl">Crea tu cuenta</h1>
        <p className="mb-6 mt-2 text-lg text-slate-400">Unete a la comunidad foodie de nexTapa</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-base font-semibold text-slate-300">Nombre completo</span>
            <span
              className="flex min-h-[60px] items-center gap-2.5 rounded-2xl border border-[#2f3f66] px-3.5 transition focus-within:border-[#f77827] focus-within:ring-2 focus-within:ring-[#f77827]/25"
              style={inputWrapStyle}
            >
              <User size={20} className="shrink-0 text-[#7787ab]" />
              <input
                type="text"
                name="name"
                placeholder="Ej. Cristian Fernandez"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                className="w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
              />
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-base font-semibold text-slate-300">Nombre de usuario (opcional)</span>
            <span
              className="flex min-h-[60px] items-center gap-2.5 rounded-2xl border border-[#2f3f66] px-3.5 transition focus-within:border-[#f77827] focus-within:ring-2 focus-within:ring-[#f77827]/25"
              style={inputWrapStyle}
            >
              <User size={20} className="shrink-0 text-[#7787ab]" />
              <input
                type="text"
                name="username"
                placeholder="@usuario"
                value={form.username}
                onChange={handleChange}
                autoComplete="nickname"
                className="w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
              />
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-base font-semibold text-slate-300">Correo electrónico</span>
            <span
              className="flex min-h-[60px] items-center gap-2.5 rounded-2xl border border-[#2f3f66] px-3.5 transition focus-within:border-[#f77827] focus-within:ring-2 focus-within:ring-[#f77827]/25"
              style={inputWrapStyle}
            >
              <Mail size={20} className="shrink-0 text-[#7787ab]" />
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
              />
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-base font-semibold text-slate-300">Contraseña</span>
            <span
              className="flex min-h-[60px] items-center gap-2.5 rounded-2xl border border-[#2f3f66] px-3.5 transition focus-within:border-[#f77827] focus-within:ring-2 focus-within:ring-[#f77827]/25"
              style={inputWrapStyle}
            >
              <Lock size={20} className="shrink-0 text-[#7787ab]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
              />
              <button
                type="button"
                className="grid cursor-pointer place-items-center bg-transparent p-0 text-[#7a8cae]"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-base font-semibold text-slate-300">Confirmar contraseña</span>
            <span
              className="flex min-h-[60px] items-center gap-2.5 rounded-2xl border border-[#2f3f66] px-3.5 transition focus-within:border-[#f77827] focus-within:ring-2 focus-within:ring-[#f77827]/25"
              style={inputWrapStyle}
            >
              <Lock size={20} className="shrink-0 text-[#7787ab]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="********"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
              />
              <button
                type="button"
                className="grid cursor-pointer place-items-center bg-transparent p-0 text-[#7a8cae]"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </span>
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-base font-semibold text-slate-300">Selecciona tu avatar</span>
            <ImageDropInput
              label=""
              value={form.avatar}
              onChange={(nextValue) =>
                setForm((prev) => ({
                  ...prev,
                  avatar: nextValue,
                }))
              }
              uploadFolder="nextapa/avatars"
              helperText="Puedes subir una foto propia o elegir uno de los avatares."
            />
            <div className="flex gap-2.5 overflow-x-auto pb-1.5">
              {avatarOptions.map((avatarPath) => (
                <button
                  type="button"
                  key={avatarPath}
                  className={`h-[68px] w-[68px] shrink-0 rounded-full border-2 bg-transparent p-1 mt-1 transition hover:-translate-y-0.5 ${
                    selectedAvatar === avatarPath
                      ? "border-[#f77827] ring-2 ring-[#f77827]/20"
                      : "border-transparent"
                  }`}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      avatar: avatarPath,
                    }))
                  }
                  aria-label={`Seleccionar avatar ${avatarPath}`}
                >
                  <img src={avatarPath} alt="Avatar opcion" className="h-full w-full rounded-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="m-0 text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl border-0 text-2xl font-bold tracking-tight text-white transition active:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-75 sm:text-3xl"
            style={primaryButtonStyle}
          >
            {submitting ? "Creando cuenta..." : "Crear cuenta"}
            {!submitting && <UserRoundPlus size={22} />}
          </button>
        </form>

        <p className="mb-0 mt-5 text-center text-lg text-slate-400">
          Ya tienes cuenta?{" "}
          <Link to="/login" className="font-bold text-[#ff7a2f] no-underline">
            Inicia sesión
          </Link>
        </p>

        <p className="mb-0 mt-3 text-center text-lg text-slate-400">
          Eres hostelero?{" "}
          <Link to="/host/register" className="font-bold text-[#ff7a2f] no-underline">
            Regístrate como hostelero
          </Link>
        </p>
      </div>
    </section>
  );
}
