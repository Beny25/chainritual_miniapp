// app/api/faucet/route.ts
import { NextResponse } from "next/server";

const FAUCET_URL = process.env.NEXT_PUBLIC_LINERA_FAUCET!;

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json(
        { error: "Missing publicKey" },
        { status: 400 }
      );
    }

    const owner = publicKey.startsWith("0x")
      ? publicKey
      : `0x${publicKey}`;

    const query = `
      mutation {
        claim(owner: "${owner}") {
          origin {
            Child {
              parent
              chain_index
            }
          }
          config {
            balance
          }
        }
      }
    `;

    const res = await fetch(FAUCET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const claim = json.data.claim;
    const chainId = claim.origin.Child.parent;
    const balance = Number(claim.config.balance || 0);

    return NextResponse.json({
      success: true,
      chainId,
      balance,
    });
  } catch (err: any) {
    console.error("FAUCET ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
