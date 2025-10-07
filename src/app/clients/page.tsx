"use client";
import { useEffect, useState } from "react";

type Client = {
  id: number;
  name: string;
  birthDate: string | null;
  active: boolean;
  createdAt: string;
};

export default function ClientsPage() {
  const [list, setList] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const r = await fetch("/api/clients", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: Client[] = await r.json();
      setList(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao carregar");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birthDate: birthDate
            ? new Date(birthDate).toISOString().slice(0, 10)
            : null,
          active,
        }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setName("");
      setBirthDate("");
      setActive(true);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    await load();
  }

  async function toggleActive(c: Client) {
    await fetch(`/api/clients/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    await load();
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Clientes</h1>

      <form onSubmit={onSubmit} className="space-y-3 border rounded-xl p-4">
        <div className="flex flex-col">
          <label className="text-sm">Nome</label>
          <input
            className="border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Data de Nascimento</label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Ativo
        </label>
        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
        {err && <div className="text-red-600 text-sm">Erro: {err}</div>}
      </form>

      <div className="border rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Nascimento</th>
              <th className="text-left p-2">Ativo</th>
              <th className="text-left p-2">Criado em</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.id}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">
                  {c.birthDate
                    ? new Date(c.birthDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2">{c.active ? "Sim" : "Não"}</td>
                <td className="p-2">
                  {new Date(c.createdAt).toLocaleString()}
                </td>
                {/* NOVO: célula com os botões */}
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => toggleActive(c)}
                  >
                    {c.active ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    className="px-2 py-1 border rounded text-red-600"
                    onClick={() => handleDelete(c.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                {/* Atualize o colSpan para 6 por causa da nova coluna */}
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  Sem clientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
