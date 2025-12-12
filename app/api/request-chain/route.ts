// app/api/request-chain/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();
    if (!publicKey) {
      return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });
    }

    // Request ke faucet lokal atau testnet
    const response = await fetch(`${process.env.NEXT_PUBLIC_LINERA_FAUCET}/request-chain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: publicKey }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Faucet request failed");

    return NextResponse.json({ chainId: data.chainId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
