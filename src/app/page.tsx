import Link from "next/link";

export default function Forside() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥗</span>
          <span className="text-base font-semibold text-gray-900">Matassistent</span>
        </div>
        <Link
          href="/app"
          className="rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Åpne appen
        </Link>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-4xl">
          🍽️
        </div>
        <h1 className="max-w-xs text-3xl font-bold leading-tight text-gray-900">
          Bedre matvaner,<br />uten stresset
        </h1>
        <p className="mt-4 max-w-sm text-gray-500">
          Ta bilde av maten din og få umiddelbar, konkret tilbakemelding. Ingen kaloritelling — bare gode beslutninger.
        </p>

        <Link
          href="/app"
          className="mt-8 w-full max-w-xs rounded-2xl bg-green-500 py-4 text-base font-semibold text-white shadow-sm hover:bg-green-600"
        >
          Prøv gratis →
        </Link>
        <p className="mt-3 text-xs text-gray-400">Ingen konto nødvendig</p>
      </main>

      {/* Tre punkter */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-sm space-y-4">
          {[
            { ikon: "📷", tittel: "Ta bilde", tekst: "Bilde av tallerkenen din — det er alt" },
            { ikon: "🤖", tittel: "Få feedback", tekst: "AI-en vurderer måltidet i kontekst av hele dagen" },
            { ikon: "📊", tittel: "Forstå dagen", tekst: "Se om du ligger lavt, moderat eller høyt" },
          ].map(({ ikon, tittel, tekst }) => (
            <div key={tittel} className="flex items-start gap-4 rounded-2xl bg-gray-50 px-5 py-4">
              <span className="text-2xl">{ikon}</span>
              <div>
                <p className="font-semibold text-gray-900">{tittel}</p>
                <p className="text-sm text-gray-500">{tekst}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
