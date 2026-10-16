"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/lib/store";
import { Button, Card, Field, Input } from "@/components/ui";

export default function Signup() {
  const router = useRouter();
  const { login, startTrial, isDevMode } = useAccount();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    login(email, name);
    startTrial();
    router.push("/onboarding");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-1">Criar conta</h1>
      <p className="text-sm text-muted mb-6">
        {isDevMode
          ? "Modo de desenvolvimento: sem Supabase configurado, então isto cria uma conta local só neste navegador — sem senha real."
          : "Sua conta fica protegida com autenticação via Supabase."}
      </p>
      <Card>
        <form onSubmit={handleSubmit}>
          <Field label="Nome">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
          </Field>
          <Field label="E-mail">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
          </Field>
          <Button type="submit" className="w-full mt-2">
            Criar conta e começar teste grátis
          </Button>
        </form>
      </Card>
    </div>
  );
}
