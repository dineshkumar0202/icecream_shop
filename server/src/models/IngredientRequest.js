const mongoose = require("mongoose");
const s = new mongoose.Schema({
  branch: String,
  city: String,
  flavor: String,
  ingredient: String,
  qty: Number,
  status: { type: String, default: "pending" },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("IngredientRequest", s);
