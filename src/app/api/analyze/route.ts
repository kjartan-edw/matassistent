import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const client = new Anthropic();

const SYSTEM_PROMPT = `Vennlig mat-assistent for vektnedgang. Svar alltid på norsk.

SVAR: 1 setning vurdering, max 1-2 konkrete råd, deretter estimat-tag.

ESTIMAT (alltid til slutt):
<estimat>{"kcal": 350, "protein": 8, "melding": "God plass til middag"}</estimat>

REGLER:
- kcal/protein gjelder KUN dette måltidet
- Bruk dagsmål fra brukerprofil som referanse i meldingen
- Protein-mål: ca. 1g per kg kroppsvekt
- Vær realistisk og oppmuntrende`;

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
      ? `Bruker: ${profil.kjønn}, ${profil.alder}år, ${profil.vekt}kg, dagsmål ${profil.dagsmål}kcal`
      : "";

    const dagKontekst = totaler
      ? `I dag: ${totaler.kcal}kcal, ${totaler.protein}g protein`
      : "Første måltid i dag";

    const contextText = `${profilKontekst}. ${dagKontekst}. Måltid: ${text || "se bilde"}`;

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
      max_tokens: 300,
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
    console.error("API error:", msg);
    const erRateLimit = msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate") || msg.toLowerCase().includes("limit");
    return NextResponse.json(
      { error: erRateLimit ? "rate_limit" : msg },
      { status: 500 }
    );
  }
}
