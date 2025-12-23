// app/api/faucet/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json({ success: false, error: "Missing publicKey" });
    }

    const owner = publicKey.startsWith("0x") ? publicKey : "0x" + publicKey;

    const VPS_FAUCET_URL = "http://208.76.40.208:8080"; // Faucet di VPS

    const query = `mutation { claim(owner: "${owner}") }`;

    const res = await fetch(VPS_FAUCET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();

    if (data.errors) {
      return NextResponse.json({ success: false, error: data.errors[0].message });
    }

    // Balance biasanya 0 dulu, chainId akan diambil via /api/chainId
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Faucet API error:", err);
    return NextResponse.json({ success: false, error: err.message || "Unknown error" });
  }
}
