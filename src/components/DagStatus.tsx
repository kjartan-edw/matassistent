"use client";

import { Dagsstatus } from "@/lib/storage";

interface Props {
  status: Dagsstatus | null;
  antallMåltider: number;
}

const kcalIkon: Record<string, string> = {
  lavt: "🔥",
  moderat: "✅",
  høyt: "⚠️",
};

const proteinIkon: Record<string, string> = {
  bra: "✅",
  "litt lavt": "⚠️",
  lavt: "❌",
};

export default function DagStatus({ status, antallMåltider }: Props) {
  if (!status && antallMåltider === 0) {
    return (
      <div className="mx-4 mt-4 rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-400">
        Ta bilde av første måltid for å se dagens status
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="mx-4 mt-4 rounded-2xl bg-green-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-green-700">I dag</p>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
          <span>{kcalIkon[status.kcalNivå] ?? "📊"}</span>
          <div>
            <p className="text-xs text-gray-500">Inntak</p>
            <p className="text-sm font-medium capitalize">{status.kcalNivå}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
          <span>{proteinIkon[status.protein] ?? "🥩"}</span>
          <div>
            <p className="text-xs text-gray-500">Protein</p>
            <p className="text-sm font-medium capitalize">{status.protein}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{status.melding}</p>
      <p className="mt-1 text-xs text-gray-400">
        Ca. {status.estimertKcal} kcal · {antallMåltider} {antallMåltider === 1 ? "måltid" : "måltider"} i dag
      </p>
    </div>
  );
}
