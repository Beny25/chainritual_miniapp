import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { publicKey } = await req.json();

  if (!publicKey) {
    return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });
  }

  const FAUCET_URL = "https://faucet.testnet-conway.linera.net";

  try {
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
      data = { raw: text || "Faucet request sent!" }; // fallback kalau kosong
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
