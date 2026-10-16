# ContentFlow AI — MVP

App que transforma a experiência e a história de um profissional num plano de conteúdo pronto pra gravar:
onboarding → estratégia gerada por IA → calendário de 7 dias → roteiro completo por item (hook, fala, exemplo,
conclusão, CTA, instruções de gravação, texto na tela, título de capa e legenda) → edição, regeneração e
marcação de concluído.

## Como rodar agora, sem gastar nada

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem nenhuma chave configurada, o app roda em **modo de desenvolvimento**:

- **Conta e dados:** salvos no `localStorage` do seu navegador (sem Supabase). Um aviso amarelo aparece no
  topo do app avisando isso.
- **Estratégia e roteiros:** gerados por templates de exemplo (claramente marcados como "Exemplo (modo dev)"),
  sem chamar nenhuma API paga, porque não há `ANTHROPIC_API_KEY`.
- **Assinatura:** a tela `/billing` mostra "pagamento ainda não configurado" em vez de fingir uma cobrança.

Isso cobre o que o spec pedia: "If a required integration is not configured, provide a clearly labelled
development mode" — nada aqui é simulado silenciosamente.

## 1) O que já funciona de ponta a ponta

- Cadastro/login (modo dev, sem senha real).
- Onboarding guiado (profissão, experiência, história, público, estilo, tempo de gravação, temas a evitar).
- Geração de estratégia (promessa, pilares, 7 temas da semana).
- Geração do calendário de 7 dias com roteiro completo de cada item.
- Dashboard com "prioridade de hoje".
- Calendário semanal com status.
- Editor de roteiro: editar campos, regenerar com IA, marcar concluído, salvar como ideia.
- Ideias salvas.
- Perfil editável.
- Tela de assinatura com status do teste grátis (7 dias).

## 2) O que precisa de credenciais/configuração externa

| Recurso | Variável de ambiente | Sem ela, o que acontece |
|---|---|---|
| Geração real de roteiro (Claude) | `ANTHROPIC_API_KEY` | Usa conteúdo de exemplo, rotulado `isSample: true` |
| Conta e banco de dados persistente de verdade | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dados ficam só no navegador (localStorage) |
| Cobrança real | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET` | Botão de assinar fica desabilitado com aviso |

Copie `.env.example` para `.env.local` e preencha o que quiser ligar.

## 3) Como configurar banco de dados e autenticação (Supabase)

1. Crie um projeto gratuito em supabase.com.
2. Em SQL Editor, crie as tabelas `profiles`, `strategies`, `plans`, `content_items`, `saved_ideas`, cada uma
   com `user_id uuid references auth.users` e **Row Level Security habilitada** com policy
   `user_id = auth.uid()` pra SELECT/INSERT/UPDATE/DELETE — cada usuário só vê os próprios dados.
3. Copie a URL do projeto e a `anon key` em Project Settings → API para `.env.local`.
4. O código hoje já tem a abstração em `src/lib/supabase.ts` e `src/lib/store.tsx` — o próximo passo de
   implementação é trocar as leituras/escritas do `localStorage` por chamadas ao client do Supabase (fica
   isolado nesse mesmo arquivo, o resto do app não muda).

## 4) Como a geração de IA está conectada

- `src/lib/ai.ts` concentra toda a lógica. Com `ANTHROPIC_API_KEY` configurada, chama o modelo
  `claude-sonnet-4-5` via `@anthropic-ai/sdk`, com prompts que **proíbem explicitamente inventar** experiências,
  depoimentos ou estatísticas — só usam o que o usuário escreveu no onboarding.
- As chamadas de IA rodam só no servidor (`src/app/api/strategy` e `src/app/api/script`), nunca no navegador —
  a chave nunca é exposta ao cliente.
- Sem a chave, cai automaticamente no modo de exemplo (mesmo arquivo, mesma função, só troca o caminho).

## 5) Como as assinaturas mensais serão ativadas

Ainda não implementado (fora do escopo deste primeiro MVP, por decisão explícita: "não gastar dinheiro
agora"). Caminho recomendado quando for ativar:

1. Criar produtos/preços no Stripe (plano mensal).
2. Endpoint `/api/checkout` que cria uma Stripe Checkout Session pro usuário logado.
3. Webhook `/api/stripe/webhook` que escuta `checkout.session.completed` e `customer.subscription.*` e
   atualiza `subscriptionStatus` no banco (nunca confiar só no retorno do frontend).
4. Verificar o status da assinatura **no servidor**, em cada rota de API que gera conteúdo, antes de liberar a
   geração — não só esconder botão na interface.
5. Portal do cliente Stripe pra cancelamento/gestão, linkado em `/billing`.

## 6) Limitações atuais de segurança/persistência

- **Sem Supabase configurado, não há autenticação real** — qualquer e-mail "loga". Não usar assim em
  produção com usuários reais; é só pra testar o produto agora, de graça.
- **Dados no localStorage não são sincronizados entre dispositivos/navegadores** e podem ser perdidos se o
  usuário limpar os dados do navegador.
- **Sem rate-limit** nas rotas de IA ainda — antes de ligar `ANTHROPIC_API_KEY` em produção, adicionar um
  limite de chamadas por usuário/dia no servidor, pra não gerar custo descontrolado numa conta gratuita.
- **Sem RLS real** até o Supabase entrar — hoje "cada usuário só vê seus dados" é garantido só porque tudo
  vive isolado no próprio navegador.

## Teste grátis

7 dias corridos a partir da criação da conta (`startTrial()` em `src/lib/store.tsx`), sem necessidade de
cartão de crédito — como decidido na revisão do spec.
