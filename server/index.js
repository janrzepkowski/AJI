const express = require("express");
const cors = require("cors");
const mongoose = require("./db");
const { StatusCodes } = require("http-status-codes");
const Groq = require("groq-sdk");
const axios = require("axios");

const Product = require("./models/product");
const Category = require("./models/category");
const Order = require("./models/order");
const Status = require("./models/status");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const app = express();

app.use(cors());
app.use(express.json());

const statusOrder = {
  PENDING: 1,
  CONFIRMED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
};

// Products
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
        res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" });
      }
    })
    .catch((error) => next(error));
});

app.get("/api/products/:id/seo-description", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Product not found" });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an SEO expert. Generate an SEO-friendly description for the following product: ${product.name}, ${product.description}, priced at ${product.unit_price}.`,
        },
        {
          role: "user",
          content: `Product Name: ${product.name}\nDescription: ${product.description}\nPrice: ${product.unit_price}`,
        },
      ],
      model: "llama3-8b-8192",
    });

    const seoDescription =
      response.choices[0]?.message?.content || "No description available";

    res.send(`<html><body>${seoDescription}</body></html>`);
  } catch (error) {
    next(error);
  }
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
      res.status(StatusCodes.CREATED).json(savedProduct);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
      } else {
        next(error);
      }
    });
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
        res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" });
      }
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
      } else {
        next(error);
      }
    });
});

app.delete("/api/products/:id", (req, res, next) => {
  Product.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(StatusCodes.NO_CONTENT).end();
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" });
      }
    })
    .catch((error) => next(error));
});

// Categories
app.get("/api/categories", (req, res) => {
  Category.find({}).then((categories) => {
    res.json(categories);
  });
});

// Orders
app.get("/api/orders", (req, res) => {
  Order.find({})
    .populate("status_id")
    .populate("products.product_id")
    .then((orders) => {
      res.json(orders);
    });
});

app.get("/api/orders/:id", (req, res, next) => {
  Order.findById(req.params.id)
    .populate("status_id")
    .populate("products.product_id")
    .then((order) => {
      if (order) {
        res.json(order);
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
      }
    })
    .catch((error) => next(error));
});

app.get("/api/orders/status/:id", (req, res, next) => {
  Order.find({ status_id: req.params.id })
    .populate("status_id")
    .populate("products.product_id")
    .then((orders) => {
      res.json(orders);
    })
    .catch((error) => next(error));
});

app.post("/api/orders", async (req, res, next) => {
  const { status_id, user_name, email, phone_number, products } = req.body;

  try {
    const productIds = products.map((p) => p.product_id);
    const existingProducts = await Product.find({ _id: { $in: productIds } });

    if (existingProducts.length !== productIds.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "One or more products do not exist" });
    }

    const order = new Order({
      confirmation_date: new Date(),
      status_id,
      user_name,
      email,
      phone_number,
      products,
    });

    const savedOrder = await order.save();
    res.status(StatusCodes.CREATED).json(savedOrder);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

app.patch("/api/orders/:id", async (req, res, next) => {
  const updates = req.body;

  try {
    const order = await Order.findById(req.params.id).populate("status_id");

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }

    if (order.status_id.name === "CANCELLED") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Cannot update a cancelled order" });
    }

    if (updates.status_id) {
      const newStatus = await Status.findById(updates.status_id);
      if (!newStatus) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid status" });
      }

      if (statusOrder[newStatus.name] < statusOrder[order.status_id.name]) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Cannot change status backwards" });
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

// Order statuses
app.get("/api/status", (req, res) => {
  Status.find({}).then((statuses) => {
    res.json(statuses);
  });
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
