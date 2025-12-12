import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();
    if (!publicKey) {
      return NextResponse.json(
        { success: false, error: "Missing publicKey" },
        { status: 400 }
      );
    }

    // Jalankan perintah CLI linera untuk request chain
    // Pastikan local faucet sudah jalan di port 8080
    const cmd = `linera wallet request-chain --faucet http://localhost:8080`;
    const { stdout, stderr } = await execAsync(cmd);

    if (stderr) {
      console.error("Request chain stderr:", stderr);
    }

    console.log("Request chain stdout:", stdout);

    // parsing output stdout bisa disesuaikan, misal ambil chain_id/account_id
    const lines = stdout.trim().split("\n");
    const chainInfo = lines[lines.length - 1]; // biasanya output terakhir chain info

    return NextResponse.json({ success: true, data: chainInfo });
  } catch (err: any) {
    console.error("Request chain error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
