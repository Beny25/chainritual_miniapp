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

    // Conway Testnet Faucet
    const FAUCET_URL =
      process.env.NEXT_PUBLIC_LINERA_FAUCET ||
      "https://faucet.testnet-conway.linera.net";

    const res = await fetch(FAUCET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: publicKey }), // format WAJIB owner
    });

    const text = await res.text();

    // coba parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: true, status: res.status, message: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true, faucet: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
        }
