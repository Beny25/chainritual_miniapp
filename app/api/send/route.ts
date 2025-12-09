import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { from, to, amount, signature } = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_LINERA_RPC}/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, amount, signature }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
