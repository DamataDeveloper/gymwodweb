export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) throw new Error("NEXT_PUBLIC_API_URL não definido");
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export async function GET() {
  const base = getBaseUrl();
  const r = await fetch(`${base}/clients`, { cache: "no-store" });
  return new Response(await r.text(), {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const base = getBaseUrl();
  const body = await req.text();
  const r = await fetch(`${base}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  return new Response(await r.text(), {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}
