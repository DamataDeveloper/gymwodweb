"use client";
import { useEffect, useState } from "react";
type Health = { ok: boolean };

export default function ApiPing() {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const url = `${base}/health`;

  const [data, setData] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        setData(await r.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro desconhecido");
      }
    })();
  }, [url]);

  return (
    <div className="p-4 space-y-2">
      <div>
        <b>URL chamada:</b> {url}
      </div>
      {error ? (
        <pre className="text-red-600">Erro: {error}</pre>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
