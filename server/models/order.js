const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  confirmation_date: { type: Date, default: null },
  status_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
    required: true,
  },
  user_name: { type: String, required: true, minlength: 1 },
  email: {
    type: String,
    required: true,
    minlength: 1,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  phone_number: {
    type: String,
    required: true,
    minlength: 1,
    validate: {
      validator: function (v) {
        return /^\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
        validate: {
          validator: Number.isInteger,
          message: "Quantity must be an integer",
        },
      },
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
