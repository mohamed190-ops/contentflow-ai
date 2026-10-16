"use client";
import { useAccount } from "@/lib/store";
import { Button, Card, Badge } from "@/components/ui";

const stripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function BillingPage() {
  const { account, trialDaysLeft } = useAccount();
  const daysLeft = trialDaysLeft();

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Assinatura</h1>
      <p className="text-sm text-muted mb-6">Gerencie seu plano e pagamento.</p>

      <Card className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium">Status atual</p>
          <Badge tone={account.subscriptionStatus === "trial" ? "accent" : "neutral"}>
            {account.subscriptionStatus === "trial" ? "Teste grátis" : account.subscriptionStatus}
          </Badge>
        </div>
        {daysLeft !== null && (
          <p className="text-sm text-muted">
            {daysLeft > 0 ? `${daysLeft} dias restantes do teste grátis de 7 dias.` : "Seu teste grátis terminou."}
          </p>
        )}
      </Card>

      <Card>
        <p className="font-medium mb-2">Plano Pro</p>
        <p className="text-sm text-muted mb-4">
          Estratégias e roteiros ilimitados, calendários de mais de 7 dias, exportação de conteúdo.
        </p>
        <Button disabled={!stripeConfigured} className="w-full">
          {stripeConfigured ? "Assinar agora" : "Pagamento ainda não configurado"}
        </Button>
        {!stripeConfigured && (
          <p className="text-xs text-muted mt-2">
            O checkout do Stripe ainda não foi conectado neste ambiente. Configure
            <code> STRIPE_SECRET_KEY</code>, <code>NEXT_PUBLIC_STRIPE_PUBLIC_KEY</code> e os webhooks pra ativar
            cobrança real — nenhuma cobrança é simulada ou fingida aqui.
          </p>
        )}
      </Card>
    </div>
  );
}
