import { useEffect, useState } from "react";

type Wallet = {
  name: string;
  publicKey: string;
};

export default function WalletManager() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("wallets");
    if (stored) {
      const parsed = JSON.parse(stored);
      setWallets(parsed);
      setSelectedWallet(parsed[0]?.name || "");
    }
  }, []);

  const createWallet = () => {
    const newWallet = {
      name: `Wallet ${wallets.length + 1}`,
      publicKey: crypto.randomUUID(), // ganti dengan beneran keypair
    };
    const updated = [...wallets, newWallet];
    setWallets(updated);
    setSelectedWallet(newWallet.name);
    localStorage.setItem("wallets", JSON.stringify(updated));
  };

  const deleteWallet = (name: string) => {
    const updated = wallets.filter((w) => w.name !== name);
    setWallets(updated);
    setSelectedWallet(updated[0]?.name || "");
    localStorage.setItem("wallets", JSON.stringify(updated));
  };

  const downloadWallet = () => {
    const wallet = wallets.find(w => w.name === selectedWallet);
    if (!wallet) return;
    const blob = new Blob([JSON.stringify(wallet, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${wallet.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 border rounded w-full max-w-md mx-auto bg-white">
      <h2 className="text-lg font-bold mb-2">Your Wallets</h2>

      <select
        className="w-full border p-2 mb-2"
        value={selectedWallet}
        onChange={(e) => setSelectedWallet(e.target.value)}
      >
        {wallets.map((w) => (
          <option key={w.name} value={w.name}>{w.name}</option>
        ))}
      </select>

      <div className="flex flex-col gap-2">
        <button onClick={createWallet} className="bg-green-500 text-white p-2 rounded">
          ➕ Create Wallet
        </button>

        <button onClick={downloadWallet} disabled={!selectedWallet} className="bg-blue-500 text-white p-2 rounded disabled:opacity-50">
          📥 Download Wallet
        </button>

        <button onClick={() => deleteWallet(selectedWallet)} disabled={!selectedWallet} className="bg-red-500 text-white p-2 rounded disabled:opacity-50">
          🗑️ Delete Wallet
        </button>
      </div>

      {selectedWallet && (
        <div className="mt-4 text-sm text-gray-600">
          <strong>Selected Public Key:</strong><br />
          {wallets.find(w => w.name === selectedWallet)?.publicKey}
        </div>
      )}
    </div>
  );
}
