"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import MåltidInput from "@/components/MåltidInput";
import DagStatus from "@/components/DagStatus";
import Onboarding from "@/components/Onboarding";
import { hentMåltider, lagreMåltid, sisteStatus, hentProfil, Måltid } from "@/lib/storage";

export default function Home() {
  const [alleMåltider, setAlleMåltider] = useState<Måltid[]>([]);
  const [loading, setLoading] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);
  const [visOnboarding, setVisOnboarding] = useState(false);
  const [visHistorikk, setVisHistorikk] = useState(false);
  const bunnenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAlleMåltider(hentMåltider());
    if (!hentProfil()) setVisOnboarding(true);
  }, []);

  useEffect(() => {
    bunnenRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [alleMåltider]);

  const dagensMåltider = alleMåltider.filter(
    (m) => new Date(m.timestamp).toDateString() === new Date().toDateString()
  );
  const status = sisteStatus(dagensMåltider);

  async function sendMåltid(text: string, image?: File, imagePreview?: string) {
    setLoading(true);
    setFeil(null);

    const formData = new FormData();
    if (text) formData.append("text", text);
    if (image) formData.append("image", image);
    formData.append("history", JSON.stringify(alleMåltider));
    const profil = hentProfil();
    if (profil) formData.append("profil", JSON.stringify(profil));

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) {
        setFeil(data.error);
        return;
      }

      const nyttMåltid: Måltid = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        text: text || undefined,
        imagePreview: imagePreview || undefined,
        response: data.feedback,
        dagsstatus: data.dagsstatus,
      };

      lagreMåltid(nyttMåltid);
      setAlleMåltider(hentMåltider());
    } catch {
      setFeil("Kunne ikke nå serveren. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  const idagStr = new Date().toDateString();

  function grupperPåDato(måltider: Måltid[]) {
    const grupper: Record<string, Måltid[]> = {};
    for (const m of måltider) {
      const dato = new Date(m.timestamp).toLocaleDateString("no-NO", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!grupper[dato]) grupper[dato] = [];
      grupper[dato].push(m);
    }
    return grupper;
  }

  const tidligereMåltider = alleMåltider.filter(
    (m) => new Date(m.timestamp).toDateString() !== idagStr
  );
  const synligeMåltider = visHistorikk ? alleMåltider : dagensMåltider;
  const grupper = grupperPåDato(synligeMåltider);

  return (
    <div className="flex h-dvh flex-col bg-white">
      {visOnboarding && <Onboarding onFerdig={() => setVisOnboarding(false)} />}
      <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Matassistent</h1>
          <p className="text-xs text-gray-400">Din daglige spise-coach</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-lg">
          🥗
        </div>
      </header>

      <DagStatus status={status} antallMåltider={dagensMåltider.length} />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Historikk-knapp */}
        {tidligereMåltider.length > 0 && (
          <button
            onClick={() => setVisHistorikk((v) => !v)}
            className="mb-4 w-full rounded-xl py-2 text-sm text-gray-400 hover:text-gray-600"
          >
            {visHistorikk ? "Skjul tidligere dager ↑" : `Se tidligere dager (${tidligereMåltider.length} måltider) ↓`}
          </button>
        )}

        {dagensMåltider.length === 0 && !loading && (
          <div className="mt-8 text-center">
            <p className="text-4xl">🍽️</p>
            <p className="mt-3 text-gray-500">Ta bilde av maten din eller skriv hva du spiser</p>
            <p className="mt-1 text-sm text-gray-400">Du får umiddelbar og praktisk feedback</p>
          </div>
        )}

        {Object.entries(grupper).map(([dato, måltider]) => (
          <div key={dato} className="mb-6">
            <p className="mb-3 text-center text-xs font-medium capitalize text-gray-400">{dato}</p>
            <div className="space-y-4">
              {måltider.map((m) => (
                <div key={m.id} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] space-y-2">
                      {m.imagePreview && (
                        <img
                          src={m.imagePreview}
                          alt="Måltid"
                          className="ml-auto h-40 w-40 rounded-2xl object-cover"
                        />
                      )}
                      {m.text && (
                        <div className="rounded-2xl rounded-tr-sm bg-green-500 px-4 py-2 text-sm text-white">
                          {m.text}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="prose prose-sm prose-gray max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-sm text-gray-800">
                      <ReactMarkdown>{m.response}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {feil && (
          <div className="mt-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {feil}
          </div>
        )}

        <div ref={bunnenRef} />
      </div>

      <MåltidInput onSend={sendMåltid} loading={loading} />
    </div>
  );
}
