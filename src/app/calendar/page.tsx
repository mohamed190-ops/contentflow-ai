"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "@/lib/store";
import { Card, Badge } from "@/components/ui";

const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const formatLabel: Record<string, string> = { video: "Vídeo", carousel: "Carrossel", story: "Story", post: "Post" };

export default function CalendarPage() {
  const router = useRouter();
  const { account } = useAccount();

  useEffect(() => {
    if (!account.plan) router.push("/strategy");
  }, [account.plan, router]);

  if (!account.plan) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Calendário da semana</h1>
      <p className="text-sm text-muted mb-6">Toque num dia para ver o roteiro completo.</p>

      <div className="space-y-3">
        {account.plan.items.map((item) => (
          <Link key={item.day} href={`/script/${item.day}`}>
            <Card className="hover:border-accent transition cursor-pointer flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">{dayNames[item.day - 1]} · Dia {item.day}</p>
                <p className="font-medium">{item.coverTitle || item.theme}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={item.format === "video" ? "accent" : "neutral"}>{formatLabel[item.format]}</Badge>
                <Badge tone={item.status === "done" ? "accent" : "neutral"}>
                  {item.status === "done" ? "Concluído" : "Pendente"}
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
