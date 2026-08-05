import Link from "next/link";

const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;
const RING_FILL = RING_C * 0.71;

export default function Forside() {
  return (
    <div className="min-h-dvh overflow-x-hidden" style={{ background: "#F2F2F7" }}>

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
      <section className="px-6 pt-8 pb-2 text-center max-w-lg mx-auto">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-7"
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

        <p className="mt-4 text-lg leading-relaxed" style={{ color: "#86868b" }}>
          Ta bilde av maten. Få et personlig kalorimål. Se om du er på rett kurs — én dag av gangen.
        </p>

        <Link
          href="/app"
          className="mt-7 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white transition-transform active:scale-95"
          style={{ background: "#34C759" }}
        >
          Kom i gang
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      {/* Telefon-mockup */}
      <section className="flex justify-center py-8 px-4">
        <svg
          viewBox="0 0 240 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full drop-shadow-2xl"
          style={{ maxWidth: 260 }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="phoneBody" x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0%" stopColor="#2d2d2d" />
              <stop offset="100%" stopColor="#0f0f0f" />
            </linearGradient>
            <linearGradient id="heroGrad" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#1C3A28" />
              <stop offset="100%" stopColor="#0D1F14" />
            </linearGradient>
            <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.09)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <clipPath id="screenClip">
              <rect x="11" y="11" width="218" height="478" rx="30" />
            </clipPath>
          </defs>

          {/* Telefon-kropp */}
          <rect x="1" y="1" width="238" height="498" rx="42" fill="url(#phoneBody)" />
          <rect x="1" y="1" width="238" height="498" rx="42" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Sideknapper */}
          <rect x="-1" y="105" width="3" height="28" rx="1.5" fill="#333" />
          <rect x="-1" y="144" width="3" height="48" rx="1.5" fill="#333" />
          <rect x="-1" y="202" width="3" height="48" rx="1.5" fill="#333" />
          <rect x="238" y="130" width="3" height="56" rx="1.5" fill="#333" />

          {/* Skjerm-bakgrunn */}
          <rect x="11" y="11" width="218" height="478" rx="30" fill="#F2F2F7" />

          <g clipPath="url(#screenClip)">
            {/* Hero-seksjon */}
            <rect x="11" y="11" width="218" height="212" fill="url(#heroGrad)" />

            {/* Dynamic island */}
            <rect x="91" y="19" width="58" height="15" rx="7.5" fill="#000" />

            {/* Header */}
            <text x="120" y="52" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">I dag</text>

            {/* Stor kcal-tekst */}
            <text x="22" y="103" fill="white" fontSize="28" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="-1">1 250</text>
            <text x="22" y="118" fill="rgba(255,255,255,0.35)" fontSize="9.5" fontFamily="system-ui, sans-serif">av 1 750 kcal · 500 igjen</text>

            {/* Kaloriring */}
            <circle cx="178" cy="103" r={RING_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9" />
            <circle
              cx="178" cy="103" r={RING_R}
              fill="none" stroke="#34C759" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={`${RING_FILL} ${RING_C}`}
              transform="rotate(-90 178 103)"
            />
            <text x="178" y="107" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">71%</text>

            {/* Stats-rad */}
            {[
              { x: 22, label: "Protein", verdi: "68g" },
              { x: 90, label: "Måltider", verdi: "3" },
              { x: 158, label: "Igjen", verdi: "500" },
            ].map(({ x, label, verdi }) => (
              <g key={label}>
                <rect x={x} y="144" width="56" height="42" rx="10" fill="rgba(255,255,255,0.08)" />
                <text x={x + 28} y="160" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7.5" fontFamily="system-ui, sans-serif">{label}</text>
                <text x={x + 28} y="177" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="system-ui, sans-serif">{verdi}</text>
              </g>
            ))}

            {/* Chat-dato */}
            <text x="120" y="236" textAnchor="middle" fill="#86868b" fontSize="8.5" fontFamily="system-ui, sans-serif">Torsdag 15. mai</text>

            {/* Bruker-boble */}
            <rect x="96" y="246" width="122" height="38" rx="14" fill="#1d1d1f" />
            <text x="157" y="263" textAnchor="middle" fill="white" fontSize="9" fontFamily="system-ui, sans-serif">Havregrøt med bær</text>
            <text x="157" y="277" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="system-ui, sans-serif">og litt honning</text>

            {/* Assistent-boble */}
            <rect x="14" y="294" width="162" height="58" rx="14" fill="white" />
            <text x="24" y="312" fill="#1d1d1f" fontSize="8.5" fontFamily="system-ui, sans-serif">Solid frokost! Fibrene gir</text>
            <text x="24" y="326" fill="#1d1d1f" fontSize="8.5" fontFamily="system-ui, sans-serif">god metthet til formiddagen.</text>
            <text x="24" y="341" fill="#34C759" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">+310 kcal · 12g protein</text>

            {/* Bruker-boble 2 */}
            <rect x="110" y="364" width="108" height="38" rx="14" fill="#1d1d1f" />
            <text x="164" y="381" textAnchor="middle" fill="white" fontSize="9" fontFamily="system-ui, sans-serif">Kylling og salat</text>
            <text x="164" y="395" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="system-ui, sans-serif">til lunsj</text>

            {/* Assistent-boble 2 */}
            <rect x="14" y="412" width="148" height="58" rx="14" fill="white" />
            <text x="24" y="430" fill="#1d1d1f" fontSize="8.5" fontFamily="system-ui, sans-serif">Bra valg — protein og grønt.</text>
            <text x="24" y="444" fill="#1d1d1f" fontSize="8.5" fontFamily="system-ui, sans-serif">Du er på rett kurs i dag.</text>
            <text x="24" y="459" fill="#34C759" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">+420 kcal · 38g protein</text>

            {/* Glanseffekt */}
            <rect x="11" y="11" width="218" height="478" rx="30" fill="url(#shineGrad)" />
          </g>

          {/* Hjem-indikator */}
          <rect x="85" y="484" width="70" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
        </svg>
      </section>

      {/* Slik fungerer det */}
      <section className="px-6 pt-2 pb-6 max-w-sm mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#86868b" }}>
          Slik fungerer det
        </p>
        <div className="space-y-3">
          {[
            {
              svg: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              ),
              tittel: "Bilde eller tekst",
              tekst: "Ta bilde av tallerkenen — eller skriv hva du spiser. AI-en forstår begge.",
            },
            {
              svg: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                </svg>
              ),
              tittel: "Personlig kalorimål",
              tekst: "Vi beregner ditt daglige mål basert på kjønn, alder og aktivitet.",
            },
            {
              svg: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ),
              tittel: "Ærlig tilbakemelding",
              tekst: "En venn som er ernæringsfysiolog — ikke en app som sier at alt er bra.",
            },
          ].map(({ svg, tittel, tekst }) => (
            <div
              key={tittel}
              className="flex items-start gap-4 rounded-2xl p-5"
              style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "#e8f8ed" }}>
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
          className="inline-flex w-full items-center justify-center rounded-2xl py-4 text-base font-semibold text-white transition-transform active:scale-95"
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
