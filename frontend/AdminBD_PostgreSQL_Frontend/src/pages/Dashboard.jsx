import { useState, useEffect } from "react";
import {
  Users,
  ArrowLeftRight,
  Wallet,
  ClipboardList,
  TrendingUp,
  CheckCircle,
  PenLine,
  Trash2,
  Clock,
} from "lucide-react";
import { clientsAPI, versementsAPI, auditAPI } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    versements: 0,
    totalSolde: 0,
    auditStats: {},
  });
  const [recentAudit, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      clientsAPI.getAll(),
      versementsAPI.getAll(),
      auditAPI.getAll(),
    ]).then(([c, v, a]) => {
      setStats({
        clients: c.data.length,
        versements: v.data.length,
        totalSolde: c.data.reduce((s, cl) => s + parseFloat(cl.solde), 0),
        auditStats: a.data.stats,
      });
      setRecent(a.data.audits.slice(0, 6));
      setLoading(false);
    });
  }, []);

  const kpis = [
    {
      label: "Clients actifs",
      value: stats.clients,
      icon: Users,
      gradient: "from-blue-500 to-blue-700",
      light: "bg-blue-50 text-blue-600",
    },
    {
      label: "Versements",
      value: stats.versements,
      icon: ArrowLeftRight,
      gradient: "from-emerald-500 to-emerald-700",
      light: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total soldes (Ar)",
      value: stats.totalSolde.toLocaleString(),
      icon: Wallet,
      gradient: "from-violet-500 to-violet-700",
      light: "bg-violet-50 text-violet-600",
    },
    {
      label: "Opérations audit",
      value:
        parseInt(stats.auditStats.nb_insertions || 0) +
        parseInt(stats.auditStats.nb_modifications || 0) +
        parseInt(stats.auditStats.nb_suppressions || 0),
      icon: TrendingUp,
      gradient: "from-orange-500 to-orange-700",
      light: "bg-orange-50 text-orange-600",
    },
  ];

  const auditConfig = {
    INSERT: {
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      label: "Insertion",
    },
    UPDATE: {
      icon: PenLine,
      color: "text-amber-500",
      bg: "bg-amber-50",
      label: "Modification",
    },
    DELETE: {
      icon: Trash2,
      color: "text-red-500",
      bg: "bg-red-50",
      label: "Suppression",
    },
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Chargement...</p>
        </div>
      </div>
    );

  const total =
    parseInt(stats.auditStats.nb_insertions || 0) +
    parseInt(stats.auditStats.nb_modifications || 0) +
    parseInt(stats.auditStats.nb_suppressions || 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-400 mt-1 text-sm">
          Vue d'ensemble en temps réel du système
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {kpis.map(({ label, value, icon: Icon, gradient, light }, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`${light} p-3 rounded-2xl`}>
                <Icon size={22} />
              </div>
            </div>
            <div
              className={`mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden`}
            >
              <div
                className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                style={{ width: "70%" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Répartition audit */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-500" />
            Répartition des opérations
          </h3>
          <div className="space-y-4">
            {[
              {
                key: "nb_insertions",
                label: "Insertions",
                color: "bg-emerald-500",
                light: "bg-emerald-50 text-emerald-700",
              },
              {
                key: "nb_modifications",
                label: "Modifications",
                color: "bg-amber-500",
                light: "bg-amber-50 text-amber-700",
              },
              {
                key: "nb_suppressions",
                label: "Suppressions",
                color: "bg-red-500",
                light: "bg-red-50 text-red-700",
              },
            ].map((s) => {
              const val = parseInt(stats.auditStats[s.key] || 0);
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return (
                <div key={s.key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-600">
                      {s.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">
                        {val}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.light}`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Total opérations</span>
            <span className="text-2xl font-bold text-gray-900">{total}</span>
          </div>
        </div>

        {/* Dernières opérations */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            Dernières opérations
          </h3>
          {recentAudit.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-300">
              <ClipboardList size={48} className="mb-3" />
              <p className="text-sm font-medium">
                Aucune opération enregistrée
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentAudit.map((a) => {
                const cfg = auditConfig[a.type_action] || {};
                const Icon = cfg.icon;
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50"
                  >
                    <div className={`${cfg.bg} p-2.5 rounded-xl shrink-0`}>
                      {Icon && <Icon size={16} className={cfg.color} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {a.nomclient}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${cfg.bg} ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        par{" "}
                        <span className="font-medium text-gray-500">
                          {a.utilisateur}
                        </span>{" "}
                        · {new Date(a.date_operation).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        {parseFloat(a.montant_nouv || 0).toLocaleString()} Ar
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
