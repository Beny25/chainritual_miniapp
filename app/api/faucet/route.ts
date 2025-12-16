// app/api/faucet/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json({ success: false, error: "Missing publicKey" });
    }

    // Tambahkan prefix 0x otomatis
    const owner = publicKey.startsWith("0x") ? publicKey : "0x" + publicKey;

    const VPS_FAUCET_URL = "http://192.210.217.157:8080"; // Faucet di VPS

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

    const balance = data.data?.claim?.balance || "0";

    return NextResponse.json({ success: true, data: { balance } });
  } catch (err: any) {
    console.error("Faucet API error:", err);
    return NextResponse.json({ success: false, error: err.message || "Unknown error" });
  }
}
