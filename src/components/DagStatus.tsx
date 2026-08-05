"use client";

import { DagTotaler, kcalNivå } from "@/lib/storage";

interface Props {
  totaler: DagTotaler;
  antallMåltider: number;
  dagsmål?: number;
  proteinmål?: number;
}

const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;

export default function DagStatus({ totaler, antallMåltider, dagsmål, proteinmål }: Props) {
  if (antallMåltider === 0) {
    return (
      <div className="mx-4 mt-3 rounded-2xl px-5 py-4 text-sm text-center" style={{ background: "#fff", color: "#86868b", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        Ta bilde av første måltid for å se dagens status
      </div>
    );
  }

  const nivå = kcalNivå(totaler.kcal, dagsmål);
  const kcalFarge = nivå === "høyt" ? "#FF3B30" : nivå === "lavt" ? "#FF9500" : "#34C759";
  const kcalProsent = dagsmål ? Math.min(100, Math.round((totaler.kcal / dagsmål) * 100)) : null;
  const proteinProsent = proteinmål ? Math.min(100, Math.round((totaler.protein / proteinmål) * 100)) : null;
  const igjen = dagsmål ? Math.max(0, dagsmål - totaler.kcal) : null;
  const ringDash = kcalProsent !== null ? RING_C * Math.min(1, kcalProsent / 100) : 0;

  return (
    <div
      className="mx-4 mt-3 rounded-2xl p-4 overflow-hidden relative"
      style={{
        background: "linear-gradient(145deg, #1C3A28 0%, #0D1F14 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full" style={{ background: "rgba(52,199,89,0.06)" }} />

      <div className="flex items-center gap-4">
        {/* Ring */}
        {dagsmål && (
          <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 76, height: 76 }}>
            <svg width="76" height="76" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={RING_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r={RING_R} fill="none"
                stroke={kcalFarge} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${ringDash} ${RING_C}`}
                transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-xs font-bold leading-tight" style={{ color: "#fff" }}>{kcalProsent}%</p>
            </div>
          </div>
        )}

        {/* Tall */}
        <div className="flex-1">
          <p className="text-2xl font-bold tracking-tight" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
            {totaler.kcal}
            <span className="text-sm font-medium ml-1" style={{ color: "rgba(255,255,255,0.45)" }}>kcal</span>
          </p>
          {dagsmål && (
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>av {dagsmål} · {igjen} igjen</p>
          )}
        </div>
      </div>

      {/* Protein-bar */}
      <div className="mt-3 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Protein</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {totaler.protein}g{proteinmål ? ` av ${proteinmål}g` : ""}
            {proteinProsent !== null ? ` (${proteinProsent}%)` : ""}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${proteinProsent ?? 0}%`,
              background: (proteinProsent ?? 0) >= 80 ? "#34C759" : (proteinProsent ?? 0) >= 40 ? "#FF9500" : "#86868b",
            }}
          />
        </div>
      </div>

      <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        {antallMåltider} {antallMåltider === 1 ? "måltid" : "måltider"} i dag
      </p>
    </div>
  );
}
