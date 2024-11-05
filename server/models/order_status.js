const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const OrderStatus = mongoose.model("OrderStatus", orderStatusSchema);

module.exports = OrderStatus;