const db = require("../db");

function getUser(id) {
  return db.users.find(u => u.id === id);
}

function createUser(id) {
  const user = { id, balance: 100000, loan: 0, holdings: {}, transactions: [] };
  db.users.push(user);
  return user;
}

function takeLoan(id, amount) {
  const user = getUser(id) || createUser(id);
  if (user.loan + amount > 100000) throw new Error("Loan limit exceeded");
  user.loan += amount;
  user.balance += amount;
  return user;
}

function buyStock(id, stockName, quantity) {
  const user = getUser(id);
  const stock = db.stocks.find(s => s.name === stockName);
  if (!user || !stock) throw new Error("User or stock not found");
  if (stock.quantity < quantity) throw new Error("Not enough stock available");

  const cost = quantity * stock.price;
  if (user.balance < cost) throw new Error("Insufficient balance");

  user.balance -= cost;
  stock.quantity -= quantity;
  user.holdings[stockName] = (user.holdings[stockName] || 0) + quantity;
  user.transactions.push({ type: "BUY", stockName, quantity, price: stock.price });

  return user;
}

function sellStock(id, stockName, quantity) {
  const user = getUser(id);
  const stock = db.stocks.find(s => s.name === stockName);
  if (!user || !stock) throw new Error("User or stock not found");
  if ((user.holdings[stockName] || 0) < quantity) throw new Error("Not enough holdings");

  const gain = quantity * stock.price;
  user.balance += gain;
  stock.quantity += quantity;
  user.holdings[stockName] -= quantity;
  user.transactions.push({ type: "SELL", stockName, quantity, price: stock.price });

  return user;
}

function getUserReport(id) {
  const user = getUser(id);
  if (!user) throw new Error("User not found");

  const currentHoldingsValue = Object.entries(user.holdings).reduce((sum, [stockName, qty]) => {
    const stock = db.stocks.find(s => s.name === stockName);
    return sum + (stock.price * qty);
  }, 0);

  const netWorth = user.balance + currentHoldingsValue - user.loan;

  return {
    id,
    balance: user.balance,
    loan: user.loan,
    holdings: user.holdings,
    transactions: user.transactions,
    netWorth: +netWorth.toFixed(2)
  };
}

module.exports = {
  getUser,
  createUser,
  takeLoan,
  buyStock,
  sellStock,
  getUserReport
};
