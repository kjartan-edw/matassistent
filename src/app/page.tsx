import Link from "next/link";

export default function Forside() {
  return (
    <div className="min-h-dvh" style={{ background: "#F5F5F7" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto">
        <span className="text-base font-semibold" style={{ color: "#1d1d1f" }}>Matassistent</span>
        <Link
          href="/app"
          className="rounded-full px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "#1d1d1f", color: "#fff" }}
        >
          Åpne appen
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-10 pb-4 text-center max-w-lg mx-auto">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-8"
          style={{ background: "#e8f8ed", color: "#248A3D" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Gratis å prøve · Ingen konto
        </div>

        <h1
          className="text-5xl font-bold leading-tight"
          style={{ color: "#1d1d1f", letterSpacing: "-0.03em" }}
        >
          Ned i vekt.<br />
          <span style={{ color: "#34C759" }}>Uten styr.</span>
        </h1>

        <p className="mt-5 text-lg leading-relaxed" style={{ color: "#86868b" }}>
          Ta bilde av maten. Få et personlig kalorimål. Se om du er på rett kurs — én dag av gangen.
        </p>

        <Link
          href="/app"
          className="mt-8 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white transition-transform active:scale-95"
          style={{ background: "#34C759" }}
        >
          Kom i gang
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </section>

      {/* Vektkurve-grafik */}
      <section className="px-8 py-6 max-w-sm mx-auto">
        <div
          className="rounded-3xl px-6 pt-5 pb-4"
          style={{ background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}
        >
          <div className="flex items-end justify-between mb-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#86868b" }}>Vekt</p>
              <p className="text-2xl font-bold mt-0.5" style={{ color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                −8 <span className="text-base font-medium" style={{ color: "#34C759" }}>kg</span>
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "#e8f8ed", color: "#248A3D" }}
            >
              På rett kurs ↓
            </span>
          </div>

          {/* SVG kurve */}
          <svg viewBox="0 0 280 90" fill="none" className="w-full mt-3" aria-hidden="true">
            <defs>
              <linearGradient id="kurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34C759" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#34C759" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Horisontale hjelpeliner */}
            <line x1="0" y1="20" x2="280" y2="20" stroke="#f0f0f5" strokeWidth="1"/>
            <line x1="0" y1="45" x2="280" y2="45" stroke="#f0f0f5" strokeWidth="1"/>
            <line x1="0" y1="70" x2="280" y2="70" stroke="#f0f0f5" strokeWidth="1"/>
            {/* Fylte areal */}
            <path
              d="M0 12 C30 14, 55 20, 80 28 C105 36, 125 38, 155 46 C180 53, 210 60, 240 66 L270 72 L270 90 L0 90 Z"
              fill="url(#kurveGrad)"
            />
            {/* Linja */}
            <path
              d="M0 12 C30 14, 55 20, 80 28 C105 36, 125 38, 155 46 C180 53, 210 60, 240 66 L270 72"
              stroke="#34C759"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Start-punkt */}
            <circle cx="0" cy="12" r="3.5" fill="#34C759"/>
            {/* Slutt-punkt med ring */}
            <circle cx="270" cy="72" r="5" fill="#fff" stroke="#34C759" strokeWidth="2.5"/>
            <circle cx="270" cy="72" r="2.5" fill="#34C759"/>
          </svg>

          <div className="flex justify-between mt-2">
            <p className="text-xs" style={{ color: "#86868b" }}>Januar</p>
            <p className="text-xs" style={{ color: "#86868b" }}>I dag</p>
          </div>
        </div>
      </section>

      {/* Slik fungerer det */}
      <section className="px-6 pt-4 pb-6 max-w-sm mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#86868b" }}>
          Slik fungerer det
        </p>
        <div className="space-y-3">
          {[
            {
              svg: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              ),
              tittel: "Bilde eller tekst",
              tekst: "Ta bilde av tallerkenen — eller skriv hva du spiser. AI-en forstår begge.",
            },
            {
              svg: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3"/>
                  <line x1="12" y1="2" x2="12" y2="5"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="2" y1="12" x2="5" y2="12"/>
                  <line x1="19" y1="12" x2="22" y2="12"/>
                </svg>
              ),
              tittel: "Personlig kalorimål",
              tekst: "Vi beregner ditt daglige mål basert på kjønn, alder og vekt. Du ser alltid hvor du står.",
            },
            {
              svg: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                  <polyline points="16 7 22 7 22 13"/>
                </svg>
              ),
              tittel: "Retning, ikke perfeksjon",
              tekst: "Ingen kalorikalkulator. Bare: er dette et bra valg akkurat nå?",
            },
          ].map(({ svg, tittel, tekst }) => (
            <div
              key={tittel}
              className="flex items-start gap-4 rounded-2xl p-5"
              style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: "#e8f8ed" }}
              >
                {svg}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#1d1d1f" }}>{tittel}</p>
                <p className="text-sm mt-0.5" style={{ color: "#86868b" }}>{tekst}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bunn-CTA */}
      <section className="px-6 pb-20 max-w-sm mx-auto text-center">
        <Link
          href="/app"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white transition-transform active:scale-95"
          style={{ background: "#1d1d1f" }}
        >
          Start din reise i dag
        </Link>
        <p className="mt-3 text-xs" style={{ color: "#86868b" }}>
          Ingen konto · Ingen kredittkort · Fungerer på mobil
        </p>
      </section>

    </div>
  );
}
