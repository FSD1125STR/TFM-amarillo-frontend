import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDefaultRouteByRole } from "../../utils/authRedirect";

export function ClientRoute({ children }) {
  const location = useLocation();
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "cliente") {
    return <Navigate to={getDefaultRouteByRole(user?.role)} replace />;
  }

  return children;
}
