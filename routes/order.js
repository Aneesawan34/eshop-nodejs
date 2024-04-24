const express = require("express");
const Order = require("../models/order");
const OrderItem = require("../models/order-item");
const mongoose = require("mongoose");

const Router = express.Router();

Router.get("/", async (req, res) => {
  const order = await Order.find()
    .populate({
      path: "user",
      select: "name email",
    })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
      },
    });
  if (!order) {
    return res.status(400).json({ message: "something went wrong" });
  }
  res.send(order);
});

Router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({ message: "id is not found" });
  }
  const order = await Order.findById(req.params.id)
    .populate({
      path: "user",
      select: "name email",
    })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
      },
    });
  if (!order) {
    return res.status(400).json({ message: "something went wrong" });
  }
  res.send(order);
});

Router.patch("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({ message: "id is not found" });
  }
  const orderUpdated = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  if (!orderUpdated) {
    return res.status(400).json({ message: "something went wrong" });
  }
  res.json(orderUpdated);
});

Router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({ message: "id is not found" });
  }
  Order.findByIdAndDelete(req.params.id)
    .then(async (order) => {
      if (order) {
        order.orderItems.map(async (item) => {
          await OrderItem.findByIdAndDelete(item._id);
        });
        return res.status(400).json({ message: "order has been deleted" });
      }
      return res.status(400).json({ message: "something went wrong--" });
    })
    .catch((err) => {
      return res.status(400).json({ message: "something went wrong---" });
    });
});

Router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrice = await Promise.all(
    orderItemsIdsResolved.map(async (ids) => {
      const orderPrice = await OrderItem.findById(ids).populate(
        "product",
        "price"
      );
      const totalPrice = orderPrice.product.price * orderPrice.quantity;
      return totalPrice;
    })
  );
  const totalPriced = totalPrice.reduce((a, b) => a + b, 0);
  const order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPriced,
    user: req.body.user,
  });
  const orderAdd = await order.save();
  if (!orderAdd) {
    return res.status(400).json({ message: "order cannot be created" });
  }
  res.json(orderAdd);
});

Router.get("/get/total-sales", async (req, res) => {
  const totalSell = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSell: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  if (!totalSell) {
    return res.status(400).json({ message: "something went wrong" });
  }
  const totalSells = totalSell.pop().totalSell;
  res.json({ totalSell: totalSells });
});

Router.get("/get/user-order/:userId", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(200).json({ message: "id is not found" });
  }
  const userOrder = await Order.find({ user: req.params.userId }).populate(
    "orderItems"
  );
  if (!userOrder) {
    res.status(400).json({ message: "something went wrong" });
  }
  res.json(userOrder);
});

module.exports = Router;
