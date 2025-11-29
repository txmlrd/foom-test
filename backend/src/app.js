require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");
const purchaseRequestRoutes = require("./routes/purchaseRequestRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/warehouses", warehouseRoutes);
app.use("/products", productRoutes);
app.use("/stocks", stockRoutes);
app.use("/purchase", purchaseRequestRoutes);
app.use("/webhook", webhookRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
