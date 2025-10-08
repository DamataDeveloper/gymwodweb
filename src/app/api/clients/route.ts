import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(): string {
  const raw = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!raw)
    throw new Error("API base URL not set (API_URL / NEXT_PUBLIC_API_URL)");
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const base = getBaseUrl();
  const body = await req.text();

  const r = await fetch(`${base}/clients/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new NextResponse(await r.text(), {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  const base = getBaseUrl();

  const r = await fetch(`${base}/clients/${params.id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  // backend returns 204; normalize to 200 with payload for convenience
  if (r.status === 204) {
    return NextResponse.json(
      { ok: true, id: Number(params.id) },
      { status: 200 }
    );
  }

  return new NextResponse(await r.text(), {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}
