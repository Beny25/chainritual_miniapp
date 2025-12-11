import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();
    if (!publicKey) {
      return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });
    }

    // Fetch balance dari node testnet via server
    const NODE_URL = `https://node.testnet-conway.linera.net/api/v1/accounts/${publicKey}`;

    const res = await fetch(NODE_URL);
    if (!res.ok) {
      return NextResponse.json({ error: `Node returned status ${res.status}` }, { status: res.status });
    }

    const data = await res.json();

    // Sesuaikan field balance sesuai response node
    // Contoh jika response { balance: 1000 }
    const balance = data.balance ?? 0;

    return NextResponse.json({ success: true, balance });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
