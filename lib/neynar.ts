// lib/neynar.ts
export async function requestChain(publicKey: string): Promise<string> {
  // di real-case: fetch ke /api/request-chain dengan publicKey
  // return chainId
  const res = await fetch("/api/request-chain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicKey }),
  });
  const data = await res.json();
  if (!data.chainId) throw new Error("Failed to request chain");
  return data.chainId;
}

export async function queryBalance(chainId: string): Promise<number> {
  // fetch ke /api/query-balance atau dummy
  const res = await fetch(`/api/query-balance/${chainId}`);
  const data = await res.json();
  return data.balance ?? 0;
}
