// app/api/faucet/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { publicKey } = await req.json();
  if (!publicKey) return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });

  try {
    const res = await fetch("http://localhost:8080", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: publicKey }), // faucet lokal pakai owner
    });
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
