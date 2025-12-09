import WalletCreateForm from "@/components/WalletCreateForm";
import WalletLoadForm from "@/components/WalletLoadForm";

export default function Page() {
  return (
    <div className="max-w-xl mx-auto mt-12 space-y-6">
      <h1 className="text-2xl font-bold">Linera Wallet</h1>

      <WalletCreateForm />
      <WalletLoadForm />
    </div>
  );
}
