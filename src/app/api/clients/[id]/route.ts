// src/app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Garante que esse Route Handler rode no runtime Node.js (não Edge)
export const runtime = "nodejs";
// Evita cache agressivo em camadas intermediárias
export const dynamic = "force-dynamic";

function getBaseUrl(): string | null {
  // Leia as envs SOMENTE quando a função é chamada (evita problemas no build)
  const base = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || null;
  return base;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const base = getBaseUrl();
  if (!base) {
    return NextResponse.json(
      { error: "API base URL not set (API_URL / NEXT_PUBLIC_API_URL)" },
      { status: 500 }
    );
  }

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const base = getBaseUrl();
  if (!base) {
    return NextResponse.json(
      { error: "API base URL not set (API_URL / NEXT_PUBLIC_API_URL)" },
      { status: 500 }
    );
  }

  const { id } = params;

  const res = await fetch(`${base}/clients/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
