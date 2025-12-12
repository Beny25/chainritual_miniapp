// request-chain.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { publicKey } = req.body;
  if (!publicKey) return res.status(400).json({ error: "Missing publicKey" });

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LINERA_FAUCET}/request-chain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: publicKey }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Faucet request failed");

    // kembalikan chainId dari faucet
    res.status(200).json({ chainId: data.chainId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
