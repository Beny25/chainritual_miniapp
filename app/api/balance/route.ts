// app/api/balance/route.ts
export async function POST(req: Request) {
  const { chainId } = await req.json();

  if (!chainId) {
    return Response.json(
      { error: "Missing chainId" },
      { status: 400 }
    );
  }

  const rpc = process.env.NEXT_PUBLIC_LINERA_RPC!;

  const res = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query {
          chain(chainId: "${chainId}") {
            balance
          }
        }
      `,
    }),
  });

  const json = await res.json();

  return Response.json({
    balance: json.data.chain.balance,
  });
}
