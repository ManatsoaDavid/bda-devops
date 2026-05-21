import { useState, useEffect } from "react";
import { Search, Plus, Trash2, X, Users, Wallet, UserPlus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clientsAPI } from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

function Highlight({ text, query }) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nomclient: "", solde: "" });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, id: null, nom: "" });

  const charger = async () => {
    const res = await clientsAPI.getAll();
    setClients(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    charger();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      clients.filter(
        (c) =>
          c.nomclient.toLowerCase().includes(q) ||
          c.ncompte.toString().includes(q),
      ),
    );
  }, [search, clients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientsAPI.create(form);
      setForm({ nomclient: "", solde: "" });
      toast.success(`✅ Client "${form.nomclient}" ajouté avec succès !`);
      charger();
    } catch {
      toast.error("Erreur lors de l'ajout du client.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, nom) => setModal({ open: true, id, nom });

  const handleDelete = async () => {
    try {
      await clientsAPI.delete(modal.id);
      toast.success(`🗑️ Client "${modal.nom}" supprimé.`);
      charger();
    } catch {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setModal({ open: false, id: null, nom: "" });
    }
  };

  const totalSolde = filtered.reduce((sum, c) => sum + parseFloat(c.solde), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <ConfirmModal
        isOpen={modal.open}
        onConfirm={handleDelete}
        onCancel={() => setModal({ open: false, id: null, nom: "" })}
        title="Supprimer ce client ?"
        message={`Vous êtes sur le point de supprimer le client "${modal.nom}". Cette action est irréversible.`}
        type="danger"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-400 text-sm mt-1">
            Gérez les comptes clients
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Users size={11} />
              Clients
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">
              {totalSolde.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Wallet size={11} />
              Total (Ar)
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <UserPlus size={16} className="text-blue-500" />
          Ajouter un client
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Users
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
              placeholder="Nom du client"
              value={form.nomclient}
              onChange={(e) => setForm({ ...form, nomclient: e.target.value })}
              required
            />
          </div>
          <div className="relative flex-1 min-w-40">
            <Wallet
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
              placeholder="Solde initial (Ar)"
              value={form.solde}
              onChange={(e) => setForm({ ...form, solde: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-blue-200"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Ajouter
          </button>
        </form>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Recherche */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
              placeholder="Rechercher par nom ou n° compte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <span className="text-sm text-gray-400">
            {filtered.length} résultat(s)
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800 to-blue-900 text-white">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                  N° Compte
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Nom Client
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Solde
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-12 text-center">
                    <Users size={40} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Aucun client trouvé</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr
                    key={c.ncompte}
                    className={`hover:bg-blue-50/50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        #{c.ncompte}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {c.nomclient[0]}
                        </div>
                        <Highlight text={c.nomclient} query={search} />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-bold px-3 py-1 rounded-full ${parseFloat(c.solde) >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                      >
                        {parseFloat(c.solde).toLocaleString()} Ar
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => confirmDelete(c.ncompte, c.nomclient)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors border border-red-100"
                      >
                        <Trash2 size={13} />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
