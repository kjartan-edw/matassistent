"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Onboarding from "@/components/Onboarding";
import { hentMåltider, hentProfil, beregnDagTotaler, kcalNivå, Måltid, DagTotaler } from "@/lib/storage";

interface DagSummary {
  datoStr: string;
  datoLabel: string;
  måltider: Måltid[];
  totaler: DagTotaler;
}

const RING_R = 38;
const RING_C = 2 * Math.PI * RING_R;

function KcalRing({ prosent, kcal, dagsmål }: { prosent: number; kcal: number; dagsmål?: number }) {
  const dash = RING_C * Math.min(1, prosent / 100);
  const farge = prosent > 100 ? "#FF3B30" : prosent > 50 ? "#34C759" : "#FF9500";
  return (
    <div className="relative flex items-center justify-center" style={{ width: 88, height: 88 }}>
      <svg width="88" height="88" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={RING_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={RING_R} fill="none"
          stroke={farge} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${RING_C}`}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xs font-bold" style={{ color: "#fff" }}>{prosent}%</p>
      </div>
    </div>
  );
}

export default function Oversikt() {
  const [dager, setDager] = useState<DagSummary[]>([]);
  const [visOnboarding, setVisOnboarding] = useState(false);
  const [dagsmål, setDagsmål] = useState<number | undefined>(undefined);

  useEffect(() => {
    const profil = hentProfil();
    if (!profil || !profil.dagsmål || !profil.aktivitet) setVisOnboarding(true);
    else setDagsmål(profil.dagsmål);

    const alle = hentMåltider();
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
      const datoLabel = i === 0 ? "I dag"
        : i === 1 ? "I går"
        : d.toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "short" });
      summaries.push({ datoStr: key, datoLabel, måltider, totaler: beregnDagTotaler(måltider) });
    }
    setDager(summaries);
  }, []);

  const idag = dager[0];
  const kcalProsent = dagsmål && idag?.totaler.kcal ? Math.round((idag.totaler.kcal / dagsmål) * 100) : 0;
  const igjen = dagsmål ? Math.max(0, dagsmål - (idag?.totaler.kcal ?? 0)) : null;

  return (
    <div className="flex min-h-dvh flex-col" style={{ background: "#F2F2F7" }}>
      {visOnboarding && <Onboarding onFerdig={() => { setVisOnboarding(false); setDagsmål(hentProfil()?.dagsmål); }} />}

      {/* Header */}
      <header
        className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
        style={{
          background: "rgba(242,242,247,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={() => setVisOnboarding(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity active:opacity-60"
          style={{ background: "rgba(0,0,0,0.06)" }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.01em" }}>Matassistent</h1>
        <Link
          href="/app/chat"
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity active:opacity-70"
          style={{ background: "#34C759" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Logg
        </Link>
      </header>

      <div className="px-4 pt-4 pb-12 space-y-3">

        {/* I dag — hero */}
        <Link href="/app/chat">
          <div
            className="rounded-3xl p-5 overflow-hidden relative"
            style={{
              background: "linear-gradient(145deg, #1C3A28 0%, #0D1F14 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            {/* Subtil bakgrunnsdekor */}
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full" style={{ background: "rgba(52,199,89,0.06)" }} />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>I dag</p>
                <p className="text-4xl font-bold mt-1.5 tracking-tight" style={{ color: "#fff", letterSpacing: "-0.03em" }}>
                  {idag?.totaler.kcal ?? 0}
                  <span className="text-xl font-medium ml-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>kcal</span>
                </p>
                {dagsmål && (
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                    av {dagsmål} kcal mål
                  </p>
                )}
              </div>
              <KcalRing prosent={kcalProsent} kcal={idag?.totaler.kcal ?? 0} dagsmål={dagsmål} />
            </div>

            {/* Stats-rad */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: "Protein", verdi: `${idag?.totaler.protein ?? 0}g` },
                { label: "Måltider", verdi: `${idag?.måltider.length ?? 0}` },
                { label: "Igjen", verdi: igjen !== null ? `${igjen}` : "—" },
              ].map(({ label, verdi }) => (
                <div key={label} className="rounded-2xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "#fff" }}>{verdi}</p>
                </div>
              ))}
            </div>

            {!idag?.måltider.length && (
              <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                Trykk for å logge første måltid →
              </p>
            )}
          </div>
        </Link>

        {/* Siste dager */}
        {dager.slice(1).some(d => d.måltider.length > 0) && (
          <p className="text-xs font-semibold uppercase tracking-widest px-1 pt-2" style={{ color: "#86868b" }}>
            Siste dager
          </p>
        )}

        {dager.slice(1).map((dag) => {
          if (dag.måltider.length === 0) return null;
          const nivå = kcalNivå(dag.totaler.kcal, dagsmål);
          const farge = nivå === "moderat" ? "#34C759" : nivå === "lavt" ? "#FF9500" : "#FF3B30";
          const prosent = dagsmål ? Math.min(100, Math.round((dag.totaler.kcal / dagsmål) * 100)) : null;
          return (
            <div
              key={dag.datoStr}
              className="rounded-2xl px-4 py-3.5"
              style={{ background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold capitalize" style={{ color: "#1d1d1f" }}>{dag.datoLabel}</p>
                <p className="text-xs font-medium" style={{ color: farge }}>
                  {dag.totaler.kcal} kcal
                </p>
              </div>
              {prosent !== null && (
                <div className="h-1 w-full rounded-full overflow-hidden mb-2" style={{ background: "#F2F2F7" }}>
                  <div className="h-full rounded-full" style={{ width: `${prosent}%`, background: farge, transition: "width 0.4s ease" }} />
                </div>
              )}
              <p className="text-xs" style={{ color: "#86868b" }}>
                {dag.måltider.length} {dag.måltider.length === 1 ? "måltid" : "måltider"} · {dag.totaler.protein}g protein
              </p>
            </div>
          );
        })}

        {dager.slice(1).every(d => d.måltider.length === 0) && (
          <p className="text-sm text-center py-6" style={{ color: "#86868b" }}>Ingen historikk enda</p>
        )}
      </div>
    </div>
  );
}
