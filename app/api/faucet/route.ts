// app/api/faucet/route.ts

import { NextResponse } from "next/server";
import { requestFaucet } from "@/services/lineraFaucet";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { publicKey } = body;

    if (!publicKey) {
      return NextResponse.json(
        { error: "Missing publicKey" },
        { status: 400 }
      );
    }

    const result = await requestFaucet(publicKey);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}


