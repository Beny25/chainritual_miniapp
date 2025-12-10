import { NextResponse } from "next/server";

export async function GET() {
  await new Promise((res) => setTimeout(res, 800));

  return NextResponse.json({
    success: true,
    message: "Dummy faucet: 50 Testnet tokens sent successfully!"
  });
}
