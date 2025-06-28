const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const userIds = Array.from({ length: 10 }, (_, i) => `user${i + 1}`);
const stockName = 'TCS';

async function initialize() {
  try {
    // Register stock once
    await axios.post(`${BASE_URL}/stocks/register`, {
      name: stockName,
      quantity: 100000,
      price: 50
    });

    // Each user takes a loan
    for (const userId of userIds) {
      await axios.post(`${BASE_URL}/users/loan`, {
        userId,
        amount: 100000
      });
      console.log(`Loan issued to ${userId}`);
    }

  } catch (error) {
    console.error('Initialization failed:', error.response?.data || error.message);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function simulateTrades() {
  const userId = userIds[Math.floor(Math.random() * userIds.length)];
  const action = Math.random() < 0.7 ? 'buy' : 'sell'; // 70% buy, 30% sell
  const quantity = getRandomInt(1, 20);

  try {
    if (action === 'buy') {
      await axios.post(`${BASE_URL}/users/buy`, {
        userId,
        stockName,
        quantity
      });
      console.log(`${userId} bought ${quantity} shares of ${stockName}`);
    } else {
      await axios.post(`${BASE_URL}/users/sell`, {
        userId,
        stockName,
        quantity
      });
      console.log(`${userId} sold ${quantity} shares of ${stockName}`);
    }
  } catch (err) {
    console.log(`${userId} failed to ${action}: ${err.response?.data?.error || err.message}`);
  }
}

async function main() {
  await initialize();

  // Run simulateTrades every 3 seconds
  setInterval(simulateTrades, 3000);
}

main();
