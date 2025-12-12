// lib/neynar.ts
export async function requestChain(publicKey: string): Promise<string> {
  try {
    const res = await fetch("/api/request-chain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to request chain");
    
    // data.chainId diharapkan dikirim dari backend faucet
    return data.chainId;
  } catch (err: any) {
    console.error("requestChain failed:", err);
    throw err;
  }
}

export async function queryBalance(chainId: string): Promise<number> {
  try {
    const res = await fetch("/api/query-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chainId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to query balance");

    return data.balance;
  } catch (err: any) {
    console.error("queryBalance failed:", err);
    throw err;
  }
}
