"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "@/lib/store";
import { Button, Card, Field, Input, Textarea, Badge } from "@/components/ui";
import type { ContentItem } from "@/lib/types";

const fieldDefs: { key: keyof ContentItem; label: string; multiline?: boolean }[] = [
  { key: "hook", label: "Gancho de abertura", multiline: true },
  { key: "script", label: "Roteiro falado", multiline: true },
  { key: "example", label: "Exemplo real", multiline: true },
  { key: "conclusion", label: "Conclusão", multiline: true },
  { key: "cta", label: "Call to action", multiline: true },
  { key: "onScreenText", label: "Texto na tela", multiline: true },
  { key: "recordingInstructions", label: "Instruções de gravação", multiline: true },
  { key: "coverTitle", label: "Título de capa" },
  { key: "caption", label: "Legenda" },
];

export default function ScriptDetail() {
  const params = useParams<{ day: string }>();
  const day = Number(params.day);
  const router = useRouter();
  const { account, updateItem, toggleDone, saveIdea } = useAccount();
  const item = account.plan?.items.find((i) => i.day === day);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ContentItem | null>(item || null);
  const [regenLoading, setRegenLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!item || !draft) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-muted">
        Esse dia ainda não existe no seu calendário.
      </div>
    );
  }

  function saveEdits() {
    updateItem(day, draft!);
    setEditing(false);
  }

  async function regenerate() {
    if (!account.profile || !account.strategy || !item) return;
    setRegenLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: account.profile, strategy: account.strategy, day, theme: item.theme }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao regenerar.");
      updateItem(day, data.item);
      setDraft({ ...data.item });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRegenLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => router.push("/calendar")} className="text-sm text-muted mb-4">
        ← Voltar ao calendário
      </button>

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold">Dia {day}</h1>
        <div className="flex gap-2">
          <Badge tone={item.status === "done" ? "accent" : "neutral"}>
            {item.status === "done" ? "Concluído" : "Pendente"}
          </Badge>
          {item.isSample && <Badge tone="warn">Exemplo (modo dev)</Badge>}
        </div>
      </div>
      <p className="text-sm text-muted mb-6">{item.theme} · {Math.round(item.durationSeconds)}s · {item.format}</p>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <Card>
        {fieldDefs.map((f) => (
          <Field key={f.key} label={f.label}>
            {editing ? (
              f.multiline ? (
                <Textarea
                  rows={3}
                  value={String(draft[f.key] ?? "")}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              ) : (
                <Input
                  value={String(draft[f.key] ?? "")}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              )
            ) : (
              <p className="text-sm text-foreground whitespace-pre-wrap">{String(item[f.key] ?? "")}</p>
            )}
          </Field>
        ))}

        <div className="flex flex-wrap gap-2 mt-2">
          {editing ? (
            <>
              <Button onClick={saveEdits}>Salvar edição</Button>
              <Button variant="secondary" onClick={() => { setDraft(item); setEditing(false); }}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditing(true)}>Editar</Button>
              <Button variant="secondary" onClick={regenerate} disabled={regenLoading}>
                {regenLoading ? "Regenerando…" : "Regenerar com IA"}
              </Button>
              <Button variant="secondary" onClick={() => toggleDone(day)}>
                {item.status === "done" ? "Marcar como pendente" : "Marcar como concluído"}
              </Button>
              <Button variant="ghost" onClick={() => saveIdea(item)}>
                Salvar como ideia
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
