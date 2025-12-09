import * as ed from "@noble/ed25519";

// Manual hex → bytes (aman di browser & Vercel)
function hexToBytes(hex: string): Uint8Array {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  if (hex.length % 2 !== 0)
    throw new Error("Invalid hex string");

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export async function signMessage(message: Uint8Array, privateKey: string) {
  const pkBytes = hexToBytes(privateKey);
  const signature = await ed.sign(message, pkBytes);
  return signature;
}
