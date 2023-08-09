import express from "express";
import bcrypt from "bcryptjs";
import { User, Task, Pet } from "../models";
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

router.get("/:username", async (request, response) => {
  const username = request.params.username;

  try {
    const user = await User.findOne({ username: username }).exec();

    if (user) {
      const tasks = await Task.find({ user: user._id }).exec();
      const pets = await Pet.find({ user: user._id }).exec();

      const result = {
        user: user,
        tasks: tasks,
        pets: pets,
      };

      response.json(result);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    response.status(500).json({ error: "An error occurred when finding the user." });
  }
});

router.post("/", async (request, response) => {
  const { username, email, password, xp, level } = request.body;
  const update = { username, email, xp, level };

  if (password) {
    const hashedpassword = await bcrypt.hash(password, 12);
    update.password = hashedpassword;
  }

  let user;
  try {
    user = await User.findOne({ username }).exec();
  } catch (error) {
    response.status(500).json({ error: "An error occurred when finding the user." });
    return;
  }

  if (user) {
    try {
      const userUpdate = await User.findByIdAndUpdate(user._id, update, {
        new: true,
      });
      response.json(userUpdate);
    } catch (error) {
      response.status(500).json({ error: "An error occurred when updating the user." });
    }
  } else {
    const newUser = new User(update);
    try {
      await newUser.save();
      response.json(newUser);
    } catch (error) {
      response.status(500).json({ error: "An error occurred when creating the user." });
    }
  }
});

export default router;
