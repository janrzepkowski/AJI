const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { StatusCodes } = require("http-status-codes");

const authRouter = require("./routes/authRoutes");
const productsRouter = require("./routes/productRoutes");
const ordersRouter = require("./routes/orderRoutes");
const categoriesRouter = require("./routes/categoryRoutes");
const statusRouter = require("./routes/statusRoutes");
const verifyToken = require("./middleware/authMiddleware");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/status", statusRouter);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
