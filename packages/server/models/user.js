import keys from "../config/keys";

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: keys.constants.email_regex,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
    tasks: [
      {
        type: ObjectId,
        ref: "Task",
      },
    ],
    pets: {
      currentPet: {
        type: ObjectId,
        default: undefined,
        ref: "Pet",
      },
      deceasedPets: [
        {
          type: ObjectId,
          ref: "Pet",
        },
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
