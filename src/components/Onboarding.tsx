"use client";

import { useState } from "react";
import { lagreProfil, Brukerprofil } from "@/lib/storage";

interface Props {
  onFerdig: () => void;
}

export default function Onboarding({ onFerdig }: Props) {
  const [steg, setSteg] = useState(0);
  const [profil, setProfil] = useState<Partial<Brukerprofil>>({});

  function oppdater(felt: Partial<Brukerprofil>) {
    setProfil((p) => ({ ...p, ...felt }));
  }

  function fullFør() {
    lagreProfil(profil as Brukerprofil);
    onFerdig();
  }

  const stegConfig = [
    {
      tittel: "Hei! La oss bli kjent.",
      undertittel: "Tre raske spørsmål, så er vi i gang.",
      innhold: (
        <div className="space-y-3">
          <p className="text-sm font-medium" style={{ color: "#86868b" }}>Hva er kjønnet ditt?</p>
          <div className="grid grid-cols-3 gap-3">
            {(["mann", "kvinne", "annet"] as const).map((k) => (
              <button
                key={k}
                onClick={() => oppdater({ kjønn: k })}
                className="rounded-2xl border-2 py-4 text-sm font-semibold capitalize transition-all"
                style={{
                  borderColor: profil.kjønn === k ? "#34C759" : "rgba(0,0,0,0.08)",
                  background: profil.kjønn === k ? "#e8f8ed" : "#fff",
                  color: profil.kjønn === k ? "#248A3D" : "#1d1d1f",
                }}
              >
                {k === "mann" ? "Mann" : k === "kvinne" ? "Kvinne" : "Annet"}
              </button>
            ))}
          </div>
        </div>
      ),
      kanGåVidere: !!profil.kjønn,
    },
    {
      tittel: "Høyde og vekt",
      undertittel: "Brukes kun for å gi deg bedre råd.",
      innhold: (
        <div className="space-y-4">
          {[
            { label: "Høyde (cm)", felt: "høyde" as keyof Brukerprofil, placeholder: "175" },
            { label: "Nåværende vekt (kg)", felt: "nåværendeVekt" as keyof Brukerprofil, placeholder: "85" },
          ].map(({ label, felt, placeholder }) => (
            <div key={felt}>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#1d1d1f" }}>{label}</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder={placeholder}
                defaultValue={(profil[felt] as number) || ""}
                onChange={(e) => oppdater({ [felt]: Number(e.target.value) })}
                className="w-full rounded-2xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{ background: "#F5F5F7", border: "none", color: "#1d1d1f" }}
              />
            </div>
          ))}
        </div>
      ),
      kanGåVidere: !!profil.høyde && !!profil.nåværendeVekt,
    },
    {
      tittel: "Hva er målet ditt?",
      undertittel: "Vi hjelper deg å komme dit, ett måltid av gangen.",
      innhold: (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "#1d1d1f" }}>Målvekt (kg)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="73"
              defaultValue={profil.målvekt || ""}
              onChange={(e) => oppdater({ målvekt: Number(e.target.value) })}
              className="w-full rounded-2xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
              style={{ background: "#F5F5F7", border: "none", color: "#1d1d1f" }}
            />
          </div>
          {profil.nåværendeVekt && profil.målvekt && profil.målvekt < profil.nåværendeVekt && (() => {
            const diff = profil.nåværendeVekt! - profil.målvekt!;
            const melding =
              diff <= 5  ? "Fin justering — dette går fort med riktige vaner."
              : diff <= 10 ? "Godt mål — realistisk å nå på noen måneder."
              : diff <= 20 ? "Et skikkelig prosjekt — vi tar det ett måltid av gangen."
              : "En livsstilsreise — vi fokuserer på retning, ikke perfeksjon.";
            return (
              <div className="rounded-2xl px-4 py-3.5" style={{ background: "#e8f8ed" }}>
                <p className="text-sm font-semibold" style={{ color: "#248A3D" }}>{diff} kg å gå.</p>
                <p className="text-sm mt-0.5" style={{ color: "#34C759" }}>{melding}</p>
              </div>
            );
          })()}
        </div>
      ),
      kanGåVidere: !!profil.målvekt,
    },
  ];

  const aktivtSteg = stegConfig[steg];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#F5F5F7" }}>
      {/* Progress */}
      <div className="flex gap-1.5 px-6 pt-14">
        {stegConfig.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= steg ? "#34C759" : "rgba(0,0,0,0.1)" }}
          />
        ))}
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

      <div className="px-6 pb-12 space-y-3">
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
        {steg === 0 && (
          <button onClick={fullFør} className="w-full py-2 text-sm" style={{ color: "#86868b" }}>
            Hopp over
          </button>
        )}
      </div>
    </div>
  );
}
