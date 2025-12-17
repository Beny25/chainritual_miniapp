import { NextResponse } from "next/server";

// Simulasi penyimpanan chainId di memory (production sebaiknya DB)
const chainIdStore: Record<string, string> = {}; 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    if (!owner) return NextResponse.json({ error: "Missing owner" }, { status: 400 });

    // Simulasi ambil chainId dari VPS internal
    let chainId = chainIdStore[owner];
    if (!chainId) {
      // Misal chainId baru di-generate dari publicKey (production ambil dari VPS log/storage)
      chainId = "chain_" + owner.slice(-8); // contoh dummy
      chainIdStore[owner] = chainId;
    }

    return NextResponse.json({ chainId });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
