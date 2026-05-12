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
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700">Hva er kjønnet ditt?</p>
          <div className="grid grid-cols-3 gap-3">
            {(["mann", "kvinne", "annet"] as const).map((k) => (
              <button
                key={k}
                onClick={() => oppdater({ kjønn: k })}
                className={`rounded-2xl border-2 py-4 text-sm font-medium capitalize transition ${
                  profil.kjønn === k
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Høyde (cm)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="175"
              defaultValue={profil.høyde || ""}
              onChange={(e) => oppdater({ høyde: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-green-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nåværende vekt (kg)
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="85"
              defaultValue={profil.nåværendeVekt || ""}
              onChange={(e) => oppdater({ nåværendeVekt: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-green-400 focus:outline-none"
            />
          </div>
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
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Målvekt (kg)
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="73"
              defaultValue={profil.målvekt || ""}
              onChange={(e) => oppdater({ målvekt: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-green-400 focus:outline-none"
            />
          </div>
          {profil.nåværendeVekt && profil.målvekt && profil.målvekt < profil.nåværendeVekt && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {profil.nåværendeVekt - profil.målvekt} kg å jobbe med — veldig realistisk mål.
            </div>
          )}
        </div>
      ),
      kanGåVidere: !!profil.målvekt,
    },
  ];

  const aktivtSteg = stegConfig[steg];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Fremgangsbar */}
      <div className="flex gap-1 px-4 pt-12">
        {stegConfig.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= steg ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col px-6 pt-10">
        <h2 className="text-2xl font-bold text-gray-900">{aktivtSteg.tittel}</h2>
        <p className="mt-2 text-gray-500">{aktivtSteg.undertittel}</p>

        <div className="mt-8">{aktivtSteg.innhold}</div>
      </div>

      <div className="px-6 pb-12">
        <button
          onClick={() => {
            if (steg < stegConfig.length - 1) setSteg(steg + 1);
            else fullFør();
          }}
          disabled={!aktivtSteg.kanGåVidere}
          className="w-full rounded-2xl bg-green-500 py-4 text-base font-semibold text-white transition hover:bg-green-600 disabled:opacity-40"
        >
          {steg < stegConfig.length - 1 ? "Neste" : "Start"}
        </button>
        {steg === 0 && (
          <button
            onClick={fullFør}
            className="mt-3 w-full py-2 text-sm text-gray-400"
          >
            Hopp over
          </button>
        )}
      </div>
    </div>
  );
}
