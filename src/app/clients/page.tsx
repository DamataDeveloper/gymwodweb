"use client";
import { useEffect, useState } from "react";

type Client = {
  id: string;
  name: string;
  birth: string;
  active: boolean;
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // carregamento inicial (ajuste a rota da sua API de listagem)
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/clients", { cache: "no-store" });
      const data = await r.json();
      setClients(data ?? []);
    })();
  }, []);

  async function handleDelete(id: string) {
    try {
      setLoadingId(id);
      const r = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Falha ao excluir");
      setClients((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setLoadingId(null);
    }
  }

  async function toggleActive(c: Client) {
    try {
      setLoadingId(c.id);
      const r = await fetch(`/api/clients/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...c, active: !c.active }),
      });
      if (!r.ok) throw new Error("Falha ao atualizar");
      setClients((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x))
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border rounded">
          <thead>
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Nascimento</th>
              <th className="p-2 text-left">Ativo</th>
              <th className="p-2 text-left">Criado em</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td className="p-2" colSpan={6}>
                  Sem clientes
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.id}</td>
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.birth}</td>
                  <td className="p-2">{c.active ? "Sim" : "Não"}</td>
                  <td className="p-2">{c.createdAt}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => toggleActive(c)}
                      disabled={loadingId === c.id}
                      className="px-2 py-1 border rounded"
                      title="Ativar/Desativar (PUT)"
                    >
                      Desativar/Ativar
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={loadingId === c.id}
                      className="px-2 py-1 border rounded text-white bg-red-600"
                      title="Excluir (DELETE)"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
