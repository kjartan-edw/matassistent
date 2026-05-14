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

SVAR FORMAT (bruk alltid denne strukturen):
1. Én setning vurdering av måltidet (maks 15 ord)
2. 1-2 konkrete råd eller justeringer (hvis aktuelt)
3. Oppdatert dagsstatus

DAGSSTATUS FORMAT (alltid til slutt, som JSON inni <dagsstatus> tags):
<dagsstatus>
{
  "estimertKcal": 850,
  "kcalNivå": "lavt",
  "protein": "bra",
  "romForMer": true,
  "melding": "Du har fint rom for en god middag"
}
</dagsstatus>

kcalNivå: "lavt" | "moderat" | "høyt"
protein: "bra" | "litt lavt" | "lavt"

REGLER:
- Aldri gi eksakte kalorier i teksten, bare estimater og retning
- Fokuser på: er dette et bra valg akkurat nå?
- Ta hensyn til hva som er spist i dag (får du historikk)
- Bruk brukerprofil (hvis tilgjengelig) for å tilpasse kalorianbefaling
- Uten profil: typisk mål 1400–1800 kcal/dag for vektnedgang
- Vær oppmuntrende når de gjør gode valg`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get("text") as string | null;
    const image = formData.get("image") as File | null;
    const historyJson = formData.get("history") as string | null;
    const profilJson = formData.get("profil") as string | null;
    const profil = profilJson ? JSON.parse(profilJson) : null;

    const profilKontekst = profil
      ? `\nBRUKERPROFIL: ${profil.kjønn}, ${profil.høyde}cm, ${profil.nåværendeVekt}kg → mål ${profil.målvekt}kg (${profil.nåværendeVekt - profil.målvekt}kg å gå)`
      : "";

    const history = historyJson ? JSON.parse(historyJson) : [];

    const todayMeals = history
      .filter((m: { timestamp: string }) => {
        const mealDate = new Date(m.timestamp).toDateString();
        const today = new Date().toDateString();
        return mealDate === today;
      })
      .map((m: { text?: string; response?: string }) => `- ${m.text || "bilde"}: ${m.response?.split("<dagsstatus>")[0]?.trim()}`)
      .join("\n");

    const contextText = todayMeals
      ? `${profilKontekst}\nDagens måltider så langt:\n${todayMeals}\n\nNytt måltid: ${text || "se bilde"}`
      : `${profilKontekst}\n${text || "se bilde"}`;

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
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const statusMatch = responseText.match(/<dagsstatus>([\s\S]*?)<\/dagsstatus>/);
    let dagsstatus = null;
    let feedbackText = responseText;

    if (statusMatch) {
      try {
        dagsstatus = JSON.parse(statusMatch[1]);
        feedbackText = responseText.replace(/<dagsstatus>[\s\S]*?<\/dagsstatus>/, "").trim();
      } catch {
        // keep raw text if parse fails
      }
    }

    return NextResponse.json({ feedback: feedbackText, dagsstatus });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Noe gikk galt" }, { status: 500 });
  }
}
