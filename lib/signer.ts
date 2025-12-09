import * as ed from "@noble/ed25519";

export async function signMessage(message: Uint8Array, privateKey: string) {
  const pkBytes = ed.utils.hexToBytes(privateKey);
  const signature = await ed.sign(message, pkBytes);
  return signature;
}

