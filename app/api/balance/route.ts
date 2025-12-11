import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();
    if (!publicKey) return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });

    const NODE_URL = `https://node.testnet-conway.linera.net/api/v1/accounts/${publicKey}`;
    const res = await fetch(NODE_URL);
    const data = await res.json();

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
