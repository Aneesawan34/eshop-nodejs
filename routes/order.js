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
  return res.send(order);
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
  return res.send(order);
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
  const order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  const orderAdd = await order.save();
  if (!orderAdd) {
    return res.status(400).json({ message: "order cannot be created" });
  }
  res.json(orderAdd);
});

module.exports = Router;
