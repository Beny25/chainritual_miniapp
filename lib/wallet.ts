import nacl from "tweetnacl";

const STORAGE_KEY = "linera_wallet";
const WALLETS_KEY = "linera_all_wallets";

// Create a new wallet
export function createWallet() {
  const keyPair = nacl.sign.keyPair();

  const wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: Buffer.from(keyPair.secretKey).toString("hex"),
  };

  saveWallet(wallet);
  return wallet;
}

// Save wallet to localStorage and update list
export function saveWallet(wallet: any) {
  // Save as current
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));

  // Save in list
  const all = getAllWallets();
  const exists = all.find((w) => w.publicKey === wallet.publicKey);
  if (!exists) {
    all.push(wallet);
    localStorage.setItem(WALLETS_KEY, JSON.stringify(all));
  }
}

// Download wallet as file
export function downloadWallet(wallet: any) {
  const blob = new Blob([JSON.stringify(wallet, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "linera-wallet.json";
  a.click();
}

// Load wallet from uploaded file
export async function loadWallet(file: File) {
  const text = await file.text();
  const wallet = JSON.parse(text);
  saveWallet(wallet);
  return wallet;
}

// Load wallet from secret key hex
export async function loadWalletFromSecretKey(secretKeyHex: string) {
  const secretKey = Uint8Array.from(
    secretKeyHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  if (secretKey.length !== nacl.sign.secretKeyLength) {
    throw new Error("Invalid secret key length");
  }

  const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);

  const wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: secretKeyHex,
  };

  saveWallet(wallet);
  return wallet;
}

// Get current active wallet
export function getWalletFromLocal(): any | null {
  const w = localStorage.getItem(STORAGE_KEY);
  if (!w) return null;
  return JSON.parse(w);
}

// Get all saved wallets
export function getAllWallets(): any[] {
  const list = localStorage.getItem(WALLETS_KEY);
  if (!list) return [];
  return JSON.parse(list);
}

// Delete wallet by publicKey
export function deleteWallet(publicKey: string) {
  const all = getAllWallets().filter((w) => w.publicKey !== publicKey);
  localStorage.setItem(WALLETS_KEY, JSON.stringify(all));

  const current = getWalletFromLocal();
  if (current?.publicKey === publicKey) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Clear current wallet
export function clearWallet() {
  localStorage.removeItem(STORAGE_KEY);
}
