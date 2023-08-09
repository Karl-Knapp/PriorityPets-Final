const express = require("express");
const { Pet } = require("../models");
const { User } = require("../models");
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

router.get("/:id", requireAuth, async (request, response) => {
  const id = request.params.id;

  try {
    const pet = await Pet.findById(id).exec();

    if (pet) {
      response.json({ currentPet: pet });
    } else {
      response.status(404).json({ error: "Pet not found." });
    }
  } catch (error) {
    response.status(500).json({ error: "An error occurred when finding the pet." });
  }
});

router.post("/:id", requireAuth, async (request, response) => {
  const id = request.params.id;
  const { user, name, appearance, healthLevel } = request.body;

  try {
    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      { user, name, appearance, healthLevel },
      {
        new: true,
      }
    ).exec();

    if (updatedPet) {
      response.json(updatedPet);
    } else {
      response.status(404).json({ error: "Pet not found." });
    }
  } catch (error) {
    response.status(500).json({ error: "An error occurred when updating the pet." });
  }
});

router.post("/heal/:id", requireAuth, async (request, response) => {
  const { id } = request.params;

  try {
    const pet = await Pet.findById(id).exec();

    if (pet) {
      pet.healthLevel = pet.healthLevel + 10;
      await pet.save();
      response.json(pet);
    } else {
      response.status(404).json({ error: "Pet not found." });
    }
  } catch (error) {
    response.status(500).json({ error: "An error occurred when healing the pet." });
  }
});

router.post("/", requireAuth, async (request, response) => {
  const { name, appearance, userId } = request.body;
  try {
    const newPet = new Pet({ name, appearance, user: userId });
    await newPet.save();
    const user = await User.findById(userId);
    user.pets.currentPet = newPet._id;
    await user.save();

    response.status(201).json(newPet);
  } catch (error) {
    response.status(500).json({ error: "An error occurred when updating the pet." });
  }
});

router.put("/feed", requireAuth, async (req, res) => {
  const { userId, petId } = req.body;

  try {
    const user = await User.findById(userId);
    const pet = await Pet.findById(petId);

    if (!user || !pet) {
      return res.status(404).json({ error: "User or pet not found" });
    }

    if (user.points >= 1) {
      pet.healthLevel = Math.min(pet.healthLevel + 10, 100);
      await pet.save();

      user.points -= 1;
      await user.save();

      return res.json({ message: "Successfully fed the pet", pet: pet, user: user });
    } else {
      return res.status(403).json({ error: "Insufficient points" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
