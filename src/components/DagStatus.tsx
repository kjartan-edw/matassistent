"use client";

import { Dagsstatus } from "@/lib/storage";

interface Props {
  status: Dagsstatus | null;
  antallMåltider: number;
}

const kcalConfig: Record<string, { ikon: string; farge: string; bg: string }> = {
  lavt:    { ikon: "🔥", farge: "#FF9500", bg: "#FFF4E5" },
  moderat: { ikon: "✅", farge: "#34C759", bg: "#E8F8ED" },
  høyt:   { ikon: "⚠️", farge: "#FF3B30", bg: "#FFF0EF" },
};

const proteinConfig: Record<string, { ikon: string; farge: string }> = {
  bra:        { ikon: "✅", farge: "#34C759" },
  "litt lavt": { ikon: "⚠️", farge: "#FF9500" },
  lavt:       { ikon: "❌", farge: "#FF3B30" },
};

export default function DagStatus({ status, antallMåltider }: Props) {
  if (!status && antallMåltider === 0) {
    return (
      <div className="mx-4 mt-3 rounded-2xl px-5 py-4 text-sm text-center" style={{ background: "#fff", color: "#86868b", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        Ta bilde av første måltid for å se dagens status
      </div>
    );
  }

  if (!status) return null;

  const kcal = kcalConfig[status.kcalNivå] ?? kcalConfig.moderat;
  const protein = proteinConfig[status.protein] ?? proteinConfig.bra;

  return (
    <div
      className="mx-4 mt-3 rounded-2xl px-5 py-4"
      style={{ background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#86868b" }}>I dag</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2.5" style={{ background: kcal.bg }}>
          <span className="text-base">{kcal.ikon}</span>
          <div>
            <p className="text-xs" style={{ color: "#86868b" }}>Inntak</p>
            <p className="text-sm font-semibold capitalize" style={{ color: "#1d1d1f" }}>{status.kcalNivå}</p>
          </div>
        </div>
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2.5" style={{ background: "#F5F5F7" }}>
          <span className="text-base">{protein.ikon}</span>
          <div>
            <p className="text-xs" style={{ color: "#86868b" }}>Protein</p>
            <p className="text-sm font-semibold capitalize" style={{ color: "#1d1d1f" }}>{status.protein}</p>
          </div>
        </div>
      </div>

      <p className="text-sm" style={{ color: "#1d1d1f" }}>{status.melding}</p>
      <p className="mt-1 text-xs" style={{ color: "#86868b" }}>
        Ca. {status.estimertKcal} kcal · {antallMåltider} {antallMåltider === 1 ? "måltid" : "måltider"} i dag
      </p>
    </div>
  );
}
