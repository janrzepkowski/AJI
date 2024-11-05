const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

categorySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Category = mongoose.model("Category", categorySchema);

const predefinedCategories = [
  "E-bike",
  "Bikes",
  "Accessories",
  "Trainers",
  "Components & Spares",
  "Workshop",
  "Clothing",
  "Helmets",
  "Shoes",
  "New Arrivals",
  "Special Offer",
];

const initializeCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    for (const categoryName of predefinedCategories) {
      const category = new Category({ name: categoryName });
      await category.save();
    }
    console.log("Predefined categories initialized.");
  }
};

initializeCategories();

module.exports = Category;
