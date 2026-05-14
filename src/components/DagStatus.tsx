"use client";

import { DagTotaler, kcalNivå, proteinNivå } from "@/lib/storage";

interface Props {
  totaler: DagTotaler;
  antallMåltider: number;
  sisteMelding?: string;
}

const kcalConfig = {
  lavt:    { ikon: "🔥", farge: "#FF9500", bg: "#FFF4E5", label: "Lavt" },
  moderat: { ikon: "✅", farge: "#34C759", bg: "#E8F8ED", label: "Moderat" },
  høyt:   { ikon: "⚠️", farge: "#FF3B30", bg: "#FFF0EF", label: "Høyt" },
};

const proteinConfig = {
  bra:        { ikon: "✅", farge: "#34C759", label: "Bra" },
  "litt lavt": { ikon: "⚠️", farge: "#FF9500", label: "Litt lavt" },
  lavt:       { ikon: "❌", farge: "#FF3B30", label: "Lavt" },
};

export default function DagStatus({ totaler, antallMåltider, sisteMelding }: Props) {
  if (antallMåltider === 0) {
    return (
      <div className="mx-4 mt-3 rounded-2xl px-5 py-4 text-sm text-center" style={{ background: "#fff", color: "#86868b", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        Ta bilde av første måltid for å se dagens status
      </div>
    );
  }

  const kNivå = kcalNivå(totaler.kcal);
  const pNivå = proteinNivå(totaler.protein);
  const kcal = kcalConfig[kNivå];
  const protein = proteinConfig[pNivå];

  return (
    <div className="mx-4 mt-3 rounded-2xl px-5 py-4" style={{ background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#86868b" }}>I dag</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2.5" style={{ background: kcal.bg }}>
          <span className="text-base">{kcal.ikon}</span>
          <div>
            <p className="text-xs" style={{ color: "#86868b" }}>Inntak</p>
            <p className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>{kcal.label}</p>
          </div>
        </div>
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2.5" style={{ background: "#F5F5F7" }}>
          <span className="text-base">{protein.ikon}</span>
          <div>
            <p className="text-xs" style={{ color: "#86868b" }}>Protein</p>
            <p className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>{protein.label}</p>
          </div>
        </div>
      </div>

      <p className="text-xs" style={{ color: "#86868b" }}>
        Ca. {totaler.kcal} kcal · {totaler.protein}g protein · {antallMåltider} {antallMåltider === 1 ? "måltid" : "måltider"}
      </p>
    </div>
  );
}
