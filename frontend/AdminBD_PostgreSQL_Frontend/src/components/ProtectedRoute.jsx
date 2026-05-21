import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — Redirige si le rôle de l'utilisateur n'est pas autorisé.
 * @param {string[]} allowedRoles - Ex: ["admin"] ou ["user"]
 * @param {object}   user         - L'utilisateur connecté
 * @param {ReactNode} children
 */
export default function ProtectedRoute({ allowedRoles, user, children }) {
  if (!user) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(user.role)) {
    // Redirection intelligente selon le rôle réel
    const home = user.role === "admin" ? "/" : "/clients";
    return <Navigate to={home} replace />;
  }

  return children;
}
