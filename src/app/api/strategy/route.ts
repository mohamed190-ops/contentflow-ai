import { NextRequest, NextResponse } from "next/server";
import { generateStrategy, isAiConfigured } from "@/lib/ai";
import type { UserProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const profile = (await req.json()) as UserProfile;
    if (!profile || !profile.profession) {
      return NextResponse.json({ error: "Perfil incompleto." }, { status: 400 });
    }
    const strategy = await generateStrategy(profile);
    return NextResponse.json({ strategy, devMode: !isAiConfigured() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao gerar estratégia." }, { status: 500 });
  }
}
