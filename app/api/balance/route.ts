// app/api/balance/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { publicKey } = await req.json();
  if (!publicKey) return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });

  try {
    const owner = publicKey.startsWith("0x") ? publicKey : "0x" + publicKey;
    const VPS_FAUCET_URL = "http://192.210.217.157:8080";

    const query = `
      query {
        wallet(owner: "${owner}") {
          config {
            balance
          }
        }
      }
    `;

    const res = await fetch(VPS_FAUCET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    const balance = data?.data?.wallet?.config?.balance ?? 0;

    return NextResponse.json({ balance });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
      }
