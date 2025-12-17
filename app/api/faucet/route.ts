// app/api/faucet/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json(
        { error: "Missing publicKey" },
        { status: 400 }
      );
    }

    const faucetUrl = process.env.NEXT_PUBLIC_LINERA_FAUCET!;

    const res = await fetch(`${faucetUrl}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: publicKey,
      }),
    });

    const text = await res.text();

    // chainId TIDAK dikirim via response
    // tapi muncul di VPS logs → workaround: return success only
    if (!res.ok) {
      throw new Error(text);
    }

    return NextResponse.json({
      success: true,
      message: "Faucet claimed. Check VPS logs for chainId.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
