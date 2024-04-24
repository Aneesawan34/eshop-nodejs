const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category");
var mongoose = require("mongoose");
const multer = require("multer");

const Router = express.Router();

const IMAGE_MIME_TYPE = [""];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = file.originalname.replace(" ", "-");
    cb(null, uniqueSuffix + date.now());
  },
});

const upload = multer({ storage: storage });

Router.get("/", async (req, res) => {
  const productList = await Product.find()
    .populate("category", ["name", "icon", "-_id"])
    .select("-__v");
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(productList);
});

Router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }
  const productItem = await Product.findById(req.params.id);
  if (!productItem) {
    res.status(400).json({ succes: false, message: "id is not found" });
  }
  res.status(200).send(productItem);
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

Router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }

  const prodcutItem = await Product.findByIdAndDelete(req.params.id);
  if (!prodcutItem) {
    return res.status(400).json({ succes: false, message: "id is not found" });
  }
  res
    .status(200)
    .send({ success: true, message: "product deleted succesfully" });
});

Router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
    return res
      .status(400)
      .json({ success: false, message: "category Id is not valid" });
  }
  const category = await Category.findById(req.body.category);
  if (!category)
    return res
      .status(400)
      .json({ success: false, message: "Category id not found" });

  const prodcutItemUpdate = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      discription: req.body.discription,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
    },
    {
      new: true,
    }
  );
  if (!prodcutItemUpdate) {
    return res.json({ succes: false, message: "id is not found" });
  }
  res.status(200).json(prodcutItemUpdate);
});

Router.get("/get/count", async (_req, res) => {
  const productCount = await Product.estimatedDocumentCount();
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.json({ count: productCount });
});

Router.get("/get/featured/:id", async (req, res) => {
  const count = req.params.id ? req.params.id : 0;
  const featuredList = await Product.find({ isFeatured: false }).limit(+count);

  if (featuredList) {
    return res.json(featuredList);
  }
  return res.status(500).json({ message: "something went wrong" });
});

module.exports = Router;
