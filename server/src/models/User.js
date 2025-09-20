const mongoose = require("mongoose");
const s = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "branch"], default: "branch" },
  branch: { type: String },
});
module.exports = mongoose.model("User", s);
