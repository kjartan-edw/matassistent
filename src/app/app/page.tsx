"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Onboarding from "@/components/Onboarding";
import { hentMåltider, hentProfil, beregnDagTotaler, kcalNivå, Måltid, DagTotaler } from "@/lib/storage";

interface DagSummary {
  datoStr: string;
  datoLabel: string;
  erIdag: boolean;
  måltider: Måltid[];
  totaler: DagTotaler;
}

const kcalFarge: Record<string, string> = {
  lavt: "#FF9500",
  moderat: "#34C759",
  høyt: "#FF3B30",
};
const kcalBg: Record<string, string> = {
  lavt: "#FFF4E5",
  moderat: "#E8F8ED",
  høyt: "#FFF0EF",
};

export default function Oversikt() {
  const [dager, setDager] = useState<DagSummary[]>([]);
  const [visOnboarding, setVisOnboarding] = useState(false);
  const [dagsmål, setDagsmål] = useState<number | undefined>(undefined);

  useEffect(() => {
    const profil = hentProfil();
    if (!profil) setVisOnboarding(true);
    else setDagsmål(profil.dagsmål);

    const alle = hentMåltider();
    const idagStr = new Date().toDateString();

    // Bygg siste 7 dager
    const dagMap: Record<string, Måltid[]> = {};
    for (const m of alle) {
      const key = new Date(m.timestamp).toDateString();
      if (!dagMap[key]) dagMap[key] = [];
      dagMap[key].push(m);
    }

    const summaries: DagSummary[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const måltider = dagMap[key] ?? [];
      const datoLabel = i === 0
        ? "I dag"
        : i === 1
        ? "I går"
        : d.toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "short" });

      summaries.push({
        datoStr: key,
        datoLabel,
        erIdag: key === idagStr,
        måltider,
        totaler: beregnDagTotaler(måltider),
      });
    }

    setDager(summaries);
  }, []);

  const idag = dager[0];

  return (
    <div className="flex min-h-dvh flex-col" style={{ background: "#F5F5F7" }}>
      {visOnboarding && <Onboarding onFerdig={() => setVisOnboarding(false)} />}

      {/* Header */}
      <header
        className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
        style={{
          background: "rgba(245,245,247,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <h1 className="text-base font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.01em" }}>
          Matassistent
        </h1>
        <Link
          href="/app/chat"
          className="rounded-full px-4 py-2 text-sm font-medium text-white transition-opacity active:opacity-70"
          style={{ background: "#34C759" }}
        >
          + Legg til måltid
        </Link>
      </header>

      <div className="px-4 pt-4 pb-10 space-y-3">

        {/* I dag — stort kort */}
        <Link href="/app/chat">
          <div
            className="rounded-3xl p-5 mb-1"
            style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#86868b" }}>I dag</p>
                <p className="text-2xl font-bold mt-0.5" style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                  {idag?.måltider.length ? (
                    <span style={{ color: kcalFarge[kcalNivå(idag.totaler.kcal, dagsmål)] }}>
                      {idag.totaler.kcal} kcal
                    </span>
                  ) : "Ingen måltider enda"}
                </p>
                {dagsmål && idag?.måltider.length ? (
                  <p className="text-xs mt-0.5" style={{ color: "#86868b" }}>av {dagsmål} kcal dagsmål</p>
                ) : null}
              </div>
              <div className="text-2xl">🍽️</div>
            </div>

            {idag?.måltider.length ? (
              <div className="flex gap-2 flex-wrap">
                <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: kcalBg[kcalNivå(idag.totaler.kcal, dagsmål)], color: kcalFarge[kcalNivå(idag.totaler.kcal, dagsmål)] }}>
                  {kcalNivå(idag.totaler.kcal, dagsmål)} inntak
                </span>
                <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: "#F5F5F7", color: "#86868b" }}>
                  {idag.totaler.protein}g protein
                </span>
                <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: "#F5F5F7", color: "#86868b" }}>
                  {idag.måltider.length} {idag.måltider.length === 1 ? "måltid" : "måltider"}
                </span>
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#86868b" }}>
                Trykk her for å logge første måltid →
              </p>
            )}
          </div>
        </Link>

        {/* Siste dager */}
        <p className="text-xs font-semibold uppercase tracking-widest px-1 pt-2" style={{ color: "#86868b" }}>
          Siste dager
        </p>

        {dager.slice(1).map((dag) => {
          if (dag.måltider.length === 0) return null;
          const nivå = kcalNivå(dag.totaler.kcal, dagsmål);
          const farge = kcalFarge[nivå];
          const bg = kcalBg[nivå];
          return (
            <div
              key={dag.datoStr}
              className="rounded-2xl px-4 py-3.5 flex items-center justify-between"
              style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <div>
                <p className="text-sm font-medium capitalize" style={{ color: "#1d1d1f" }}>{dag.datoLabel}</p>
                <p className="text-xs mt-0.5" style={{ color: "#86868b" }}>
                  {dag.måltider.length} {dag.måltider.length === 1 ? "måltid" : "måltider"} · {dag.totaler.kcal} kcal · {dag.totaler.protein}g protein
                </p>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-semibold capitalize" style={{ background: bg, color: farge }}>
                {nivå}
              </span>
            </div>
          );
        })}

        {dager.slice(1).every((d) => d.måltider.length === 0) && (
          <p className="text-sm text-center py-4" style={{ color: "#86868b" }}>
            Ingen historikk enda
          </p>
        )}
      </div>
    </div>
  );
}
