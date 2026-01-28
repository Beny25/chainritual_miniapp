import { execSync } from "child_process";

type FaucetResult = {
  chainId: string;
  balance: string;
};

export function requestFaucet(publicKey: string): FaucetResult {
  // 1. Create new chain for user
  const createChainOutput = execSync(
    `linera wallet request-chain --owner ${publicKey}`,
    { encoding: "utf-8" }
  );

  // contoh output ada chain id
  // Extract chainId (simple parse, bisa dirapihin)
  const chainIdMatch = createChainOutput.match(/[a-f0-9]{64}/);
  if (!chainIdMatch) {
    throw new Error("Failed to create chain");
  }

  const chainId = chainIdMatch[0];

  // 2. Request faucet for that chain
  execSync(
    `linera faucet request --chain-id ${chainId}`,
    { encoding: "utf-8" }
  );

  // 3. Query balance
  const balanceOutput = execSync(
    `linera query-balance ${chainId}`,
    { encoding: "utf-8" }
  );

  return {
    chainId,
    balance: balanceOutput.trim(),
  };
}
