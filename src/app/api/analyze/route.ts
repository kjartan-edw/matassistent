import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const client = new Anthropic();

const SYSTEM_PROMPT = `Du er en ærlig og varm venn som er ernæringsfysiolog. Du hjelper folk med å gå ned i vekt gjennom bedre matvaner. Svar alltid på norsk.

DIN STIL:
- Ærlig og direkte, men aldri moraliserende
- Si ting som de er — en saftis er sukker, ikke "en god start"
- Ros konkret når noe faktisk er bra
- Gi ett nyttig råd når det er relevant, ikke generisk skryt

DU HAR TO MODI:

**MODUS 1 — Nytt måltid:**
Brukeren logger mat (bilde, matnavn, beskrivelse av hva de spiste).
- Gi en kort ærlig analyse
- Avslutt ALLTID med estimat-taggen

**MODUS 2 — Spørsmål og råd:**
Brukeren stiller et spørsmål, vil ha råd eller kommenterer noe.
- Svar som en personlig coach med full kontekst om dagen deres
- Bruk samtalehistorikken aktivt ("Du har spist X, så til middag bør du...")
- Inkluder ALDRI estimat-taggen i dette tilfellet

VIKTIG:
- Still ALDRI oppfølgingsspørsmål selv — estimer fra det du har
- Gjett aldri ingredienser brukeren ikke har nevnt

ESTIMAT (kun for nye måltider, alltid sist):
<estimat>{"kcal": 350, "protein": 8}</estimat>

ESTIMAT-REGLER:
- kcal/protein gjelder KUN dette ene måltidet
- Vær realistisk: saftis = ~80 kcal, 0g protein. Ikke rund opp for å være snill`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get("text") as string | null;
    const image = formData.get("image") as File | null;
    const profilJson = formData.get("profil") as string | null;
    const totalerJson = formData.get("dagTotaler") as string | null;

    const måltidstype = formData.get("måltidstype") as string | null;
    const historikkJson = formData.get("historikk") as string | null;

    const profil = profilJson ? JSON.parse(profilJson) : null;
    const totaler = totalerJson ? JSON.parse(totalerJson) : null;
    const historikk: Array<{ text?: string; response: string }> = historikkJson
      ? JSON.parse(historikkJson)
      : [];

    const profilKontekst = profil
      ? `Bruker: ${profil.kjønn}, ${profil.alder}år, ${profil.vekt}kg, dagsmål ${profil.dagsmål}kcal`
      : "";

    const dagKontekst = totaler
      ? `I dag totalt: ${totaler.kcal}kcal, ${totaler.protein}g protein`
      : "Første måltid i dag";

    const måltidstypeKontekst = måltidstype ? `Måltidstype: ${måltidstype}` : "";

    const historikkTekst = historikk.length > 0
      ? "\n\nSamtalehistorikk i dag:\n" + historikk.map(h =>
          `[Bruker]: ${h.text || "(bilde)"}\n[Matassistent]: ${h.response.slice(0, 200)}`
        ).join("\n---\n")
      : "";

    const måltidTekst = text && image
      ? `Brukerens beskrivelse (stol på denne): "${text}". Bildet er kun visuell referanse.`
      : text ? `Bruker: "${text}"` : "Se bildet.";

    const contextText = `${profilKontekst}. ${dagKontekst}. ${måltidstypeKontekst}.${historikkTekst}\n\n${måltidTekst}`;

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
      model: image ? "claude-haiku-4-5-20251001" : "claude-sonnet-4-6",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const estimatMatch = responseText.match(/<estimat>([\s\S]*?)<\/estimat>/);
    let estimater = null;
    let feedbackText = responseText;

    if (estimatMatch) {
      try {
        const parsed = JSON.parse(estimatMatch[1]);
        estimater = { kcal: parsed.kcal ?? 0, protein: parsed.protein ?? 0 };
        feedbackText = responseText.replace(/<estimat>[\s\S]*?<\/estimat>/, "").trim();
      } catch {
        // keep raw text if parse fails
      }
    }

    return NextResponse.json({ feedback: feedbackText, estimater });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const status = error instanceof Anthropic.APIError ? error.status : null;
    console.error("API error status:", status, "message:", msg);
    const erRateLimit = error instanceof Anthropic.APIError && error.status === 429;
    return NextResponse.json(
      { error: erRateLimit ? "rate_limit" : msg, debug_status: status },
      { status: 500 }
    );
  }
}
