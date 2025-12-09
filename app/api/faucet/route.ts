import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { publicKey } = await req.json();

  if (!publicKey) {
    return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });
  }

  const RPC_URL = process.env.NEXT_PUBLIC_LINERA_RPC!;
  
  try {
    const res = await fetch(`${RPC_URL}/faucet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_key: publicKey }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text }; // kalau bukan JSON
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
