import Anthropic from "@anthropic-ai/sdk";
import type { UserProfile, Strategy, ContentItem, ContentFormat } from "./types";

export const isAiConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

function extractJson(text: string): any {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Resposta da IA sem JSON válido");
  return JSON.parse(match[0]);
}

// ---------------------------------------------------------------------
// Modo de desenvolvimento: conteúdo de exemplo, claramente rotulado,
// usado quando ANTHROPIC_API_KEY não está configurada. Nunca inventa
// dados pessoais do usuário — usa só o que ele mesmo escreveu.
// ---------------------------------------------------------------------
function sampleStrategy(profile: UserProfile): Strategy {
  return {
    promise: `(Exemplo) Ajudo ${profile.targetAudience || "minha audiência"} a resolver "${
      profile.audienceProblems || "o problema principal que você descreveu"
    }", usando minha experiência como ${profile.profession || "profissional"}.`,
    tone: profile.communicationStyle || "direto e próximo",
    pillars: [
      { name: "Autoridade/experiência", percentage: 35, description: "O que você sabe na prática, baseado em " + (profile.experience || "sua experiência") },
      { name: "Bastidores e rotina", percentage: 25, description: "Como é o seu dia a dia de trabalho" },
      { name: "Dicas práticas", percentage: 25, description: "Resolve um problema real de " + (profile.targetAudience || "quem te segue") },
      { name: "Conexão pessoal", percentage: 15, description: "Sua história: " + (profile.story ? profile.story.slice(0, 60) + "..." : "ainda não descrita") },
    ],
    weekThemes: [
      "Apresentação: quem é você e por que fala sobre isso",
      "Erro comum que seu público cliente comete",
      "Como você resolve esse erro na prática",
      "Bastidores do seu trabalho",
      "Um resultado/aprendizado real",
      "Dúvida frequente respondida",
      "Convite/CTA para o seu serviço",
    ],
  };
}

function sampleScript(profile: UserProfile, day: number, theme: string): ContentItem {
  const formats: ContentFormat[] = ["video", "carousel", "video", "story", "video", "video", "video"];
  return {
    day,
    format: formats[(day - 1) % formats.length],
    theme,
    hook: `(Exemplo) "Se você é ${profile.targetAudience || "da minha área"} e já sentiu isso, para tudo e assiste."`,
    script:
      `(Exemplo) Abra direto no problema: "${profile.audienceProblems || "o problema que seu público mais sente"}". ` +
      `Fale como ${profile.profession || "profissional"} o que você já viu funcionar na prática. Feche com uma lição clara.`,
    example: profile.experience
      ? `Use um caso real da sua experiência: "${profile.experience.slice(0, 120)}"`
      : "(Você ainda não descreveu uma experiência real — complete o perfil pra eu usar um caso seu de verdade aqui.)",
    conclusion: "(Exemplo) Resuma a lição em 1 frase simples, sem jargão.",
    cta: "Comenta aqui se isso também acontece com você.",
    durationSeconds: 30,
    recordingInstructions: `Gravação simples no celular, vertical, dentro do seu tempo disponível (${profile.recordingTime || "o tempo que você tiver"}).`,
    onScreenText: "Texto curto com a frase de gancho, nos primeiros 2 segundos.",
    coverTitle: theme,
    caption: `${theme} — e você, já passou por isso? Comenta aqui. #conteudo`,
    status: "todo",
    isSample: true,
  };
}

// ---------------------------------------------------------------------
// Geração real via Claude (quando ANTHROPIC_API_KEY está configurada)
// ---------------------------------------------------------------------
export async function generateStrategy(profile: UserProfile): Promise<Strategy> {
  if (!isAiConfigured()) return sampleStrategy(profile);

  const prompt = `Você é um estrategista de conteúdo para redes sociais. Com base SOMENTE nas informações que a pessoa forneceu abaixo, monte uma estratégia de conteúdo. NUNCA invente experiências, resultados, depoimentos de clientes ou estatísticas de mercado que a pessoa não tenha mencionado. Se faltar informação, trabalhe com o que existe e seja honesto sobre isso dentro do próprio texto.

Perfil:
- Profissão: ${profile.profession}
- Serviços: ${profile.services}
- Experiência: ${profile.experience}
- História pessoal: ${profile.story}
- Objetivos: ${profile.goals}
- Público-alvo: ${profile.targetAudience}
- Problemas do público: ${profile.audienceProblems}
- Estilo de comunicação: ${profile.communicationStyle}
- Plataformas preferidas: ${profile.platforms.join(", ")}
- Temas a evitar: ${profile.topicsToAvoid}

Responda APENAS com um JSON válido neste formato exato:
{
  "promise": "promessa central em 1 frase",
  "tone": "tom de comunicação resumido",
  "pillars": [{"name": "...", "percentage": 0, "description": "..."}],
  "weekThemes": ["tema do dia 1", "tema do dia 2", "tema do dia 3", "tema do dia 4", "tema do dia 5", "tema do dia 6", "tema do dia 7"]
}`;

  const msg = await client().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });
  const text = msg.content.map((c: any) => (c.type === "text" ? c.text : "")).join("");
  return extractJson(text) as Strategy;
}

export async function generateScript(
  profile: UserProfile,
  strategy: Strategy,
  day: number,
  theme: string
): Promise<ContentItem> {
  if (!isAiConfigured()) return sampleScript(profile, day, theme);

  const prompt = `Você escreve roteiros de vídeo curto para redes sociais. NUNCA invente experiências pessoais, depoimentos de clientes ou estatísticas que a pessoa não tenha fornecido — use só o que está no perfil abaixo. Priorize vídeos simples de gravar com celular, dentro do tempo disponível da pessoa.

Perfil: profissão ${profile.profession}; experiência: ${profile.experience}; história: ${profile.story}; estilo: ${profile.communicationStyle}; tempo disponível pra gravar: ${profile.recordingTime}; confiança em vídeo: ${profile.videoConfidence}; temas a evitar: ${profile.topicsToAvoid}.

Tema de hoje (dia ${day} de 7): "${theme}"
Promessa da estratégia: "${strategy.promise}"

Responda APENAS com um JSON válido neste formato exato:
{
  "hook": "gancho de abertura forte",
  "script": "roteiro falado, conversacional",
  "example": "exemplo real baseado SÓ no que a pessoa informou, ou uma nota clara pedindo mais detalhes se não houver informação suficiente",
  "conclusion": "conclusão clara",
  "cta": "call to action",
  "durationSeconds": 30,
  "recordingInstructions": "instruções de gravação e enquadramento",
  "onScreenText": "texto que aparece na tela",
  "coverTitle": "título de capa",
  "caption": "legenda pro post"
}`;

  const msg = await client().messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });
  const text = msg.content.map((c: any) => (c.type === "text" ? c.text : "")).join("");
  const parsed = extractJson(text);
  const formats: ContentFormat[] = ["video", "carousel", "video", "story", "video", "video", "video"];
  return {
    day,
    format: formats[(day - 1) % formats.length],
    theme,
    status: "todo",
    isSample: false,
    ...parsed,
  } as ContentItem;
}
