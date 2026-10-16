"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/lib/store";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import type { Platform, UserProfile } from "@/lib/types";

const platformOptions: { id: Platform; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
];

const steps = [
  "Sobre o seu trabalho",
  "Sua história",
  "Seu público",
  "Como você se comunica e grava",
];

export default function Onboarding() {
  const router = useRouter();
  const { session, account, saveProfile } = useAccount();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<UserProfile>(
    account.profile || {
      name: session?.name || "",
      profession: "",
      services: "",
      experience: "",
      story: "",
      goals: "",
      targetAudience: "",
      audienceProblems: "",
      communicationStyle: "",
      platforms: ["instagram"],
      recordingTime: "",
      videoConfidence: "",
      topicsToAvoid: "",
    }
  );

  function set<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function togglePlatform(p: Platform) {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }));
  }

  async function finish() {
    setLoading(true);
    setError(null);
    saveProfile(form);
    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar estratégia.");
      sessionStorage.setItem("pending_strategy", JSON.stringify(data.strategy));
      router.push("/strategy");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        <p className="text-sm text-muted mb-1">
          Passo {step + 1} de {steps.length}
        </p>
        <h1 className="text-xl font-semibold">{steps[step]}</h1>
      </div>

      <Card>
        {step === 0 && (
          <>
            <Field label="Qual a sua profissão ou área?">
              <Input value={form.profession} onChange={(e) => set("profession", e.target.value)} placeholder="Ex: nutricionista, personal trainer, designer..." />
            </Field>
            <Field label="Quais serviços ou produtos você oferece?">
              <Textarea rows={3} value={form.services} onChange={(e) => set("services", e.target.value)} />
            </Field>
            <Field label="Conte sobre sua experiência" hint="Formação, tempo de atuação, o que você já viveu na prática.">
              <Textarea rows={4} value={form.experience} onChange={(e) => set("experience", e.target.value)} />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Sua história pessoal" hint="O que te trouxe até aqui — não precisa ser perfeito, escreva livremente.">
              <Textarea rows={5} value={form.story} onChange={(e) => set("story", e.target.value)} />
            </Field>
            <Field label="Quais são seus objetivos com o conteúdo?">
              <Textarea rows={3} value={form.goals} onChange={(e) => set("goals", e.target.value)} />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Quem é o seu público-alvo?">
              <Textarea rows={3} value={form.targetAudience} onChange={(e) => set("targetAudience", e.target.value)} />
            </Field>
            <Field label="Quais problemas esse público costuma ter?">
              <Textarea rows={3} value={form.audienceProblems} onChange={(e) => set("audienceProblems", e.target.value)} />
            </Field>
            <Field label="Plataformas que você prefere usar">
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      form.platforms.includes(p.id)
                        ? "bg-accent text-white border-accent"
                        : "border-border text-muted"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Como você se comunica?" hint="Ex: direto e informal, mais técnico, engraçado...">
              <Input value={form.communicationStyle} onChange={(e) => set("communicationStyle", e.target.value)} />
            </Field>
            <Field label="Quanto tempo você tem disponível para gravar/editar por dia?">
              <Input value={form.recordingTime} onChange={(e) => set("recordingTime", e.target.value)} placeholder="Ex: 15 minutos" />
            </Field>
            <Field label="Como você se sente aparecendo em vídeo?">
              <Input value={form.videoConfidence} onChange={(e) => set("videoConfidence", e.target.value)} placeholder="Ex: nunca gravei, tenho vergonha, já tenho prática..." />
            </Field>
            <Field label="Algum tema que você prefere não tocar?" hint="Opcional — política, vida pessoal específica, concorrentes, etc.">
              <Textarea rows={2} value={form.topicsToAvoid} onChange={(e) => set("topicsToAvoid", e.target.value)} />
            </Field>
          </>
        )}

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex justify-between mt-4">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Voltar
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Continuar</Button>
          ) : (
            <Button onClick={finish} disabled={loading}>
              {loading ? "Gerando estratégia..." : "Gerar minha estratégia"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
