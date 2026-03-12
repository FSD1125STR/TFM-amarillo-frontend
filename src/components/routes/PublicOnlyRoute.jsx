import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function PublicOnlyRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}