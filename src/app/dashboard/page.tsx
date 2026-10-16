"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "@/lib/store";
import { Button, Card, Badge } from "@/components/ui";

const formatLabel: Record<string, string> = {
  video: "Vídeo",
  carousel: "Carrossel",
  story: "Story",
  post: "Post",
};

export default function Dashboard() {
  const router = useRouter();
  const { session, account, trialDaysLeft } = useAccount();

  useEffect(() => {
    if (!session) router.push("/login");
    else if (!account.profile) router.push("/onboarding");
    else if (!account.plan) router.push("/strategy");
  }, [session, account.profile, account.plan, router]);

  if (!account.plan) return null;

  const items = account.plan.items;
  const next = items.find((i) => i.status === "todo") || items[0];
  const doneCount = items.filter((i) => i.status === "done").length;
  const daysLeft = trialDaysLeft();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Olá, {session?.name || "tudo bem"}</h1>
      <p className="text-sm text-muted mb-6">
        {doneCount} de {items.length} conteúdos concluídos esta semana.
        {daysLeft !== null && daysLeft > 0 && ` · ${daysLeft} dias restantes de teste grátis.`}
      </p>

      <Card className="mb-6">
        <p className="text-xs font-medium text-accent-dark mb-1">PRIORIDADE DE HOJE</p>
        <div className="flex items-center gap-2 mb-2">
          <Badge>{formatLabel[next.format]}</Badge>
          <span className="text-xs text-muted">Dia {next.day}</span>
        </div>
        <h2 className="font-medium text-lg mb-2">{next.coverTitle || next.theme}</h2>
        <p className="text-sm text-muted mb-4">{next.hook}</p>
        <Link href={`/script/${next.day}`}>
          <Button>Abrir roteiro completo</Button>
        </Link>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/calendar">
          <Card className="hover:border-accent transition cursor-pointer">
            <p className="font-medium">Ver calendário da semana</p>
            <p className="text-sm text-muted">Todos os 7 dias e o status de cada um.</p>
          </Card>
        </Link>
        <Link href="/ideas">
          <Card className="hover:border-accent transition cursor-pointer">
            <p className="font-medium">Ideias salvas</p>
            <p className="text-sm text-muted">Conteúdos que você guardou pra depois.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
