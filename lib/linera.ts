// /lib/linera.ts
const RPC_URL = process.env.NEXT_PUBLIC_LINERA_RPC!;
const APP_ID = process.env.NEXT_PUBLIC_LINERA_APP_ID!;
const CHAIN_ID = process.env.NEXT_PUBLIC_LINERA_CHAIN!;

export async function requestFaucet(publicKey: string) {
  const res = await fetch(`${RPC_URL}/faucet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_key: publicKey }),
  });
  return res.json();
}

export async function getBalance(publicKey: string) {
  const res = await fetch(`${RPC_URL}/balance/${publicKey}`);
  return res.json();
}

export async function sendTokens(
  from: string,
  to: string,
  amount: string,
  signature: string
) {
  const res = await fetch(`${RPC_URL}/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, amount, signature }),
  });
  return res.json();
}
