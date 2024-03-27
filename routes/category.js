const express = require("express");
const Category = require("../models/category");
const category = require("../models/category");
var mongoose = require("mongoose");

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

Router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }
  const categoryItem = await Category.findById(req.params.id);
  if (!categoryItem) {
    res.status(400).json({ succes: false, message: "id is not found" });
  }
  res.status(200).send(categoryItem);
});

Router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }
  const categoryItem = await Category.findByIdAndDelete(req.params.id);
  if (!categoryItem) {
    res.status(400).json({ succes: false, message: "id is not found" });
  }
  res
    .status(200)
    .send({ success: true, message: "category deleted succesfully" });
});

Router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Id is not valid" });
  }
  const categoryItemUpdate = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
    },
    {
      new: true,
    }
  );
  if (!categoryItemUpdate) {
    res.status(400).json({ succes: false, message: "id is not found" });
  }
  res.status(200).json(categoryItemUpdate);
});

module.exports = Router;
