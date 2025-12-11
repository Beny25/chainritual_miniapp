import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { from, to, amount } = await req.json();

    // VALIDATION
    if (!from || from.length < 10)
      return NextResponse.json({ error: "Invalid sender public key" }, { status: 400 });

    if (!to || to.length < 10)
      return NextResponse.json({ error: "Invalid recipient public key" }, { status: 400 });

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0)
      return NextResponse.json({ error: "Amount must be > 0" }, { status: 400 });

    // LOCAL STORAGE WALLET SIMULATION (DUMMY)
    const senderKey = "balance_" + from;
    const receiverKey = "balance_" + to;

    const senderBalance = Number(localStorage.getItem(senderKey) || 0);
    const receiverBalance = Number(localStorage.getItem(receiverKey) || 0);

    if (senderBalance < amt)
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

    // UPDATE BOTH SIDES
    localStorage.setItem(senderKey, String(senderBalance - amt));
    localStorage.setItem(receiverKey, String(receiverBalance + amt));

    // BROADCAST UPDATE (buat 2 wallet sekaligus)
    window.dispatchEvent(new CustomEvent("balance:update", {
      detail: { publicKey: from, balance: senderBalance - amt }
    }));

    window.dispatchEvent(new CustomEvent("balance:update", {
      detail: { publicKey: to, balance: receiverBalance + amt }
    }));

    return NextResponse.json({
      success: true,
      txId: "0xtest-" + Date.now()
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
