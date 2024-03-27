const mongoose = require("mongoose");

const CategoryShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  icon: {
    type: String,
  },
});

module.exports = mongoose.model("Category", CategoryShema);
