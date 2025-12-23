import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json({ success: false, error: "Missing publicKey" });
    }

    const owner = publicKey.startsWith("0x") ? publicKey : "0x" + publicKey;

    // Panggil Rust bridge, bukan langsung 8080
    const BRIDGE_URL = process.env.NEXT_PUBLIC_LINERA_FAUCET!;

    const res = await fetch(`${BRIDGE_URL}/faucet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey: owner }),
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json({ success: false, error: data.error || "Unknown error" });
    }

    return NextResponse.json({ success: true, chainId: data.chainId });
  } catch (err: any) {
    console.error("Faucet API error:", err);
    return NextResponse.json({ success: false, error: err.message || "Unknown error" });
  }
}
