const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  appearance: {
    type: String,
    required: true,
  },
  healthLevel: {
    type: Number,
    default: 100,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastTimeDamaged: {
    type: Date,
    default: null,
  },
  // lifespan: {
  //   type: Number,
  //   default: 0,
  // },
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
