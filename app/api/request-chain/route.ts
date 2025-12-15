// app/api/request-chain/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { publicKey } = await req.json();

  if (!publicKey) {
    return NextResponse.json({ success: false, error: "Missing publicKey" });
  }

  try {
    const faucetUrl = process.env.NEXT_PUBLIC_LINERA_FAUCET;

    // request chain ke faucet
    const res = await fetch(`${faucetUrl}/request-chain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: publicKey,
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}

