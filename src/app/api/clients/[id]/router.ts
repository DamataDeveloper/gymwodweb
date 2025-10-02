export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const base = process.env.NEXT_PUBLIC_API_URL!;
  const body = await req.text();
  const r = await fetch(`${base}/clients/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });
  return new Response(await r.text(), {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const base = process.env.NEXT_PUBLIC_API_URL!;
  const r = await fetch(`${base}/clients/${params.id}`, { method: "DELETE" });
  return new Response(await r.text(), { status: r.status });
}
