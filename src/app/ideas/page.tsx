"use client";
import { useAccount } from "@/lib/store";
import { Button, Card, Badge } from "@/components/ui";

export default function IdeasPage() {
  const { account, removeIdea } = useAccount();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Ideias salvas</h1>
      <p className="text-sm text-muted mb-6">Conteúdos que você guardou pra usar em outra hora.</p>

      {account.savedIdeas.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Nenhuma ideia salva ainda. Abra um roteiro e clique em "Salvar como ideia".</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {account.savedIdeas.map((saved) => (
            <Card key={saved.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge>{saved.item.format}</Badge>
                  <h3 className="font-medium mt-2">{saved.item.coverTitle || saved.item.theme}</h3>
                  <p className="text-sm text-muted mt-1">{saved.item.hook}</p>
                </div>
                <Button variant="ghost" onClick={() => removeIdea(saved.id)}>
                  Remover
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
