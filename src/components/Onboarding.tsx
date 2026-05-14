"use client";

import { useState } from "react";
import { lagreProfil, Brukerprofil, beregnDagsmål } from "@/lib/storage";

interface Props {
  onFerdig: () => void;
}

export default function Onboarding({ onFerdig }: Props) {
  const [steg, setSteg] = useState(0);
  const [kjønn, setKjønn] = useState<Brukerprofil["kjønn"] | null>(null);
  const [alder, setAlder] = useState<string>("");
  const [vekt, setVekt] = useState<string>("");

  function fullFør() {
    if (kjønn && Number(alder) > 0 && Number(vekt) > 0) {
      const dagsmål = beregnDagsmål(kjønn, Number(alder), Number(vekt));
      lagreProfil({ kjønn, alder: Number(alder), vekt: Number(vekt), dagsmål });
    }
    onFerdig();
  }

  const kalkulertMål =
    kjønn && Number(alder) > 0 && Number(vekt) > 0
      ? beregnDagsmål(kjønn, Number(alder), Number(vekt))
      : null;

  const stegConfig = [
    {
      tittel: "Hei! La oss bli kjent.",
      undertittel: "Tre raske spørsmål, så setter vi et personlig mål.",
      innhold: (
        <div className="space-y-3">
          <p className="text-sm font-medium" style={{ color: "#86868b" }}>Hva er kjønnet ditt?</p>
          <div className="grid grid-cols-3 gap-3">
            {(["mann", "kvinne", "annet"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKjønn(k)}
                className="rounded-2xl border-2 py-4 text-sm font-semibold capitalize transition-all"
                style={{
                  borderColor: kjønn === k ? "#34C759" : "rgba(0,0,0,0.08)",
                  background: kjønn === k ? "#e8f8ed" : "#fff",
                  color: kjønn === k ? "#248A3D" : "#1d1d1f",
                }}
              >
                {k === "mann" ? "Mann" : k === "kvinne" ? "Kvinne" : "Annet"}
              </button>
            ))}
          </div>
        </div>
      ),
      kanGåVidere: !!kjønn,
    },
    {
      tittel: "Alder og vekt",
      undertittel: "Vi bruker dette til å sette ditt personlige kalorimål.",
      innhold: (
        <div className="space-y-4">
          {[
            { label: "Alder (år)", value: alder, onChange: setAlder, placeholder: "42" },
            { label: "Vekt (kg)", value: vekt, onChange: setVekt, placeholder: "82" },
          ].map(({ label, value, onChange, placeholder }) => (
            <div key={label}>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#1d1d1f" }}>{label}</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-2xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{ background: "#F5F5F7", border: "none", color: "#1d1d1f" }}
              />
            </div>
          ))}

          {kalkulertMål && (
            <div className="rounded-2xl px-4 py-3.5" style={{ background: "#e8f8ed" }}>
              <p className="text-sm font-semibold" style={{ color: "#248A3D" }}>
                Ditt daglige mål: ca. {kalkulertMål} kcal
              </p>
              <p className="text-sm mt-0.5" style={{ color: "#34C759" }}>
                Passe til å gå ned jevnt uten å sulte seg.
              </p>
            </div>
          )}
        </div>
      ),
      kanGåVidere: Number(alder) > 0 && Number(vekt) > 0,
    },
  ];

  const aktivtSteg = stegConfig[steg];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#F5F5F7" }}>
      {/* Topp-rad: tilbake + progress + lukk */}
      <div className="flex items-center gap-3 px-4 pt-12">
        {steg > 0 ? (
          <button
            onClick={() => setSteg(steg - 1)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(0,0,0,0.06)" }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#1d1d1f" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="h-9 w-9 flex-shrink-0" />
        )}

        <div className="flex flex-1 gap-1.5">
          {stegConfig.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= steg ? "#34C759" : "rgba(0,0,0,0.1)" }}
            />
          ))}
        </div>

        <button
          onClick={fullFør}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
          style={{ background: "rgba(0,0,0,0.06)" }}
          title="Hopp over"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#86868b" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-10">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
        >
          {aktivtSteg.tittel}
        </h2>
        <p className="mt-2 text-base" style={{ color: "#86868b" }}>{aktivtSteg.undertittel}</p>
        <div className="mt-8">{aktivtSteg.innhold}</div>
      </div>

      <div className="px-6 pb-12">
        <button
          onClick={() => {
            if (steg < stegConfig.length - 1) setSteg(steg + 1);
            else fullFør();
          }}
          disabled={!aktivtSteg.kanGåVidere}
          className="w-full rounded-2xl py-4 text-base font-semibold text-white transition-all active:scale-95 disabled:opacity-30"
          style={{ background: "#34C759" }}
        >
          {steg < stegConfig.length - 1 ? "Neste" : "Start"}
        </button>
      </div>
    </div>
  );
}
