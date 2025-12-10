const BALANCE_KEY = "linera_balances";

function getBalances() {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem(BALANCE_KEY) || "{}");
}

function saveBalances(balances: any) {
  localStorage.setItem(BALANCE_KEY, JSON.stringify(balances));
}

export function fetchBalance(publicKey: string) {
  const balances = getBalances();
  return balances[publicKey] || 0;
}

export function requestFaucet(publicKey: string) {
  const balances = getBalances();
  const amount = 10; // faucet tokens

  balances[publicKey] = (balances[publicKey] || 0) + amount;
  saveBalances(balances);

  return { success: true, amount };
}

export function sendTokens(from: string, to: string, amount: number) {
  const balances = getBalances();

  if ((balances[from] || 0) < amount) {
    return { success: false, error: "Insufficient balance" };
  }

  balances[from] -= amount;
  balances[to] = (balances[to] || 0) + amount;

  saveBalances(balances);

  return { success: true };
}
