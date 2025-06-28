const express = require("express");
const router = express.Router();
const {
  createUser, takeLoan, buyStock, sellStock, getUserReport
} = require("../models/User");
const db = require("../db");

// Take Loan
router.post("/loan", (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = takeLoan(userId, amount);
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Buy Stock
router.post("/buy", (req, res) => {
  try {
    const { userId, stockName, quantity } = req.body;
    const user = buyStock(userId, stockName, quantity);
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Sell Stock
router.post("/sell", (req, res) => {
  try {
    const { userId, stockName, quantity } = req.body;
    const user = sellStock(userId, stockName, quantity);
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get User Report
router.get("/report", (req, res) => {
  try {
    const { userId } = req.query;
    const report = getUserReport(userId);
    res.json(report);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Top Users by net worth
router.get("/top", (req, res) => {
  const reports = db.users.map(u => getUserReport(u.id));
  const top = reports.sort((a, b) => b.netWorth - a.netWorth).slice(0, 5);
  res.json(top);
});

module.exports = router;
