const mongoose = require("mongoose");
const Bonus = mongoose.Schema({
  _id: String,
  Terre: [String],
  Air: [String],
  Eau: [String],
  Feu: [String],
  time: Date,
});

module.exports = mongoose.model("salonBonus", Bonus);
