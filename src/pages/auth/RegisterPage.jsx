import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserRoundPlus,
} from "lucide-react";
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
  "/avatars/avatar-f.jpg",
  "/avatars/avatar-g.jpg",
  "/avatars/avatar-h.jpg",
  "/avatars/avatar-i.jpg",
  "/avatars/avatar-j.jpg",
];

const inputWrapStyle = {
  background: "linear-gradient(180deg, #181c28, #141924)",
};

const primaryButtonStyle = {
  background: "linear-gradient(180deg, #ff7a2f, #f76622)",
  boxShadow: "0 12px 24px rgba(247, 102, 34, 0.34)",
};

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedAvatar = useMemo(() => form.avatar, [form.avatar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        avatar: form.avatar || undefined,
      });

      const role = response?.data?.role;

      toastService.success("Registro completado correctamente");
      navigate(getDefaultRouteByRole(role), { replace: true });

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "No se pudo completar el registro";

      setError(message);
      toastService.error(message);

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen px-4 pb-9 pt-7 text-slate-100">
      <div className="mx-auto w-full max-w-107.5">

        <Link to="/login" className="mb-4 flex items-center gap-2 text-slate-300">
          <ArrowLeft size={18} /> Volver
        </Link>

        <h1 className="text-4xl font-bold">Crea tu cuenta</h1>
        <p className="mb-6 text-slate-400">
          Únete a la comunidad foodie de nexTapa
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Nombre */}
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            className="auth-input"
          />

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="@usuario (opcional)"
            value={form.username}
            onChange={handleChange}
            className="auth-input"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
          />

          {/* Password */}
          <div className="flex gap-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="auth-input w-full"
            />
            <button type="button" onClick={() => setShowPassword((p) => !p)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Confirm */}
          <div className="flex gap-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              className="auth-input w-full"
            />
            <button type="button" onClick={() => setShowConfirmPassword((p) => !p)}>
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Avatar */}
          <ImageDropInput
            label="Avatar (opcional)"
            value={form.avatar}
            onChange={(val) => setForm((p) => ({ ...p, avatar: val }))}
          />

          <div className="flex gap-2 overflow-x-auto">
            {avatarOptions.map((avatar) => (
              <img
                key={avatar}
                src={avatar}
                onClick={() => setForm((p) => ({ ...p, avatar }))}
                className={`w-14 h-14 rounded-full cursor-pointer ${
                  selectedAvatar === avatar ? "ring-2 ring-orange-500" : ""
                }`}
              />
            ))}
          </div>

          {error && <p className="text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            style={primaryButtonStyle}
            className="rounded-2xl py-4 font-bold"
          >
            {submitting ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-5 text-center text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-orange-500 font-bold">
            Inicia sesión
          </Link>
        </p>

        <p className="mt-3 text-center text-slate-400">
          ¿Eres hostelero?{" "}
          <Link to="/host/register" className="text-orange-500 font-bold">
            Regístrate como hostelero
          </Link>
        </p>
      </div>
    </section>
  );
}