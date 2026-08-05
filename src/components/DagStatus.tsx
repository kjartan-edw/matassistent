"use client";

import { DagTotaler, kcalNivå } from "@/lib/storage";

interface Props {
  totaler: DagTotaler;
  antallMåltider: number;
  dagsmål?: number;
  proteinmål?: number;
}

const kcalConfig = {
  lavt:    { farge: "#FF9500", bg: "#FFF4E5" },
  moderat: { farge: "#34C759", bg: "#E8F8ED" },
  høyt:    { farge: "#FF3B30", bg: "#FFF0EF" },
};

export default function DagStatus({ totaler, antallMåltider, dagsmål, proteinmål }: Props) {
  if (antallMåltider === 0) {
    return (
      <div className="mx-4 mt-3 rounded-2xl px-5 py-4 text-sm text-center" style={{ background: "#fff", color: "#86868b", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        Ta bilde av første måltid for å se dagens status
      </div>
    );
  }

  const kNivå = kcalNivå(totaler.kcal, dagsmål);
  const kcal = kcalConfig[kNivå];
  const kcalProsent = dagsmål ? Math.min(100, Math.round((totaler.kcal / dagsmål) * 100)) : null;
  const proteinProsent = proteinmål ? Math.min(100, Math.round((totaler.protein / proteinmål) * 100)) : null;

  return (
    <div className="mx-4 mt-3 rounded-2xl px-5 py-4" style={{ background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#86868b" }}>I dag</p>

      {/* Kalorier */}
      <div className="mb-2 rounded-xl px-3 py-2.5" style={{ background: kcal.bg }}>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-sm font-semibold" style={{ color: kcal.farge }}>
            {totaler.kcal} kcal
          </span>
          {dagsmål && (
            <span className="text-xs" style={{ color: "#86868b" }}>
              av {dagsmål} kcal ({kcalProsent}%)
            </span>
          )}
        </div>
        {dagsmål && (
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${kcalProsent}%`, background: kcal.farge }} />
          </div>
        )}
      </div>

      {/* Protein */}
      <div className="rounded-xl px-3 py-2.5" style={{ background: "#F5F5F7" }}>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>
            {totaler.protein}g protein
          </span>
          {proteinmål && (
            <span className="text-xs" style={{ color: "#86868b" }}>
              av {proteinmål}g ({proteinProsent}%)
            </span>
          )}
        </div>
        {proteinmål && (
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${proteinProsent}%`,
                background: proteinProsent! >= 80 ? "#34C759" : proteinProsent! >= 40 ? "#FF9500" : "#86868b",
              }}
            />
          </div>
        )}
      </div>

      <p className="mt-2.5 text-xs" style={{ color: "#86868b" }}>
        {antallMåltider} {antallMåltider === 1 ? "måltid" : "måltider"} i dag
      </p>
    </div>
  );
}
