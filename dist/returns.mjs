import {run} from "./engine.mjs";

const reasons = new Set(["damaged","wrong-item","changed-mind","other"]);
export function submitReturn({order,reason}, storage) {
  const id = String(order ?? "").trim().toUpperCase();
  if (!/^RX-\d{3}$/.test(id)) return {status:"invalid",message:"Enter an order number in the format RX-104."};
  if (!reasons.has(reason)) return {status:"invalid",message:"Choose a reason for the return."};
  const decision = run(id);
  if (decision.status !== "review") {
    return {
      status: decision.status,
      message: decision.status === "retry"
        ? "We couldn’t reach the order service. No refund was processed. Please try again later."
        : decision.status === "clarify"
        ? "We couldn’t find that order. Check your order number and try again."
        : decision.reply
    };
  }
  const key = "relay.demo.refund." + id;
  try {
    const raw = storage.getItem(key);
    const existing = raw ? JSON.parse(raw) : null;
    if (existing) return {status:"duplicate",receipt:existing,message:"A demo refund already exists for this order. No second refund was processed."};
    const receipt = {id:"RF-" + id.slice(3),order:id,amount:decision.draft.amount,reason};
    storage.setItem(key,JSON.stringify(receipt));
    return {status:"refunded",receipt,message:"Your return was approved and the demo refund was processed automatically."};
  } catch {
    return {status:"retry",message:"We couldn’t save your return in this browser. No refund was confirmed. Enable site storage and try again."};
  }
}
