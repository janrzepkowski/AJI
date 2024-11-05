const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

statusSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Status = mongoose.model("Status", statusSchema);

const predefinedStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

const initializeStatuses = async () => {
  const count = await Status.countDocuments();
  if (count === 0) {
    for (const statusName of predefinedStatuses) {
      const status = new Status({ name: statusName });
      await status.save();
    }
    console.log("Predefined statuses initialized.");
  }
};

initializeStatuses();

module.exports = Status;
