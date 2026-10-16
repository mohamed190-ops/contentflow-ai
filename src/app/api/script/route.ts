import { NextRequest, NextResponse } from "next/server";
import { generateScript, isAiConfigured } from "@/lib/ai";
import type { UserProfile, Strategy } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      profile: UserProfile;
      strategy: Strategy;
      day: number;
      theme: string;
    };
    if (!body?.profile || !body?.strategy || !body?.theme) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }
    const item = await generateScript(body.profile, body.strategy, body.day, body.theme);
    return NextResponse.json({ item, devMode: !isAiConfigured() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao gerar roteiro." }, { status: 500 });
  }
}
