const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

orderStatusSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("OrderStatus", orderStatusSchema);
