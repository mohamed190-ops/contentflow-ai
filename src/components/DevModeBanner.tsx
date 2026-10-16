"use client";
import { useAccount } from "@/lib/store";

export default function DevModeBanner() {
  const { isDevMode } = useAccount();
  if (!isDevMode) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center py-1.5 px-4">
      Modo de desenvolvimento: dados ficam só neste navegador (sem Supabase configurado) e os roteiros podem
      estar usando conteúdo de exemplo (sem chave da Anthropic). Veja <code>/profile</code> → nada a fazer; para
      ligar de verdade, configure as variáveis de ambiente descritas no README.
    </div>
  );
}
