import { useEffect, useState } from "react";
import { AtSign, Camera, Mail, Phone, Save, UserRound } from "lucide-react";
import Header from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";

const shellStyle = {
  background:
    "radial-gradient(900px 500px at 85% -10%, rgba(249, 115, 22, 0.12), transparent 60%), linear-gradient(180deg, #0f0f10 0%, #0a0a0b 100%)",
};

const inputClassName =
  "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25";

const normalizeUsername = (value) =>
  value.trim().replace(/^@+/, "").replace(/\s+/g, "").toLowerCase();

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    avatar: "",
  });
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      name: user?.name || "",
      username: user?.username ? `@${user.username}` : "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  useEffect(() => {
    setAvatarBroken(false);
  }, [form.avatar]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    const userId = user?.id || user?._id;
    if (!userId) {
      setError("No se pudo identificar el usuario actual.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      username: normalizeUsername(form.username) || null,
      phone: form.phone.trim() || null,
      avatar: form.avatar.trim() || null,
    };

    if (!payload.name) {
      setError("El nombre es obligatorio.");
      return;
    }

    try {
      setSubmitting(true);
      await userService.updateUser(userId, payload);
      await refreshUser();
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      const validationErrors = err?.response?.data?.errors;
      setError(
        Array.isArray(validationErrors) && validationErrors.length > 0
          ? validationErrors[0]
          : err?.response?.data?.message || "No se pudo actualizar el perfil."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white" style={shellStyle}>
      <Header />

      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-5">
        <section className="mb-4 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 sm:p-6">
          <h1 className="m-0 text-2xl font-bold tracking-tight sm:text-3xl">
            Mi perfil
          </h1>
          <p className="mb-0 mt-1 text-sm text-neutral-400">
            Completa tus datos para personalizar tu cuenta.
          </p>
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-orange-500/50 bg-neutral-900">
              {form.avatar && !avatarBroken ? (
                <img
                  src={form.avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                  onError={() => setAvatarBroken(true)}
                />
              ) : (
                <UserRound className="h-9 w-9 text-orange-500" />
              )}
            </div>

            <div>
              <p className="m-0 text-lg font-semibold">{user?.name || "Cliente"}</p>
              <p className="m-0 text-sm text-neutral-400">
                {user?.email || "Sin email"}
              </p>
              <p className="m-0 text-xs uppercase tracking-wide text-neutral-500">
                Rol: {user?.role || "cliente"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-200">Nombre</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className={inputClassName}
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-200">
                Nombre de usuario
              </span>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="@usuario"
                  className={`${inputClassName} pl-10`}
                />
              </div>
              <small className="text-xs text-neutral-500">
                Puedes dejarlo vacio si no quieres mostrar username.
              </small>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-200">Telefono</span>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                  className={`${inputClassName} pl-10`}
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-200">Avatar (URL)</span>
              <div className="relative">
                <Camera className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="url"
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={`${inputClassName} pl-10`}
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-200">
                Correo electronico
              </span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className={`${inputClassName} cursor-not-allowed pl-10 opacity-70`}
                />
              </div>
            </label>

            {error && (
              <p className="m-0 rounded-xl border border-rose-400/40 bg-rose-900/20 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            )}

            {success && (
              <p className="m-0 rounded-xl border border-emerald-400/40 bg-emerald-900/20 px-3 py-2 text-sm text-emerald-200">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-0 bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {submitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
