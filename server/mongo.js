const mongoose = require("mongoose");
require("dotenv").config();

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const categoryName = process.argv[3];

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Category = mongoose.model("Category", categorySchema);

const category = new Category({
  name: categoryName,
});

if (process.argv.length === 4) {
  category.save().then((result) => {
    console.log(`added category ${categoryName} to database`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Category.find({}).then((result) => {
    console.log("categories:");
    result.forEach((category) => {
      console.log(category.name);
    });
    mongoose.connection.close();
  });
}