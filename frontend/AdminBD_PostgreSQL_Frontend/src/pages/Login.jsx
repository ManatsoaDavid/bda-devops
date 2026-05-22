import { useState } from "react";
import axios from "axios";
import { Building2, User, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/login.php", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success(`Bienvenue ${res.data.username} !`);
      setTimeout(() => onLogin(res.data), 800);
    } catch {
      toast.error("Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Fond décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full" />
              <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-white rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full" />
            </div>
            <div className="relative">
              <div className="w-20 h-20 bg-blue-500/20 border-2 border-blue-400/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={40} className="text-blue-300" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Versements Bancaires RAmihone Manatsoa David
              </h1>
              <p className="text-blue-300 text-sm mt-1">
                Système de gestion & d'audit
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">
              Connexion à votre compte
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-800 to-indigo-700 hover:from-blue-700 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 transition-all disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn size={18} />
                )}
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            {/* Hint */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-center">
              <p className="font-semibold text-blue-800 mb-1">
                💡 Comptes disponibles
              </p>
              <p className="text-blue-600">Manatsoa / David</p>
              <p className="text-blue-400 text-xs mt-0.5">
                Mot de passe : <strong>password</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
