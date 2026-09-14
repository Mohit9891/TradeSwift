// Phase 3 position engine: average-costing intraday positions with signed
// qty (long + / short -), realized P&L on reductions, and product conversion.
const { PositionsModel } = require("../models/PositionsModel");
const { TradeModel } = require("../models/TradeModel");

// Apply one fill to the (user, symbol, product) position. Creates the
// position if absent. Returns { position, realizedDelta }.
async function applyFill(userMobile, symbol, product, mode, qty, price, opts = {}) {
  const signed = mode === "BUY" ? qty : -qty;
  await TradeModel.create({
    userMobile, symbol, product, mode, qty, price,
    orderRef: opts.orderRef, note: opts.note,
  });

  let pos = await PositionsModel.findOne({ userMobile, name: symbol, product });
  if (!pos) {
    pos = await PositionsModel.create({
      userMobile, product, name: symbol, qty: signed, avg: price, price,
      realizedPnl: 0, net: "0.00%", day: "0.00%", isLoss: false,
    });
    return { position: pos, realizedDelta: 0 };
  }

  let realizedDelta = 0;
  const newQty = pos.qty + signed;
  if (pos.qty !== 0 && Math.sign(newQty) !== Math.sign(pos.qty) && newQty !== 0) {
    // Flip: close old side fully (book it), open remainder at fill price.
    realizedDelta = (price - pos.avg) * pos.qty;
    pos.qty = newQty;
    pos.avg = price;
  } else if (Math.sign(signed) === Math.sign(pos.qty) || pos.qty === 0) {
    // Adding (or opening): re-average.
    pos.avg = (pos.avg * Math.abs(pos.qty) + price * Math.abs(signed)) / Math.abs(newQty);
    pos.qty = newQty;
  } else {
    // Reducing: book realized on the closed part.
    const closed = Math.min(Math.abs(signed), Math.abs(pos.qty));
    realizedDelta = (price - pos.avg) * Math.sign(pos.qty) * closed;
    pos.qty = newQty;
  }
  pos.realizedPnl = (pos.realizedPnl || 0) + realizedDelta;
  pos.price = price;
  pos.updatedAt = new Date();
  if (pos.qty === 0) {
    await PositionsModel.deleteOne({ _id: pos._id });
    return { position: null, realizedDelta };
  }
  await pos.save();
  return { position: pos, realizedDelta };
}

// Close the full position at `price`. Returns { closedQty, realized }.
async function squareOff(userMobile, symbol, product, price) {
  const pos = await PositionsModel.findOne({ userMobile, name: symbol, product });
  if (!pos || pos.qty === 0) return { closedQty: 0, realized: 0 };
  const mode = pos.qty > 0 ? "SELL" : "BUY";
  const { realizedDelta } = await applyFill(userMobile, symbol, product, mode, Math.abs(pos.qty), price, { note: "SQUARE_OFF" });
  return { closedQty: Math.abs(pos.qty), realized: realizedDelta };
}

// Move qty between products. MIS->CNC lands in holdings (handled by caller
// via onConverted hook); this service moves position-side state.
async function convertProduct(userMobile, symbol, fromProduct, toProduct, qty) {
  const pos = await PositionsModel.findOne({ userMobile, name: symbol, product: fromProduct });
  if (!pos || Math.abs(pos.qty) < qty) throw new Error("Insufficient position qty to convert");
  if (pos.qty < 0 && toProduct === "CNC") throw new Error("Cannot convert short to delivery");
  // Carve out: reduce source at cost (no P&L — a transfer, not a trade).
  pos.qty -= Math.sign(pos.qty) * qty;
  const avg = pos.avg;
  if (pos.qty === 0) await PositionsModel.deleteOne({ _id: pos._id });
  else await pos.save();
  return { qty, avg };
}

// Receive a converted parcel into a position: re-average at transfer cost,
// no trade record, no P&L (a transfer, not a fill).
async function receiveTransfer(userMobile, symbol, toProduct, qty, avg, price) {
  let pos = await PositionsModel.findOne({ userMobile, name: symbol, product: toProduct });
  if (!pos) {
    pos = await PositionsModel.create({
      userMobile, product: toProduct, name: symbol, qty, avg, price,
      realizedPnl: 0, net: "0.00%", day: "0.00%", isLoss: false,
    });
    return pos;
  }
  pos.avg = (pos.avg * Math.abs(pos.qty) + avg * qty) / (Math.abs(pos.qty) + qty);
  pos.qty += Math.sign(pos.qty || 1) * qty;
  pos.price = price;
  pos.updatedAt = new Date();
  await pos.save();
  return pos;
}

module.exports = { applyFill, squareOff, convertProduct, receiveTransfer };
