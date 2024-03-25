const express = require("express");
const { Category } = require("../models/category");

const Router = express.Router();

Router.get("/", async (req, res) => {
  const categoryList = await Category.find().select("-__v");
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

Router.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  });
  const categoryAdd = await category.save();
  if (!categoryAdd) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(categoryAdd);
});

module.exports = Router;
