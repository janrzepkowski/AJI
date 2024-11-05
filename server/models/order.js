const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  confirmation_date: { type: Date, default: null },
  status_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
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

orderSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Order", orderSchema);
