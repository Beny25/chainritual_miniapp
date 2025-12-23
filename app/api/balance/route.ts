export async function POST(req: Request) {
  const { chainId } = await req.json();

  if (!chainId) {
    return Response.json(
      { error: "Missing chainId" },
      { status: 400 }
    );
  }

  // Panggil Rust bridge, bukan langsung 13001
  const BRIDGE = process.env.NEXT_PUBLIC_LINERA_RPC!;

  const res = await fetch(`${BRIDGE}/balance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chainId }),
  });

  const json = await res.json();

  return Response.json({
    balance: json.balance ?? 0,
  });
}
