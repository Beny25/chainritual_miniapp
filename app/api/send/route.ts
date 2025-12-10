import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { from, to, amount, signature } = await req.json();

    return NextResponse.json({
      success: true,
      message: "Dummy transfer simulated.",
      from,
      to,
      amount,
      signature,
      txId: "0xtest-" + Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
