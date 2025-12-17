// app/api/balance/route.ts
import { NextResponse } from "next/server";

const RPC_URL = process.env.NEXT_PUBLIC_LINERA_RPC!;

export async function POST(req: Request) {
  try {
    const { chainId } = await req.json();

    if (!chainId) {
      return NextResponse.json(
        { error: "Missing chainId" },
        { status: 400 }
      );
    }

    const query = `
      query {
        chain(chainId: "${chainId}") {
          config {
            balance
          }
        }
      }
    `;

    const res = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const balance = Number(json.data.chain.config.balance || 0);

    return NextResponse.json({ balance });
  } catch (err: any) {
    console.error("BALANCE ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
