import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, EyeOff, Lock, Mail, User, UserRoundPlus } from "lucide-react";
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
  const navigate = useNavigate();
  const { register } = useAuth();
  const avatarScrollerRef = useRef(null);
  const avatarScrollTrackRef = useRef(null);
  const avatarScrollThumbRef = useRef(null);
  const avatarThumbDragRef = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarScrollUi, setAvatarScrollUi] = useState({
    canLeft: false,
    canRight: false,
    thumbLeft: 0,
    thumbWidth: 100,
  });
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

  const getAvatarScrollMetrics = useCallback(() => {
    const scroller = avatarScrollerRef.current;
    const track = avatarScrollTrackRef.current;
    if (!scroller || !track) return null;

    const maxScroll = Math.max(scroller.scrollWidth - scroller.clientWidth, 0);
    const trackWidth = track.clientWidth;
    const thumbWidthPx = maxScroll > 0
      ? Math.max((scroller.clientWidth / scroller.scrollWidth) * trackWidth, trackWidth * 0.16)
      : trackWidth;
    const maxThumbTravel = Math.max(trackWidth - thumbWidthPx, 0);

    return {
      maxScroll,
      trackWidth,
      thumbWidthPx,
      maxThumbTravel,
    };
  }, []);

  const updateAvatarScrollUi = useCallback(() => {
    const scroller = avatarScrollerRef.current;
    if (!scroller) return;

    const maxScroll = Math.max(scroller.scrollWidth - scroller.clientWidth, 0);
    const canLeft = scroller.scrollLeft > 2;
    const canRight = scroller.scrollLeft < maxScroll - 2;
    const thumbWidth = maxScroll > 0
      ? Math.max((scroller.clientWidth / scroller.scrollWidth) * 100, 16)
      : 100;
    const thumbLeft = maxScroll > 0
      ? (scroller.scrollLeft / maxScroll) * (100 - thumbWidth)
      : 0;

    setAvatarScrollUi({
      canLeft,
      canRight,
      thumbLeft,
      thumbWidth,
    });
  }, []);

  useEffect(() => {
    const scroller = avatarScrollerRef.current;
    if (!scroller) return undefined;

    updateAvatarScrollUi();

    const handleScroll = () => updateAvatarScrollUi();
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateAvatarScrollUi);

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateAvatarScrollUi);
    };
  }, [updateAvatarScrollUi]);

  useEffect(() => {
    const stopDrag = () => {
      if (!avatarThumbDragRef.current.active) return;
      avatarThumbDragRef.current.active = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    const handlePointerMove = (event) => {
      const drag = avatarThumbDragRef.current;
      if (!drag.active) return;

      const scroller = avatarScrollerRef.current;
      const metrics = getAvatarScrollMetrics();
      if (!scroller || !metrics || metrics.maxScroll <= 0 || metrics.maxThumbTravel <= 0) return;

      const deltaX = event.clientX - drag.startX;
      const nextScroll = drag.startScrollLeft + (deltaX * metrics.maxScroll) / metrics.maxThumbTravel;
      scroller.scrollLeft = Math.max(0, Math.min(nextScroll, metrics.maxScroll));
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
      stopDrag();
    };
  }, [getAvatarScrollMetrics]);

  const scrollAvatarStrip = (direction) => {
    const scroller = avatarScrollerRef.current;
    if (!scroller) return;

    const step = Math.max(scroller.clientWidth * 0.65, 130);
    scroller.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  };

  const handleTrackPointerDown = (event) => {
    if (event.button !== 0) return;
    if (event.target === avatarScrollThumbRef.current) return;

    const scroller = avatarScrollerRef.current;
    const track = avatarScrollTrackRef.current;
    const metrics = getAvatarScrollMetrics();
    if (!scroller || !track || !metrics || metrics.maxScroll <= 0 || metrics.maxThumbTravel <= 0) return;

    const rect = track.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const desiredThumbLeft = Math.max(0, Math.min(clickX - metrics.thumbWidthPx / 2, metrics.maxThumbTravel));
    const nextScroll = (desiredThumbLeft / metrics.maxThumbTravel) * metrics.maxScroll;

    scroller.scrollTo({
      left: nextScroll,
      behavior: "smooth",
    });
  };

  const handleThumbPointerDown = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();

    const scroller = avatarScrollerRef.current;
    const metrics = getAvatarScrollMetrics();
    if (!scroller || !metrics || metrics.maxScroll <= 0) return;

    avatarThumbDragRef.current.active = true;
    avatarThumbDragRef.current.startX = event.clientX;
    avatarThumbDragRef.current.startScrollLeft = scroller.scrollLeft;

    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

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
        avatar: form.avatar || undefined,
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
                className="auth-input w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
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
                className="auth-input w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
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
                className="auth-input w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
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
                className="auth-input w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
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
                className="auth-input w-full border-0 bg-transparent text-lg text-slate-200 outline-none placeholder:text-[#7181a3]"
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
            <div
              ref={avatarScrollerRef}
              className="avatar-scroll-strip flex gap-2.5 overflow-x-auto pb-1.5"
            >
              {avatarOptions.map((avatarPath) => (
                <button
                  type="button"
                  key={avatarPath}
                  className={`h-[68px] w-[68px] shrink-0 rounded-full border-2 bg-transparent p-1 mt-1 transition hover:-translate-y-0.5 ${selectedAvatar === avatarPath
                      ? "border-[#f77827] ring-2 ring-[#f77827]/20"
                      : "border-transparent"
                    }`}
                  onClick={(event) => {
                    setForm((prev) => ({
                      ...prev,
                      avatar: avatarPath,
                    }));
                    event.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "center",
                    });
                  }}
                  aria-label={`Seleccionar avatar ${avatarPath}`}
                >
                  <img src={avatarPath} alt="Avatar opcion" className="h-full w-full rounded-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-0.5">
              <button
                type="button"
                onClick={() => scrollAvatarStrip(-1)}
                disabled={!avatarScrollUi.canLeft}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#5c341e] bg-[#22110a]/85 text-[#d07a47] transition hover:border-[#ff7a2f] hover:text-[#ff9958] disabled:cursor-default disabled:opacity-35"
                aria-label="Desplazar avatares a la izquierda"
              >
                <ChevronLeft size={15} />
              </button>
              <div
                ref={avatarScrollTrackRef}
                onPointerDown={handleTrackPointerDown}
                className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#2f160d]/90 cursor-pointer"
              >
                <span
                  ref={avatarScrollThumbRef}
                  onPointerDown={handleThumbPointerDown}
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-[#ff9a52] to-[#ff6f2b] shadow-[0_0_14px_rgba(255,122,47,0.5)] transition-all duration-200 cursor-grab active:cursor-grabbing"
                  style={{
                    width: `${avatarScrollUi.thumbWidth}%`,
                    left: `${avatarScrollUi.thumbLeft}%`,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => scrollAvatarStrip(1)}
                disabled={!avatarScrollUi.canRight}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#5c341e] bg-[#22110a]/85 text-[#d07a47] transition hover:border-[#ff7a2f] hover:text-[#ff9958] disabled:cursor-default disabled:opacity-35"
                aria-label="Desplazar avatares a la derecha"
              >
                <ChevronRight size={15} />
              </button>
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
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-bold text-[#ff7a2f] no-underline">
            Inicia sesión
          </Link>
        </p>

        <p className="mb-0 mt-3 text-center text-lg text-slate-400">
          ¿Eres hostelero?{" "}
          <Link to="/host/register" className="font-bold text-[#ff7a2f] no-underline">
            Regístrate como hostelero
          </Link>
        </p>
      </div>
    </section>
  );
}
