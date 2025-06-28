const express = require("express");
const router = express.Router();
const db = require("../db");
const { registerStock } = require("../models/Stock");

// Register new stock
router.post("/register", (req, res) => {
  const { name, quantity, price } = req.body;
  const stock = registerStock(name, quantity, price);
  res.json(stock);
});

// Stock price history
router.get("/history", (req, res) => {
  res.json(db.stocks.map(s => ({ name: s.name, history: s.history })));
});

// Stock report
router.get("/report", (req, res) => {
  const report = db.stocks.map(s => ({
    name: s.name,
    price: s.price,
    available: s.quantity
  }));
  res.json(report);
});

// Top stocks (based on price change)
router.get("/top", (req, res) => {
  const top = [...db.stocks]
    .sort((a, b) => (b.price - b.history[0]) - (a.price - a.history[0]))
    .slice(0, 5)
    .map(s => ({ name: s.name, price: s.price }));

  res.json(top);
});

/**
 * @swagger
 * /stocks/register:
 *   post:
 *     summary: Register a new stock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Stock registered
 */


module.exports = router;
