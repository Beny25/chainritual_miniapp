// app/api/request-chain/route.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { requestFaucet } from "@/services/lineraFaucet";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { publicKey } = req.body;

  if (!publicKey) {
    return res.status(400).json({ error: "Missing publicKey" });
  }

  try {
    const result = requestFaucet(publicKey);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
