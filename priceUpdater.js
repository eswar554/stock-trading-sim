const { updatePrices } = require("./models/Stock");

module.exports = function () {
  console.log("Starting stock price updater (every 5 minutes simulated every 10 seconds)...");
  setInterval(() => {
    updatePrices();
    console.log("Stock prices updated.");
  }, 10000); // 10s = 5 minutes in simulation
};
