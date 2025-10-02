// Proxy de /api/clients -> backend/clients
export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_URL!;
  const r = await fetch(`${base}/clients`, { cache: "no-store" });
  return new Response(await r.text(), {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const base = process.env.NEXT_PUBLIC_API_URL!;
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
