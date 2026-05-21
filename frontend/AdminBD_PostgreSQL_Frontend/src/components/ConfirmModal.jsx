import { AlertTriangle, Trash2, X, Check, Plus, LogOut } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  type = "danger",
}) {
  if (!isOpen) return null;

  const config = {
    danger: {
      icon: <Trash2 size={28} className="text-red-500" />,
      iconBg: "bg-red-100",
      confirmBtn: "bg-red-600 hover:bg-red-500 shadow-red-200",
      confirmTxt: "Oui, supprimer",
    },
    warning: {
      icon: <AlertTriangle size={28} className="text-orange-500" />,
      iconBg: "bg-orange-100",
      confirmBtn: "bg-orange-500 hover:bg-orange-400 shadow-orange-200",
      confirmTxt: "Oui, modifier",
    },
    success: {
      icon: <Plus size={28} className="text-emerald-500" />,
      iconBg: "bg-emerald-100",
      confirmBtn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200",
      confirmTxt: "Oui, ajouter",
    },
    logout: {
      icon: <LogOut size={28} className="text-orange-500" />,
      iconBg: "bg-orange-100",
      confirmBtn: "bg-orange-500 hover:bg-orange-400 shadow-orange-200",
      confirmTxt: "Oui, se déconnecter",
    },
  };

  const c = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
        >
          <X size={18} />
        </button>
        <div
          className={`w-16 h-16 ${c.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
        >
          {c.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-center text-sm leading-relaxed mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            <X size={16} /> Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 ${c.confirmBtn} text-white font-semibold rounded-xl shadow-lg transition-all`}
          >
            <Check size={16} /> {c.confirmTxt}
          </button>
        </div>
      </div>
    </div>
  );
}
