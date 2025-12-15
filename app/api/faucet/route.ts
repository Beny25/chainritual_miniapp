// app/api/faucet/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json({ success: false, error: "Missing publicKey" });
    }

    const VPS_FAUCET_URL = "http://192.210.217.157:8080";

    const query = `
      mutation {
        claim(owner: "${publicKey}")
      }
    `;

    const res = await fetch(VPS_FAUCET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();

    if (data.errors) {
      return NextResponse.json({ success: false, error: data.errors[0].message });
    }

    const balance = data.data?.claim?.config?.balance || "0";

    // Simpan ke localStorage biar WalletBalance update
    const key = "balance_" + publicKey;
    if (typeof window !== "undefined") {
      localStorage.setItem(key, balance);
      window.dispatchEvent(new Event("balance:update")); // trigger update
    }

    return NextResponse.json({ success: true, data: { balance } });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}


