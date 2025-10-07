// src/app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";

if (!BASE) {
  // Opcional: ajuda a diagnosticar falta de env em dev
  // (em produção, apenas retornaremos erro 500 se faltar)
  console.warn("API base URL is not set (API_URL / NEXT_PUBLIC_API_URL).");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Mantém o mesmo comportamento do seu código antigo: passa o body como texto
  const bodyText = await req.text();

  const res = await fetch(`${BASE}/clients/${id}`, {
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
  const { id } = params;

  const res = await fetch(`${BASE}/clients/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
