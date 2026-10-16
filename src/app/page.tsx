import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function Landing() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <span className="inline-block text-xs font-medium text-accent-dark bg-accent/10 rounded-full px-3 py-1 mb-5">
          Pra quem já tem experiência mas não sabe o que postar
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground max-w-3xl mx-auto">
          Transforme sua experiência numa estratégia de conteúdo pronta pra gravar.
        </h1>
        <p className="mt-5 text-lg text-muted max-w-2xl mx-auto">
          Responda algumas perguntas sobre você e seu trabalho. A IA monta sua estratégia, seu calendário de
          7 dias e o roteiro completo de cada vídeo — hook, fala, exemplo, legenda e instrução de gravação.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/signup">
            <Button>Começar gratuitamente</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Já tenho conta</Button>
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted">7 dias de teste grátis. Sem cartão de crédito.</p>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-24 grid sm:grid-cols-3 gap-5">
        {[
          {
            title: "1. Conte sobre você",
            desc: "Profissão, experiência, história, público e tempo disponível — sem precisar saber termos de marketing.",
          },
          {
            title: "2. Receba sua estratégia",
            desc: "Pilares de conteúdo e um calendário de 7 dias, pensado pro seu público e pro seu nicho.",
          },
          {
            title: "3. Grave com o roteiro na mão",
            desc: "Hook, fala, exemplo real, legenda e instrução de câmera — tudo escrito, pronto pra gravar no celular.",
          },
        ].map((f) => (
          <Card key={f.title}>
            <h3 className="font-medium text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted">{f.desc}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
