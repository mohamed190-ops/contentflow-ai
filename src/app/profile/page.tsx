"use client";
import { useState } from "react";
import { useAccount } from "@/lib/store";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import type { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const { account, saveProfile, session } = useAccount();
  const [form, setForm] = useState(account.profile);
  const [saved, setSaved] = useState(false);

  if (!form) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-muted">Complete o onboarding primeiro.</div>;
  }

  function set<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setSaved(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Perfil</h1>
      <p className="text-sm text-muted mb-6">Conta: {session?.email}</p>

      <Card>
        <Field label="Profissão"><Input value={form.profession} onChange={(e) => set("profession", e.target.value)} /></Field>
        <Field label="Serviços"><Textarea rows={2} value={form.services} onChange={(e) => set("services", e.target.value)} /></Field>
        <Field label="Experiência"><Textarea rows={3} value={form.experience} onChange={(e) => set("experience", e.target.value)} /></Field>
        <Field label="História pessoal"><Textarea rows={3} value={form.story} onChange={(e) => set("story", e.target.value)} /></Field>
        <Field label="Objetivos"><Textarea rows={2} value={form.goals} onChange={(e) => set("goals", e.target.value)} /></Field>
        <Field label="Público-alvo"><Textarea rows={2} value={form.targetAudience} onChange={(e) => set("targetAudience", e.target.value)} /></Field>
        <Field label="Problemas do público"><Textarea rows={2} value={form.audienceProblems} onChange={(e) => set("audienceProblems", e.target.value)} /></Field>
        <Field label="Estilo de comunicação"><Input value={form.communicationStyle} onChange={(e) => set("communicationStyle", e.target.value)} /></Field>
        <Field label="Tempo disponível pra gravar"><Input value={form.recordingTime} onChange={(e) => set("recordingTime", e.target.value)} /></Field>
        <Field label="Confiança em vídeo"><Input value={form.videoConfidence} onChange={(e) => set("videoConfidence", e.target.value)} /></Field>
        <Field label="Temas a evitar"><Textarea rows={2} value={form.topicsToAvoid} onChange={(e) => set("topicsToAvoid", e.target.value)} /></Field>

        <Button
          onClick={() => {
            saveProfile(form);
            setSaved(true);
          }}
        >
          {saved ? "Salvo ✓" : "Salvar alterações"}
        </Button>
        <p className="text-xs text-muted mt-2">
          Alterar o perfil não regenera automaticamente os roteiros já criados — use "Regenerar com IA" em cada
          dia se quiser atualizá-los.
        </p>
      </Card>
    </div>
  );
}
