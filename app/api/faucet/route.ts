import { NextResponse } from "next/server";

// ⚡ Jalankan di Edge agar super ringan
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });
    }

    // Faucet SEMENTARA (dummy sampai faucet resmi ada)
    const FAUCET_URL =
      process.env.NEXT_PUBLIC_LINERA_FAUCET ??
      "https://linera-testnet-api.vercel.app/faucet"; // nanti ganti ke faucet asli

    const faucetRes = await fetch(FAUCET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_key: publicKey }),
    });

    if (!faucetRes.ok) {
      return NextResponse.json(
        { error: "Faucet API returned non-OK status", status: faucetRes.status },
        { status: 500 }
      );
    }

    const data = await faucetRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
