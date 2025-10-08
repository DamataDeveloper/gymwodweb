import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(): string | null {
  const raw = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || null;
  if (!raw) return null;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

type RouteCtx = unknown; // <- sem 'any'; vamos afirmar o tipo dentro da função
type Params = { params: { id: string } };

export async function PUT(req: Request, ctx: RouteCtx) {
  const base = getBaseUrl();
  if (!base) {
    return NextResponse.json(
      { error: "API base URL not set (API_URL / NEXT_PUBLIC_API_URL)" },
      { status: 500 }
    );
  }

  // Fazemos a asserção localmente (evita 'any' e evita o erro do validador do Next)
  const { params } = ctx as Params;
  const { id } = params;

  const bodyText = await req.text();

  const res = await fetch(`${base}/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: bodyText,
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(_req: Request, ctx: RouteCtx) {
  const base = getBaseUrl();
  if (!base) {
    return NextResponse.json(
      { error: "API base URL not set (API_URL / NEXT_PUBLIC_API_URL)" },
      { status: 500 }
    );
  }

  const { params } = ctx as Params;
  const { id } = params;

  const res = await fetch(`${base}/clients/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
