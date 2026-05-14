import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const client = new Anthropic();

const SYSTEM_PROMPT = `Du er en praktisk og vennlig spise-assistent for folk som vil ned 5–15 kg. Du hjelper med hverdagsbeslutninger rundt mat.

TONE:
- Kort, direkte og varm
- Aldri moraliserende eller streng
- Realistisk og kontekstuelt
- Norsk alltid

SVAR FORMAT:
1. Én setning vurdering av måltidet (maks 15 ord)
2. 1-2 konkrete råd (hvis aktuelt)
3. Estimater for DETTE måltidet + melding om dagen

ESTIMAT FORMAT (alltid til slutt, som JSON inni <estimat> tags):
<estimat>
{
  "kcal": 350,
  "protein": 8,
  "melding": "Du har god plass til middag"
}
</estimat>

REGLER FOR ESTIMATER:
- kcal og protein gjelder KUN dette ene måltidet du ser/leser om nå
- Appen summerer totalen for hele dagen selv — du trenger ikke tenke på det
- Vær realistisk: grønn te = 2 kcal, 0g protein. En skyr = 130 kcal, 11g protein
- meldingen skal handle om hele dagen basert på akkumulert kontekst du får
- Aldri gi høye protein-estimater for mat uten protein

REGLER:
- Bruk brukerprofil (hvis tilgjengelig) for å tilpasse råd
- Typisk mål: 1400–1800 kcal/dag, 80–120g protein/dag for vektnedgang
- Vær oppmuntrende når de gjør gode valg`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get("text") as string | null;
    const image = formData.get("image") as File | null;
    const profilJson = formData.get("profil") as string | null;
    const totalerJson = formData.get("dagTotaler") as string | null;

    const profil = profilJson ? JSON.parse(profilJson) : null;
    const totaler = totalerJson ? JSON.parse(totalerJson) : null;

    const profilKontekst = profil
      ? `BRUKERPROFIL: ${profil.kjønn}, ${profil.høyde}cm, ${profil.nåværendeVekt}kg → mål ${profil.målvekt}kg`
      : "";

    const dagKontekst = totaler
      ? `AKKUMULERT I DAG (beregnet av appen): ca. ${totaler.kcal} kcal, ca. ${totaler.protein}g protein`
      : "FØRSTE MÅLTID I DAG: ingen tidligere inntak";

    const contextText = `${profilKontekst}\n${dagKontekst}\n\nNytt måltid: ${text || "se bilde"}`;

    type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    type ContentBlock =
      | { type: "text"; text: string }
      | { type: "image"; source: { type: "base64"; media_type: ImageMediaType; data: string } };

    const content: ContentBlock[] = [];

    if (image) {
      const bytes = await image.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: (image.type as ImageMediaType) || "image/jpeg",
          data: base64,
        },
      });
    }

    content.push({ type: "text", text: contextText });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const estimatMatch = responseText.match(/<estimat>([\s\S]*?)<\/estimat>/);
    let estimater = null;
    let melding = "";
    let feedbackText = responseText;

    if (estimatMatch) {
      try {
        const parsed = JSON.parse(estimatMatch[1]);
        estimater = { kcal: parsed.kcal ?? 0, protein: parsed.protein ?? 0 };
        melding = parsed.melding ?? "";
        feedbackText = responseText.replace(/<estimat>[\s\S]*?<\/estimat>/, "").trim();
      } catch {
        // keep raw text if parse fails
      }
    }

    return NextResponse.json({ feedback: feedbackText, estimater, melding });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
