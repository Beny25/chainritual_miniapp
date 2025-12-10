import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });
    }

    // Faucet Conway
    const faucetUrl = `https://faucet.testnet-conway.linera.net/faucet?account=${publicKey}`;

    const res = await fetch(faucetUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Faucet API returned non-OK status", status: res.status },
        { status: 500 }
      );
    }

    const text = await res.text();

    return NextResponse.json({ message: text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
