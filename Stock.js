const db = require("../db");

function registerStock(name, quantity, price) {
  const stock = { name, quantity, price, history: [price] };
  db.stocks.push(stock);
  return stock;
}

function updatePrices() {
  db.stocks.forEach(stock => {
    const newPrice = +(Math.random() * 99 + 1).toFixed(2);
    stock.price = newPrice;
    stock.history.push(newPrice);
  });
}

module.exports = { registerStock, updatePrices };
