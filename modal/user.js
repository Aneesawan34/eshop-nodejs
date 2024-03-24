const mongoose = require("mongoose");

// will be update this schema proper
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

exports.Users = mongoose.model("Users", UserSchema);
