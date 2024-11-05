const express = require("express");
const cors = require("cors");
const mongoose = require("./db");
require("dotenv").config();

const Product = require("./models/product");
const Category = require("./models/category");
const Order = require("./models/order");
const OrderStatus = require("./models/orderStatus");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/products", (req, res) => {
  Product.find({}).then((products) => {
    res.json(products);
  });
});

app.get("/api/products/:id", (req, res, next) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/products", (req, res, next) => {
  const body = req.body;

  const product = new Product({
    name: body.name,
    description: body.description,
    unit_price: body.unit_price,
    unit_weight: body.unit_weight,
    category_id: body.category_id,
  });

  product
    .save()
    .then((savedProduct) => {
      res.json(savedProduct);
    })
    .catch((error) => next(error));
});

app.put("/api/products/:id", (req, res, next) => {
  const { name, description, unit_price, unit_weight, category_id } = req.body;

  const product = { name, description, unit_price, unit_weight, category_id };

  Product.findByIdAndUpdate(req.params.id, product, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedProduct) => {
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/products/:id", (req, res, next) => {
  Product.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
