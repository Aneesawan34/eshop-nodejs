const express = require("express");
const mongoose = require("mongoose");
const OrderItem = require("../models/order-item");

const Router = express.Router();

Router.get("/", async (req, res) => {
  const orderItems = await OrderItem.find();
  if (!orderItems) {
    return res.status(400).json({ message: "something went wrong" });
  }
  return res.send(orderItems);
});

Router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({ message: "id is not found" });
  }
  const orderItems = await OrderItem.findByIdAndDelete(req.params.id);
  if (!orderItems) {
    return res.status(400).json({ message: "something went wrong" });
  }
  return res.send(orderItems);
});

module.exports = Router;
