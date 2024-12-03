const express = require("express");
const router = express.Router();
const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");
const {
  verifyToken,
  verifyEmployeeRole,
} = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  Product.find({}).then((products) => {
    res.json(products);
  });
});

router.get("/:id", (req, res, next) => {
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

router.get("/:id/seo-description", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Product not found" });
    }

    const data = {
      messages: [
        {
          role: "system",
          content: `You are an SEO expert. Generate an SEO-friendly description for the following product: ${product.name}, ${product.description}, priced at ${product.unit_price}.
                    In response, type only the SEO description without any quotation marks.`,
        },
        {
          role: "user",
          content: `Product Name: ${product.name}\nDescription: ${product.description}\nPrice: ${product.unit_price}`,
        },
      ],
      model: "llama3-8b-8192",
    };

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const seoDescription =
      response.data.choices[0]?.message?.content || "No description available";

    res.send(`<html><body>${seoDescription}</body></html>`);
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyToken, verifyEmployeeRole, (req, res, next) => {
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

router.put("/:id", verifyToken, verifyEmployeeRole, (req, res, next) => {
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

router.delete("/:id", verifyToken, verifyEmployeeRole, (req, res, next) => {
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

module.exports = router;
