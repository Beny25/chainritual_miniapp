import * as ed from "@noble/ed25519";
import { hexToBytes } from "@noble/hashes/utils";

export async function signMessage(message: Uint8Array, privateKey: string) {
  // Convert hex → Uint8Array
  const pkBytes = hexToBytes(privateKey);

  // noble-ed25519 expects Uint8Array private key
  const signature = await ed.sign(message, pkBytes);

  return signature;
}

