const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category");
var mongoose = require("mongoose");

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
  if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }
  const category = await Category.findById(req.body.category);
  if (!category)
    return res
      .status(400)
      .json({ success: false, message: "Category id not found" });

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
    res.status(500).json({ success: falsem, message: "Product did not add" });
  }
  res.status(200).json(productAdd);
});

Router.get("/getcount", async (req, res) => {
  const productCount = await Product.estimatedDocumentCount();
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.json({ count: productCount });
});

module.exports = Router;
