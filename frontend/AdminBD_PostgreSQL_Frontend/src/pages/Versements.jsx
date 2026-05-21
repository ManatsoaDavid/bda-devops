import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  PenLine,
  X,
  ArrowLeftRight,
  RefreshCw,
  Save,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { versementsAPI, clientsAPI } from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

export default function Versements() {
  const [versements, setVersements] = useState([]);
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filtreClient, setFiltreClient] = useState("");
  const [form, setForm] = useState({ ncheque: "", ncompte: "", montant: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalDelete, setModalDelete] = useState({ open: false, id: null });
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const charger = async () => {
    const [v, c] = await Promise.all([
      versementsAPI.getAll(),
      clientsAPI.getAll(),
    ]);
    setVersements(v.data);
    setClients(c.data);
  };

  useEffect(() => {
    charger();
  }, []);

  useEffect(() => {
    let result = versements;
    if (filtreClient)
      result = result.filter((v) => v.ncompte.toString() === filtreClient);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.ncheque?.toLowerCase().includes(q) ||
          v.nomclient?.toLowerCase().includes(q) ||
          v.nversement.toString().includes(q),
      );
    }
    setFiltered(result);
  }, [search, filtreClient, versements]);

  // Étape 1 : valider formulaire → ouvrir le bon modal
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (editId) {
      setModalEdit(true);
    } else {
      setModalAdd(true);
    }
  };

  // Étape 2 : confirmer ajout
  const handleConfirmAdd = async () => {
    setModalAdd(false);
    setLoading(true);
    try {
      await versementsAPI.create(form);
      toast.success("✅ Versement ajouté avec succès !");
      setForm({ ncheque: "", ncompte: "", montant: "" });
      charger();
    } catch {
      toast.error("Erreur lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : confirmer modification
  const handleConfirmEdit = async () => {
    setModalEdit(false);
    setLoading(true);
    try {
      await versementsAPI.update({ ...form, nversement: editId });
      toast.success("✅ Versement modifié avec succès !");
      setEditId(null);
      setForm({ ncheque: "", ncompte: "", montant: "" });
      charger();
    } catch {
      toast.error("Erreur lors de la modification.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (v) => {
    setEditId(v.nversement);
    setForm({ ncheque: v.ncheque, ncompte: v.ncompte, montant: v.montant });
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info(`✏️ Modification du versement #${v.nversement}`);
  };

  const handleDelete = async () => {
    try {
      await versementsAPI.delete(modalDelete.id);
      toast.success("🗑️ Versement supprimé !");
      charger();
    } catch {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setModalDelete({ open: false, id: null });
    }
  };

  // Nom du client sélectionné pour afficher dans le modal
  const clientSelectionne = clients.find(
    (c) => c.ncompte.toString() === form.ncompte.toString(),
  );
  const totalMontant = filtered.reduce((s, v) => s + parseFloat(v.montant), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Modal suppression */}
      <ConfirmModal
        isOpen={modalDelete.open}
        onConfirm={handleDelete}
        onCancel={() => setModalDelete({ open: false, id: null })}
        title="Supprimer ce versement ?"
        message="Cette action est irréversible et mettra à jour le solde du client automatiquement."
        type="danger"
      />

      {/* Modal ajout */}
      <ConfirmModal
        isOpen={modalAdd}
        onConfirm={handleConfirmAdd}
        onCancel={() => setModalAdd(false)}
        title="Confirmer l'ajout ?"
        message={`Ajouter le versement N° ${form.ncheque} de ${parseFloat(form.montant || 0).toLocaleString()} Ar pour ${clientSelectionne?.nomclient || "—"} ?`}
        type="success"
      />

      {/* Modal modification */}
      <ConfirmModal
        isOpen={modalEdit}
        onConfirm={handleConfirmEdit}
        onCancel={() => setModalEdit(false)}
        title="Confirmer la modification ?"
        message={`Modifier le versement #${editId} avec un montant de ${parseFloat(form.montant || 0).toLocaleString()} Ar pour ${clientSelectionne?.nomclient || "—"} ?`}
        type="warning"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Versements</h2>
          <p className="text-gray-400 text-sm mt-1">
            Enregistrez et gérez les versements bancaires
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">
              {versements.length}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <ArrowLeftRight size={11} />
              Total
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-center shadow-sm">
            <p className="text-xl font-bold text-emerald-600">
              {totalMontant.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Montants (Ar)</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div
        className={`bg-white rounded-2xl shadow-sm border p-6 mb-6 transition-all ${editId ? "border-orange-200 bg-orange-50/30" : "border-gray-100"}`}
      >
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          {editId ? (
            <>
              <PenLine size={16} className="text-orange-500" /> Modifier le
              versement #{editId}
            </>
          ) : (
            <>
              <Plus size={16} className="text-blue-500" /> Nouveau versement
            </>
          )}
        </h3>
        <form onSubmit={handleSubmitForm} className="flex gap-3 flex-wrap">
          <input
            className="flex-1 min-w-36 px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
            placeholder="N° Chèque"
            value={form.ncheque}
            onChange={(e) => setForm({ ...form, ncheque: e.target.value })}
            required
          />
          <select
            className="flex-1 min-w-48 px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
            value={form.ncompte}
            onChange={(e) => setForm({ ...form, ncompte: e.target.value })}
            required
          >
            <option value="">-- Choisir un client --</option>
            {clients.map((c) => (
              <option key={c.ncompte} value={c.ncompte}>
                {c.nomclient} — {parseFloat(c.solde).toLocaleString()} Ar
              </option>
            ))}
          </select>
          <input
            type="number"
            className="flex-1 min-w-36 px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
            placeholder="Montant (Ar)"
            value={form.montant}
            onChange={(e) => setForm({ ...form, montant: e.target.value })}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-xl transition-all disabled:opacity-60 shadow-sm ${editId ? "bg-orange-500 hover:bg-orange-600 shadow-orange-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : editId ? (
              <Save size={16} />
            ) : (
              <Plus size={16} />
            )}
            {editId ? "Enregistrer" : "Ajouter"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({ ncheque: "", ncompte: "", montant: "" });
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors"
            >
              <X size={16} /> Annuler
            </button>
          )}
        </form>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-52">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
              placeholder="Rechercher..."
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
          <select
            className="px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
            value={filtreClient}
            onChange={(e) => setFiltreClient(e.target.value)}
          >
            <option value="">👥 Tous les clients</option>
            {clients.map((c) => (
              <option key={c.ncompte} value={c.ncompte}>
                {c.nomclient}
              </option>
            ))}
          </select>
          {(search || filtreClient) && (
            <button
              onClick={() => {
                setSearch("");
                setFiltreClient("");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-xl transition-colors"
            >
              <RefreshCw size={14} /> Réinitialiser
            </button>
          )}
          <div className="ml-auto text-sm text-gray-400 flex items-center">
            <span className="font-semibold text-gray-700">
              {filtered.length}
            </span>
            &nbsp;versement(s) —&nbsp;
            <span className="font-bold text-blue-700">
              {totalMontant.toLocaleString()} Ar
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800 to-blue-900 text-white">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                  N° Versement
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                  N° Chèque
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Client
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <ArrowLeftRight
                      size={40}
                      className="text-gray-200 mx-auto mb-2"
                    />
                    <p className="text-gray-400 text-sm">
                      Aucun versement trouvé
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((v, i) => (
                  <tr
                    key={v.nversement}
                    className={`hover:bg-blue-50/50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        #{v.nversement}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">
                      {v.ncheque}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {v.nomclient?.[0]}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {v.nomclient}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        {parseFloat(v.montant).toLocaleString()} Ar
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(v)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold rounded-lg transition-colors border border-orange-100"
                        >
                          <PenLine size={12} /> Modifier
                        </button>
                        <button
                          onClick={() =>
                            setModalDelete({ open: true, id: v.nversement })
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors border border-red-100"
                        >
                          <Trash2 size={12} /> Supprimer
                        </button>
                      </div>
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
