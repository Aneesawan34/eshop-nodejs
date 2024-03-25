const express = require("express");
const { Product } = require("../models/product");

const Router = express.Router();

Router.get("/", async (req, res) => {
  const productList = await Product.find()
    .populate("category", ["name", "icon", "-_id"])
    .select("-__v");
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(productList);
});

Router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    discription: req.body.discription,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
  });
  const productAdd = await product.save();
  if (!productAdd) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(productAdd);
});

module.exports = Router;
