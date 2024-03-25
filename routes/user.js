const express = require("express");
const { Users } = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  const userList = await Users.find().select("-__v");
  if (!userList) {
    res.send(500).json({ message: "something is wrong" });
  }
  res.send(userList);
});

router.post("/", async (req, res) => {
  const user = new Users({
    name: req.body.name,
  });
  const userAdd = await user.save();
  if (userAdd) {
    res.json(userAdd);
  }
  res.status(500).json({ message: "Some error" });
});

module.exports = router;
