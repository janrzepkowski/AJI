const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const Order = require("../models/order");
const Product = require("../models/product");
const Status = require("../models/status");
const { verifyToken } = require("../middleware/authMiddleware");

const statusOrder = {
  PENDING: 1,
  CONFIRMED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
};

router.get("/", verifyToken, (req, res) => {
  Order.find({})
    .populate("status_id")
    .populate("products.product_id")
    .then((orders) => {
      res.json(orders);
    });
});

router.get("/:id", verifyToken, (req, res, next) => {
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

router.get("/status/:id", verifyToken, (req, res, next) => {
  Order.find({ status_id: req.params.id })
    .populate("status_id")
    .populate("products.product_id")
    .then((orders) => {
      res.json(orders);
    })
    .catch((error) => next(error));
});

router.post("/", verifyToken, async (req, res, next) => {
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

router.patch("/:id", verifyToken, async (req, res, next) => {
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

module.exports = router;
