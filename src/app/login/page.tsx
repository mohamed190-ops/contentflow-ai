"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "@/lib/store";
import { Button, Card, Field, Input } from "@/components/ui";

export default function Login() {
  const router = useRouter();
  const { login, account, isDevMode } = useAccount();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    login(email);
    router.push(account.profile ? "/dashboard" : "/onboarding");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-1">Entrar</h1>
      <p className="text-sm text-muted mb-6">
        {isDevMode
          ? "Modo de desenvolvimento: digite qualquer e-mail para entrar na conta salva neste navegador."
          : "Entre com seu e-mail e senha cadastrados."}
      </p>
      <Card>
        <form onSubmit={handleSubmit}>
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
            Entrar
          </Button>
        </form>
        <p className="text-sm text-muted mt-4 text-center">
          Não tem conta?{" "}
          <Link href="/signup" className="text-accent-dark font-medium">
            Criar conta
          </Link>
        </p>
      </Card>
    </div>
  );
}
