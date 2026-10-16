"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/lib/store";
import { Button, Card, Badge } from "@/components/ui";
import type { Strategy, ContentItem, Plan } from "@/lib/types";

export default function StrategyPage() {
  const router = useRouter();
  const { account, setStrategy, setPlan } = useAccount();
  const [strategy, setLocalStrategy] = useState<Strategy | null>(account.strategy);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!strategy) {
      const pending = sessionStorage.getItem("pending_strategy");
      if (pending) setLocalStrategy(JSON.parse(pending));
      else if (!account.profile) router.push("/onboarding");
    }
  }, [strategy, account.profile, router]);

  async function confirmAndGenerateCalendar() {
    if (!strategy || !account.profile) return;
    setLoading(true);
    setError(null);
    try {
      setStrategy(strategy);
      const results = await Promise.all(
        strategy.weekThemes.map((theme, i) =>
          fetch("/api/script", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile: account.profile, strategy, day: i + 1, theme }),
          }).then((r) => r.json())
        )
      );
      const items: ContentItem[] = results.map((r) => r.item);
      const plan: Plan = { id: `${Date.now()}`, createdAt: new Date().toISOString(), items };
      setPlan(plan);
      sessionStorage.removeItem("pending_strategy");
      router.push("/calendar");
    } catch (e: any) {
      setError(e.message || "Erro ao gerar o calendário.");
    } finally {
      setLoading(false);
    }
  }

  if (!strategy) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-muted">Carregando estratégia…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-1">Sua estratégia de conteúdo</h1>
      <p className="text-sm text-muted mb-6">Confirme e gere o calendário de 7 dias com roteiro completo.</p>

      <Card className="mb-5">
        <h2 className="font-medium mb-2">Promessa central</h2>
        <p className="text-sm text-foreground">{strategy.promise}</p>
        <p className="text-sm text-muted mt-2">Tom de voz: {strategy.tone}</p>
      </Card>

      <Card className="mb-5">
        <h2 className="font-medium mb-3">Pilares de conteúdo</h2>
        <div className="space-y-3">
          {strategy.pillars.map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{p.name}</span>
                <Badge tone="accent">{p.percentage}%</Badge>
              </div>
              <p className="text-sm text-muted">{p.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-5">
        <h2 className="font-medium mb-3">Prévia do calendário de 7 dias</h2>
        <ol className="space-y-2 text-sm">
          {strategy.weekThemes.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted">Dia {i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </Card>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <Button onClick={confirmAndGenerateCalendar} disabled={loading} className="w-full">
        {loading ? "Gerando os 7 roteiros…" : "Confirmar e gerar roteiros completos"}
      </Button>
    </div>
  );
}
