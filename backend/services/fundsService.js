// Funds = derived truth from the append-only ledger (paise integers).
const { LedgerModel } = require("../models/LedgerModel");

const OPENING_BALANCE_PAISE = 100000 * 100; // ₹1,00,000 demo float

async function lastBalancePaise(userMobile) {
  const last = await LedgerModel.findOne({ userMobile }).sort({ _id: -1 });
  return last ? last.balanceAfterPaise : null;
}

// Lazy opening balance so every user (incl. pre-Phase-0 ones) has funds.
async function ensureOpeningBalance(userMobile) {
  const bal = await lastBalancePaise(userMobile);
  if (bal !== null) return bal;
  await LedgerModel.create({
    userMobile,
    kind: "OPENING",
    amountPaise: OPENING_BALANCE_PAISE,
    balanceAfterPaise: OPENING_BALANCE_PAISE,
    note: "Demo opening balance",
  });
  return OPENING_BALANCE_PAISE;
}

async function addEntry(userMobile, kind, amountPaise, { ref, note } = {}) {
  await ensureOpeningBalance(userMobile);
  const bal = await lastBalancePaise(userMobile);
  const entry = await LedgerModel.create({
    userMobile,
    kind,
    amountPaise,
    balanceAfterPaise: bal + amountPaise,
    ref,
    note,
  });
  return entry.balanceAfterPaise;
}

// Margin blocks are debited straight out of the running balance, so the
// balance already excludes held margin: available == balance. blockedPaise
// is reported separately for display only (never subtract it again).
async function getFunds(userMobile) {
  const balancePaise = await ensureOpeningBalance(userMobile);
  const agg = await LedgerModel.aggregate([
    { $match: { userMobile } },
    { $group: { _id: "$kind", total: { $sum: "$amountPaise" } } },
  ]);
  const byKind = Object.fromEntries(agg.map((r) => [r._id, r.total]));
  const blockedPaise = -(byKind.MARGIN_BLOCK || 0) - (byKind.MARGIN_RELEASE || 0);
  return {
    balancePaise,
    availablePaise: balancePaise,
    blockedPaise,
    payinPaise: byKind.PAYIN || 0,
    payoutPaise: -(byKind.PAYOUT || 0),
  };
}

module.exports = {
  ensureOpeningBalance,
  addEntry,
  getFunds,
  OPENING_BALANCE_PAISE,
};
