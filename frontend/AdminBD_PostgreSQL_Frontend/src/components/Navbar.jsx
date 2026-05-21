import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  ClipboardList,
  Users,
  ArrowLeftRight,
  LogOut,
  Shield,
  UserCircle2,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

// Navigation par rôle
const NAV_ITEMS = {
  admin: [
    {
      to: "/",
      icon: LayoutDashboard,
      label: "Dashboard",
      end: true,
      description: "Vue d'ensemble",
    },
    {
      to: "/audit",
      icon: ClipboardList,
      label: "Audit",
      description: "Historique des opérations",
    },
  ],
  user: [
    {
      to: "/clients",
      icon: Users,
      label: "Clients",
      description: "Gestion des comptes",
    },
    {
      to: "/versements",
      icon: ArrowLeftRight,
      label: "Versements",
      description: "Transactions bancaires",
    },
  ],
};

// Badge visuel selon le rôle
const ROLE_CONFIG = {
  admin: {
    label: "Administrateur",
    icon: Shield,
    gradient: "from-violet-600 to-indigo-600",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    glow: "shadow-violet-200",
    indicator: "bg-violet-500",
  },
  user: {
    label: "Utilisateur",
    icon: UserCircle2,
    gradient: "from-blue-600 to-cyan-600",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    glow: "shadow-blue-200",
    indicator: "bg-blue-500",
  },
};

export default function Navbar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const items = NAV_ITEMS[user?.role] || [];
  const roleConf = ROLE_CONFIG[user?.role] || ROLE_CONFIG.user;
  const RoleIcon = roleConf.icon;

  const handleLogout = () => {
    setMobileOpen(false);
    onLogout();
    navigate("/");
  };

  return (
    <>
      {/* ── Barre principale ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleConf.gradient} flex items-center justify-center shadow-md ${roleConf.glow}`}
              >
                <Building2 size={18} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  VersBank
                </p>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                  Gestion bancaire
                </p>
              </div>
            </div>

            {/* Séparateur vertical */}
            <div className="hidden sm:block w-px h-8 bg-gray-100" />

            {/* Navigation desktop */}
            <div className="hidden sm:flex items-center gap-1 flex-1">
              {items.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-br ${roleConf.gradient} text-white shadow-md ${roleConf.glow}`
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Profil utilisateur + Déconnexion */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Badge rôle (desktop) */}
              <div className="hidden md:flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2">
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleConf.gradient} flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold">
                      {user?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  {/* Pastille statut en ligne */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${roleConf.indicator} border-2 border-white rounded-full`}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-none">
                    {user?.username}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <RoleIcon size={9} className="text-gray-400" />
                    <p className="text-[10px] text-gray-400 leading-none">
                      {roleConf.label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bouton déconnexion (desktop) */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm rounded-xl transition-colors border border-red-100"
              >
                <LogOut size={15} />
                <span className="hidden lg:inline">Déconnexion</span>
              </button>

              {/* Burger mobile */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="sm:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Menu mobile ────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 space-y-1">
            {/* Profil mobile */}
            <div
              className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br ${roleConf.gradient} text-white mb-3`}
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-bold text-sm">{user?.username}</p>
                <div className="flex items-center gap-1 opacity-80">
                  <RoleIcon size={10} />
                  <p className="text-xs">{roleConf.label}</p>
                </div>
              </div>
            </div>

            {/* Liens mobile */}
            {items.map(({ to, icon: Icon, label, description, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`p-2 rounded-lg ${isActive ? "bg-white/20" : "bg-gray-100"}`}
                    >
                      <Icon
                        size={16}
                        className={isActive ? "text-white" : "text-gray-600"}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{label}</p>
                      <p
                        className={`text-xs ${isActive ? "text-gray-300" : "text-gray-400"}`}
                      >
                        {description}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className={isActive ? "text-white" : "text-gray-300"}
                    />
                  </>
                )}
              </NavLink>
            ))}

            {/* Déconnexion mobile */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-100 mt-2"
            >
              <div className="p-2 bg-red-100 rounded-lg">
                <LogOut size={16} />
              </div>
              <span className="text-sm font-semibold">Déconnexion</span>
            </button>
          </div>
        )}
      </nav>

      {/* ── Bandeau contextuel sous la navbar ─────────────────────── */}
      <div
        className={`bg-gradient-to-r ${roleConf.gradient} text-white px-6 py-2 flex items-center gap-2`}
      >
        <RoleIcon size={13} className="opacity-80" />
        <p className="text-xs font-medium opacity-90">
          {user?.role === "admin"
            ? "Mode Administrateur — Accès complet aux statistiques et à l'audit du système"
            : "Espace Opérateur — Gestion des clients et des versements bancaires"}
        </p>
      </div>
    </>
  );
}
