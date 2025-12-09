import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { publicKey } = await req.json();

  if (!publicKey) {
    return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });
  }

  // Pakai RPC URL dari env.local
  const RPC_URL = process.env.NEXT_PUBLIC_LINERA_RPC!;

  try {
    const res = await fetch(`${RPC_URL}/faucet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_key: publicKey }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Faucet request failed" }, { status: 500 });
  }
}
