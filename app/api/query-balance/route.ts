// app/api/query-balance/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { chainId } = await req.json();
    if (!chainId) {
      return NextResponse.json({ error: "Missing chainId" }, { status: 400 });
    }

    // Query balance dari RPC
    const rpcUrl = process.env.NEXT_PUBLIC_LINERA_RPC;
    if (!rpcUrl) throw new Error("NEXT_PUBLIC_LINERA_RPC not set");

    const response = await fetch(`${rpcUrl}/query-balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chain_id: chainId }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Query balance failed");

    return NextResponse.json({ balance: data.balance });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
