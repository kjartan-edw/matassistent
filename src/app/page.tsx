import Link from "next/link";

export default function Forside() {
  return (
    <div className="min-h-dvh" style={{ background: "#F5F5F7" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto">
        <span className="text-base font-semibold" style={{ color: "#1d1d1f" }}>Matassistent</span>
        <Link
          href="/app"
          className="rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
          style={{ background: "#1d1d1f" }}
        >
          Åpne appen
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-12 pb-16 text-center max-w-lg mx-auto">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-6"
          style={{ background: "#e8f8ed", color: "#248A3D" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Gratis å prøve
        </div>

        <h1
          className="text-4xl font-bold leading-tight tracking-tight"
          style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}
        >
          Spis smartere.<br />
          <span style={{ color: "#34C759" }}>Uten å telle.</span>
        </h1>

        <p className="mt-5 text-lg leading-relaxed" style={{ color: "#86868b" }}>
          Ta bilde av maten din og få umiddelbar, konkret tilbakemelding. AI-assistenten din kjenner dagen din og hjelper deg ta bedre valg.
        </p>

        <Link
          href="/app"
          className="mt-8 inline-flex w-full max-w-xs items-center justify-center rounded-2xl py-4 text-base font-semibold text-white shadow-lg transition-transform active:scale-95"
          style={{ background: "linear-gradient(135deg, #34C759 0%, #30D158 100%)" }}
        >
          Kom i gang gratis →
        </Link>
        <p className="mt-3 text-xs" style={{ color: "#86868b" }}>Ingen konto. Ingen kredittkort.</p>
      </section>

      {/* Mock-skjermbilde */}
      <section className="px-6 pb-12 max-w-sm mx-auto">
        <div
          className="rounded-3xl p-5 shadow-xl"
          style={{ background: "#fff" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#34C759" }}>I dag</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { ikon: "🔥", label: "Inntak", verdi: "Moderat" },
              { ikon: "✅", label: "Protein", verdi: "Bra" },
            ].map(({ ikon, label, verdi }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: "#F5F5F7" }}>
                <p className="text-xs" style={{ color: "#86868b" }}>{ikon} {label}</p>
                <p className="font-semibold text-sm mt-0.5" style={{ color: "#1d1d1f" }}>{verdi}</p>
              </div>
            ))}
          </div>
          <p className="text-sm" style={{ color: "#86868b" }}>Du har fint rom for en god middag 👌</p>

          <div className="mt-4 space-y-2">
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white max-w-[80%]" style={{ background: "#1d1d1f" }}>
                Grillet laks med salat
              </div>
            </div>
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[80%] shadow-sm" style={{ background: "#F5F5F7", color: "#1d1d1f" }}>
                Utmerket valg. Laks gir deg omega-3 og god protein til kvelden.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 max-w-sm mx-auto space-y-3">
        {[
          { ikon: "📷", tittel: "Bilde eller tekst", tekst: "Ta bilde av tallerkenen — eller skriv én setning. AI-en forstår begge." },
          { ikon: "🧠", tittel: "Kontekstuell feedback", tekst: "Appen vet hva du har spist i dag og gir råd deretter." },
          { ikon: "📈", tittel: "Retning, ikke perfeksjon", tekst: "Ingen kalorikalkulator. Bare: er dette et bra valg akkurat nå?" },
        ].map(({ ikon, tittel, tekst }) => (
          <div
            key={tittel}
            className="flex items-start gap-4 rounded-2xl p-5"
            style={{ background: "#fff" }}
          >
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
              style={{ background: "#F5F5F7" }}
            >
              {ikon}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#1d1d1f" }}>{tittel}</p>
              <p className="text-sm mt-0.5" style={{ color: "#86868b" }}>{tekst}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
