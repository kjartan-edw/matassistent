"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setFeil(`Serverfeil ${res.status}${txt ? ": " + txt.slice(0, 120) : ""}`);
        return;
      }

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
    } catch (e) {
      setFeil("Nettverksfeil: " + (e instanceof Error ? e.message : String(e)));
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
    <div className="flex h-dvh flex-col" style={{ background: "#F5F5F7" }}>
      {visOnboarding && <Onboarding onFerdig={() => setVisOnboarding(false)} />}

      {/* Header med frosted glass */}
      <header
        className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
        style={{
          background: "rgba(245,245,247,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Link
          href="/app"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity active:opacity-60"
          style={{ background: "rgba(0,0,0,0.06)" }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#1d1d1f" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <h1 className="text-base font-semibold" style={{ color: "#1d1d1f", letterSpacing: "-0.01em" }}>I dag</h1>

        <Link href="/app" className="flex h-9 w-9 items-center justify-center rounded-full text-lg" style={{ background: "#e8f8ed" }}>
          🥗
        </Link>
      </header>

      <DagStatus status={status} antallMåltider={dagensMåltider.length} />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tidligereMåltider.length > 0 && (
          <button
            onClick={() => setVisHistorikk((v) => !v)}
            className="mb-4 w-full rounded-2xl py-2.5 text-sm font-medium transition-colors"
            style={{ color: "#86868b", background: "rgba(0,0,0,0.04)" }}
          >
            {visHistorikk ? "Skjul tidligere dager ↑" : `Se tidligere dager (${tidligereMåltider.length} måltider) ↓`}
          </button>
        )}

        {dagensMåltider.length === 0 && !loading && (
          <div className="mt-12 text-center px-4">
            <div
              className="inline-flex h-16 w-16 items-center justify-center rounded-3xl text-3xl mb-4"
              style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
            >
              🍽️
            </div>
            <p className="font-medium" style={{ color: "#1d1d1f" }}>Hva spiser du?</p>
            <p className="mt-1 text-sm" style={{ color: "#86868b" }}>Ta bilde eller skriv hva du spiser</p>
          </div>
        )}

        {Object.entries(grupper).map(([dato, måltider]) => (
          <div key={dato} className="mb-6">
            <p
              className="mb-3 text-center text-xs font-medium capitalize"
              style={{ color: "#86868b" }}
            >
              {dato}
            </p>
            <div className="space-y-3">
              {måltider.map((m) => (
                <div key={m.id} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] space-y-2">
                      {m.imagePreview && (
                        <img
                          src={m.imagePreview}
                          alt="Måltid"
                          className="ml-auto h-40 w-40 rounded-2xl object-cover"
                          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
                        />
                      )}
                      {m.text && (
                        <div
                          className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white"
                          style={{ background: "#1d1d1f" }}
                        >
                          {m.text}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div
                      className="prose prose-sm max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm"
                      style={{ background: "#fff", color: "#1d1d1f", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
                    >
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
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3"
              style={{ background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
            >
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full" style={{ background: "#86868b", animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full" style={{ background: "#86868b", animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full" style={{ background: "#86868b", animationDelay: "300ms" }} />
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
