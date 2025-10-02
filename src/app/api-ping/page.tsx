"use client";
import { useEffect, useState } from "react";

type Health = { ok: boolean };

export default function ApiPing() {
  const [data, setData] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url =
      (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000") + "/health";

    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: Health = await res.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro desconhecido");
      }
    })();
  }, []);

  if (error) return <pre className="p-4 text-red-600">Erro: {error}</pre>;
  return <pre className="p-4">{JSON.stringify(data, null, 2)}</pre>;
}
