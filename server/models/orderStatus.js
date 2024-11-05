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

const OrderStatus = mongoose.model("OrderStatus", orderStatusSchema);

const predefinedOrderStatuses = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

const initializeOrderStatuses = async () => {
  const count = await OrderStatus.countDocuments();
  if (count === 0) {
    for (const statusName of predefinedOrderStatuses) {
      const status = new OrderStatus({ name: statusName });
      await status.save();
    }
    console.log("Predefined order statuses initialized.");
  }
};

initializeOrderStatuses();

module.exports = OrderStatus;
