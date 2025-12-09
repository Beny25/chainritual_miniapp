import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });
    }

    // Gunakan local faucet untuk dev, bisa diganti ke testnet nanti
    const FAUCET_URL = process.env.NEXT_PUBLIC_LINERA_FAUCET || "http://localhost:8080";

    const res = await fetch(FAUCET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_key: publicKey }),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text); // parse JSON dari faucet
    } catch {
      data = { raw: text || "Faucet request sent!" }; // fallback kalau bukan JSON
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
