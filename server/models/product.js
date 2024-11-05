const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1 },
  description: { type: String, required: true, minlength: 1 },
  unit_price: { type: Number, required: true, min: 0.01 },
  unit_weight: { type: Number, required: true, min: 0.01 },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Product", productSchema);
