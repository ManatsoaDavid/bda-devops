import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Versements from "./pages/Versements";
import Audit from "./pages/Audit";

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  // Page d'accueil selon le rôle
  const homeRoute = user.role === "admin" ? "/" : "/clients";

  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          {/* ── Routes ADMIN ─────────────────────────────── */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin"]} user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute allowedRoles={["admin"]} user={user}>
                <Audit />
              </ProtectedRoute>
            }
          />

          {/* ── Routes USER ──────────────────────────────── */}
          <Route
            path="/clients"
            element={
              <ProtectedRoute allowedRoles={["user"]} user={user}>
                <Clients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/versements"
            element={
              <ProtectedRoute allowedRoles={["user"]} user={user}>
                <Versements />
              </ProtectedRoute>
            }
          />

          {/* ── Fallback ─────────────────────────────────── */}
          <Route path="*" element={<Navigate to={homeRoute} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
