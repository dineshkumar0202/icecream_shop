const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  city: { type: String, required: true },
  flavor: { type: String, required: true },
  units: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sale', SaleSchema);
