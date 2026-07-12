// StatCard.jsx — Small metric card used in dashboard welcome section
import React from "react";
import { BookOpen, Clock, CheckCircle, Zap } from "lucide-react";

const ICONS = { BookOpen, Clock, CheckCircle, Zap };
const COLOR_MAP = {
  brand: { bg: "bg-brand-50", text: "text-brand-600", border: "border-brand-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
  gold: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100" },
};

export default function StatCard({ label, value, icon, color = "brand" }) {
  const Icon = ICONS[icon] || BookOpen;
  const c = COLOR_MAP[color];
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
