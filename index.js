const express = require("express");
const app = express();
const PORT = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Middleware
app.use(express.json());

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock Trading Simulation API",
      version: "1.0.0",
      description: "API documentation for stock trading simulation project"
    }
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes
const stockRoutes = require("./routes/stocks");
const userRoutes = require("./routes/users");
app.use("/stocks", stockRoutes);
app.use("/users", userRoutes);

// Price updater (background job)
//require("./priceUpdater")();

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}\n📚 Swagger Docs at http://localhost:${PORT}/api-docs`));
