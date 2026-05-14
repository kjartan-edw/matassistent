"use client";

import { DagTotaler, kcalNivå, proteinNivå } from "@/lib/storage";

interface Props {
  totaler: DagTotaler;
  antallMåltider: number;
  dagsmål?: number;
}

const kcalConfig = {
  lavt:    { farge: "#FF9500", bg: "#FFF4E5" },
  moderat: { farge: "#34C759", bg: "#E8F8ED" },
  høyt:    { farge: "#FF3B30", bg: "#FFF0EF" },
};

const proteinConfig = {
  bra:          { ikon: "✅", farge: "#34C759", label: "Bra" },
  "litt lavt":  { ikon: "⚠️", farge: "#FF9500", label: "Litt lavt" },
  lavt:         { ikon: "❌", farge: "#FF3B30", label: "Lavt" },
};

export default function DagStatus({ totaler, antallMåltider, dagsmål }: Props) {
  if (antallMåltider === 0) {
    return (
      <div className="mx-4 mt-3 rounded-2xl px-5 py-4 text-sm text-center" style={{ background: "#fff", color: "#86868b", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        Ta bilde av første måltid for å se dagens status
      </div>
    );
  }

  const kNivå = kcalNivå(totaler.kcal, dagsmål);
  const pNivå = proteinNivå(totaler.protein);
  const kcal = kcalConfig[kNivå];
  const protein = proteinConfig[pNivå];
  const prosent = dagsmål ? Math.min(100, Math.round((totaler.kcal / dagsmål) * 100)) : null;

  return (
    <div className="mx-4 mt-3 rounded-2xl px-5 py-4" style={{ background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#86868b" }}>I dag</p>

      {/* Kalorimeter */}
      <div className="mb-3 rounded-xl px-3 py-2.5" style={{ background: kcal.bg }}>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-sm font-semibold" style={{ color: kcal.farge }}>
            {totaler.kcal} kcal
          </span>
          {dagsmål && (
            <span className="text-xs" style={{ color: "#86868b" }}>
              av {dagsmål} kcal ({prosent}%)
            </span>
          )}
        </div>
        {dagsmål && (
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${prosent}%`, background: kcal.farge }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: "#F5F5F7" }}>
          <span className="text-sm">{protein.ikon}</span>
          <div>
            <p className="text-xs" style={{ color: "#86868b" }}>Protein</p>
            <p className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>{totaler.protein}g · {protein.label}</p>
          </div>
        </div>
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: "#F5F5F7" }}>
          <span className="text-sm">🍽️</span>
          <div>
            <p className="text-xs" style={{ color: "#86868b" }}>Måltider</p>
            <p className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>{antallMåltider}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
