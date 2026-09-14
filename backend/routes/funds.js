const express = require("express");
const router = express.Router();
const { authMiddleware } = require("./auth");
const { getFunds, addEntry } = require("../services/fundsService");
const { LedgerModel } = require("../models/LedgerModel");

const toPaise = (rupees) => Math.round(Number(rupees) * 100);

router.get("/", authMiddleware, async (req, res) => {
  res.json(await getFunds(req.user.mobile));
});

router.get("/ledger", authMiddleware, async (req, res) => {
  const rows = await LedgerModel.find({ userMobile: req.user.mobile })
    .sort({ _id: -1 })
    .limit(100);
  res.json(rows);
});

router.post("/payin", authMiddleware, async (req, res) => {
  const paise = toPaise(req.body.rupees);
  if (!paise || paise <= 0) return res.status(400).send("rupees must be > 0");
  const balancePaise = await addEntry(req.user.mobile, "PAYIN", paise, {
    note: "Demo UPI payin",
  });
  res.json({ balancePaise });
});

router.post("/payout", authMiddleware, async (req, res) => {
  const paise = toPaise(req.body.rupees);
  if (!paise || paise <= 0) return res.status(400).send("rupees must be > 0");
  const { availablePaise } = await getFunds(req.user.mobile);
  if (paise > availablePaise) return res.status(400).send("Insufficient funds");
  const balancePaise = await addEntry(req.user.mobile, "PAYOUT", -paise, {
    note: "Demo withdrawal",
  });
  res.json({ balancePaise });
});

module.exports = router;
