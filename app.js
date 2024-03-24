const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const UserRouter = require("./routes/user");
require("dotenv/config");

// middle ware
app.use(bodyparser.json());
app.use(morgan("tiny"));

//Routing define
app.use("/user", UserRouter);

databaseConect()
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

async function databaseConect() {
  console.log("database is connecting...");
  await mongoose.connect(process.env.MONGODB_KEY, {});
}

app.listen(3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
