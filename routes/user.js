const express = require("express");
const { Users } = require("../modal/user");

const router = express.Router();

router.get("/", async (req, res) => {
  //   console.log("running");
  const users = await Users.find();
  if (!users) {
    console.log("users: ", users);
    res.send(500).json({ message: "something is wrong" });
  }
  res.send(users);
});

router.post("/", async (req, res) => {
  console.log("req: ", req.body);
  const users = new Users({
    name: req.body.name,
  });
  await users.save();
  if (users) {
    res.json(users);
  }
  res.status(500).json({ message: "Some error" });
});

module.exports = router;
