"use client";

import { useState } from "react";
import { lagreProfil, Brukerprofil, Aktivitetsnivå, beregnDagsmål } from "@/lib/storage";

interface Props {
  onFerdig: () => void;
}

const aktivitetValg: { nivå: Aktivitetsnivå; label: string; beskrivelse: string }[] = [
  { nivå: "lav", label: "Lav", beskrivelse: "Stillesittende jobb, lite bevegelse til daglig" },
  { nivå: "moderat", label: "Moderat", beskrivelse: "Noe trening eller aktiv hverdag 2–3 dager/uke" },
  { nivå: "høy", label: "Høy", beskrivelse: "Aktiv jobb eller trening 4–5 dager/uke" },
];

export default function Onboarding({ onFerdig }: Props) {
  const [steg, setSteg] = useState(0);
  const [kjønn, setKjønn] = useState<Brukerprofil["kjønn"] | null>(null);
  const [alder, setAlder] = useState("");
  const [vekt, setVekt] = useState("");
  const [aktivitet, setAktivitet] = useState<Aktivitetsnivå | null>(null);

  function fullFør() {
    if (kjønn && Number(alder) > 0 && Number(vekt) > 0 && aktivitet) {
      const dagsmål = beregnDagsmål(kjønn, Number(alder), Number(vekt), aktivitet);
      lagreProfil({ kjønn, alder: Number(alder), vekt: Number(vekt), aktivitet, dagsmål });
    }
    onFerdig();
  }

  const antallSteg = 3;

  const stegInnhold = [
    {
      tittel: "Hei! La oss bli kjent.",
      undertittel: "Noen raske spørsmål, så setter vi et personlig mål.",
      kanGåVidere: !!kjønn,
      innhold: (
        <div className="space-y-3">
          <p className="text-sm font-medium mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Hva er kjønnet ditt?</p>
          <div className="grid grid-cols-3 gap-3">
            {(["mann", "kvinne", "annet"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKjønn(k)}
                className="rounded-2xl border-2 py-5 text-sm font-semibold transition-all active:scale-95"
                style={{
                  borderColor: kjønn === k ? "#34C759" : "rgba(255,255,255,0.12)",
                  background: kjønn === k ? "rgba(52,199,89,0.15)" : "rgba(255,255,255,0.06)",
                  color: kjønn === k ? "#34C759" : "rgba(255,255,255,0.7)",
                }}
              >
                {k === "mann" ? "Mann" : k === "kvinne" ? "Kvinne" : "Annet"}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      tittel: "Alder og vekt",
      undertittel: "Brukes til å beregne hvilemetabolismen din.",
      kanGåVidere: Number(alder) > 0 && Number(vekt) > 0,
      innhold: (
        <div className="space-y-4">
          {[
            { label: "Alder (år)", value: alder, onChange: setAlder, placeholder: "42" },
            { label: "Vekt (kg)", value: vekt, onChange: setVekt, placeholder: "82" },
          ].map(({ label, value, onChange, placeholder }) => (
            <div key={label}>
              <label className="mb-2 block text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-2xl px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      tittel: "Hvor aktiv er du?",
      undertittel: "Velg det som passer hverdagen din best.",
      kanGåVidere: !!aktivitet,
      innhold: (
        <div className="space-y-3">
          {aktivitetValg.map(({ nivå, label, beskrivelse }) => (
            <button
              key={nivå}
              onClick={() => setAktivitet(nivå)}
              className="w-full rounded-2xl border-2 px-4 py-4 text-left transition-all active:scale-95"
              style={{
                borderColor: aktivitet === nivå ? "#34C759" : "rgba(255,255,255,0.12)",
                background: aktivitet === nivå ? "rgba(52,199,89,0.15)" : "rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-sm font-semibold" style={{ color: aktivitet === nivå ? "#34C759" : "rgba(255,255,255,0.85)" }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{beskrivelse}</p>
            </button>
          ))}

          {aktivitet && kjønn && Number(alder) > 0 && Number(vekt) > 0 && (
            <div className="rounded-2xl px-4 py-3.5 mt-2" style={{ background: "rgba(52,199,89,0.12)", border: "1.5px solid rgba(52,199,89,0.3)" }}>
              <p className="text-sm font-semibold" style={{ color: "#34C759" }}>
                Ditt daglige mål: ca. {beregnDagsmål(kjønn, Number(alder), Number(vekt), aktivitet)} kcal
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(52,199,89,0.7)" }}>
                Ca. 600 kcal underskudd — godt tempo for vektnedgang.
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  const aktivtSteg = stegInnhold[steg];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "linear-gradient(160deg, #1C3A28 0%, #0D1F14 100%)" }}
    >
      {/* Topp-rad */}
      <div className="flex items-center gap-3 px-5 pt-14">
        {steg > 0 ? (
          <button
            onClick={() => setSteg(steg - 1)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-opacity active:opacity-60"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <svg className="h-4 w-4" fill="none" stroke="rgba(255,255,255,0.8)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="h-9 w-9 flex-shrink-0" />
        )}

        {/* Progress */}
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: antallSteg }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= steg ? "#34C759" : "rgba(255,255,255,0.15)" }}
            />
          ))}
        </div>

        <button
          onClick={fullFør}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-opacity active:opacity-60"
          style={{ background: "rgba(255,255,255,0.1)" }}
          title="Hopp over"
        >
          <svg className="h-4 w-4" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Innhold */}
      <div className="flex flex-1 flex-col px-6 pt-10">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#fff", letterSpacing: "-0.02em" }}
        >
          {aktivtSteg.tittel}
        </h2>
        <p className="mt-2 text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
          {aktivtSteg.undertittel}
        </p>
        <div className="mt-8">{aktivtSteg.innhold}</div>
      </div>

      {/* Neste-knapp */}
      <div className="px-6 pb-14">
        <button
          onClick={() => {
            if (steg < antallSteg - 1) setSteg(steg + 1);
            else fullFør();
          }}
          disabled={!aktivtSteg.kanGåVidere}
          className="w-full rounded-2xl py-4 text-base font-semibold text-white transition-all active:scale-95 disabled:opacity-25"
          style={{ background: "#34C759" }}
        >
          {steg < antallSteg - 1 ? "Neste" : "Start"}
        </button>
      </div>
    </div>
  );
}
