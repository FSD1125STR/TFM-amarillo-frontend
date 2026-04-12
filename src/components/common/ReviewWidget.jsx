import { useState, useEffect, useCallback } from "react";
import { Star, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { reviewService } from "../../services/reviewService";

// ── StarRow — fila de 5 estrellas interactiva o estática ────────────────────
const StarRow = ({ value, onChange, readonly = false, size = 20 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= (hovered || value);
        return (
          <button
            key={n}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(n)}
            onMouseEnter={() => !readonly && setHovered(n)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-all duration-150 ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
            aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={`transition-colors duration-150 ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-zinc-600"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

// ── AvgStars — media visual compacta ────────────────────────────────────────
const AvgStars = ({ avg, count }) => {
  if (!avg) {
    return (
      <span className="text-xs text-zinc-500 italic">Sin valoraciones aún</span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const fill = Math.min(Math.max(avg - (n - 1), 0), 1);
          return (
            <span key={n} className="relative inline-block">
              <Star size={16} className="fill-zinc-700 text-zinc-700" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star size={16} className="fill-amber-400 text-amber-400" />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-amber-400 font-semibold text-sm">
        {avg.toFixed(1)}
      </span>
      <span className="text-zinc-500 text-xs">
        ({count} {count === 1 ? "valoración" : "valoraciones"})
      </span>
    </div>
  );
};

// ── ReviewWidget ─────────────────────────────────────────────────────────────
export const ReviewWidget = ({ targetType, targetId }) => {
  const { user } = useAuth();
  const isClient = user?.role === "cliente";

  const [avg, setAvg] = useState(null);
  const [count, setCount] = useState(0);
  const [myReview, setMyReview] = useState(null);
  const [selected, setSelected] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Cargar reviews del target ──────────────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    try {
      const data = await reviewService.getByTarget(targetType, targetId);

      setAvg(data.avg);
      setCount(data.count);

      if (user && data.reviews) {
        const userId = user._id || user.id;
        const mine = data.reviews.find(
          (r) => (r.user?._id ?? r.user) === userId,
        );
        if (mine) {
          setMyReview(mine);
          setSelected(mine.rating);
        } else {
          setMyReview(null);
          setSelected(0);
        }
      }
    } catch (err) {
      console.error("[ReviewWidget] fetchReviews:", err);
    }
  }, [targetType, targetId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ── Crear ──────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!selected) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      await reviewService.create(
        targetType === "establishment"
          ? { establishmentId: targetId, rating: selected }
          : { itemId: targetId, rating: selected },
      );
      await fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la valoración");
    } finally {
      setLoading(false);
    }
  };

  // ── Editar ─────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!selected || !myReview) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      await reviewService.update(myReview._id, selected);
      setEditing(false);
      await fetchReviews();
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al actualizar la valoración",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Borrar ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!myReview) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      await reviewService.delete(myReview._id);
      setMyReview(null);
      setSelected(0);
      setEditing(false);
      await fetchReviews();
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al eliminar la valoración",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      {/* Media */}
      <AvgStars avg={avg} count={count} />

      {/* Separador */}
      <div className="h-px bg-zinc-800" />

      {/* Sin sesión o no es cliente */}
      {(!user || !isClient) && (
        <div className="flex items-center gap-2 text-zinc-500 text-xs">
          <LogIn size={14} />
          <span>Inicia sesión como cliente para valorar</span>
        </div>
      )}

      {/* Cliente — aún no ha valorado */}
      {isClient && !myReview && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-zinc-400">Tu valoración</span>
          <div className="flex items-center gap-3">
            <StarRow value={selected} onChange={setSelected} size={22} />
            <button
              onClick={handleCreate}
              disabled={!selected || loading}
              className="text-xs px-3 py-1.5 rounded-full bg-amber-500 text-black font-semibold
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-amber-400 transition-colors"
            >
              {loading ? "Guardando…" : "Valorar"}
            </button>
          </div>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      )}

      {/* Cliente — ya valoró, modo visualización */}
      {isClient && myReview && !editing && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-400">Tu valoración</span>
          <div className="flex items-center gap-3">
            <StarRow value={myReview.rating} readonly size={20} />
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-zinc-400 hover:text-amber-400 transition-colors underline underline-offset-2"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-xs text-zinc-500 hover:text-red-400 transition-colors underline underline-offset-2 disabled:opacity-40"
            >
              {loading ? "…" : "Borrar"}
            </button>
          </div>
        </div>
      )}

      {/* Cliente — modo edición */}
      {isClient && myReview && editing && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-zinc-400">Editar valoración</span>
          <div className="flex items-center gap-3">
            <StarRow value={selected} onChange={setSelected} size={22} />
            <button
              onClick={handleUpdate}
              disabled={!selected || loading}
              className="text-xs px-3 py-1.5 rounded-full bg-amber-500 text-black font-semibold
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-amber-400 transition-colors"
            >
              {loading ? "Guardando…" : "Guardar"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setSelected(myReview.rating);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      )}
    </div>
  );
};

export default ReviewWidget;
