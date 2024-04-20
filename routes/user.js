const express = require("express");
const Users = require("../models/user");
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/", async (req, res) => {
  const userList = await Users.find().select("-__v");
  if (!userList) {
    return res.send(500).json({ message: "something went wrong" });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(500).json({ message: "id is not found" });
  }
  const user = await Users.findById(req.params.id);
  if (user) {
    return res.send(user);
  }
  res.status(500).json({ message: "something went wrong" });
});

router.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
      return res.status(200).json(user);
    }
    return res.status(400).json({ message: "password is wrong" });
  }
  res.status(500).json({ message: "User not exist" });
});

router.post("/register", async (req, res) => {
  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, process.env.BCRYPT_HASH),
    street: req.body.street,
    appartment: req.body.appartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  const userAdd = await user.save();
  if (userAdd) {
    return res.json(userAdd);
  }
  res.status(500).json({ message: "Some error" });
});

router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(500).json({ message: "id is not found" });
  }
  const userUpdate = await Users.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      street: req.body.street,
      appartment: req.body.appartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  if (userUpdate) {
    return res.json(userUpdate);
  }
  res.status(500).json({ message: "Something went wrong" });
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(500).json({ message: "This id is not found" });
  }
  const deletedItem = await Users.findByIdAndDelete(req.params.id);
  if (deletedItem) {
    return res.json(deletedItem);
  }
  res.status(500).json({ message: "Not found" });
});

module.exports = router;
