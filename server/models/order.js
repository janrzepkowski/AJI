const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  confirmation_date: { type: Date, default: null },
  order_status_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderStatus",
    required: true,
  },
  user_name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
