// app/api/balance/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { publicKey } = await req.json();
  if (!publicKey) return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });

  try {
    // endpoint node lokal (sesuaikan port & path)
    const NODE_URL = `http://localhost:9001/api/v1/accounts/${publicKey}`;
    const res = await fetch(NODE_URL);
    const data = await res.json();
    return NextResponse.json({ balance: data?.balance ?? 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
