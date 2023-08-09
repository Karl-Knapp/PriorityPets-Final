import keys from "../config/keys";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

const router = express.Router();

router.get("/signup", async (req, res, next) => {
  res.json({
    message: "signup",
  });
});

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, username, confirmPassword } = req.body;

    const lowercaseEmail = email.toLowerCase();

    let user = await User.findOne({ email: lowercaseEmail });

    if (user) {
      return res.status(422).json({
        message: "Validation error",
        errors: {
          email: "Email address already in use.",
        },
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({
        message: "Validation error",
        errors: {
          confirmPassword: "Passwords do not match.",
        },
      });
    }

    if (!keys.constants.email_regex.test(email)) {
      return res.status(422).json({
        message: "Validation error",
        errors: {
          email: "Invalid email address.",
        },
      });
    }

    const passwordHash = await bcrypt.hash(password, keys.auth.hashRounds);
    user = await User.create({ lowercaseEmail, passwordHash, username });

    user = user.toJSON();
    delete user.passwordHash;

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const lowercaseEmail = email.toLowerCase();

    let user = await User.findOne({ email: lowercaseEmail });

    if (!user) {
      return res.status(401).json({
        message: "Authentication error",
        errors: {
          email: "Invalid credentials.",
        },
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Authentication error",
        errors: {
          email: "Invalid credentials.",
        },
      });
    }

    const accessToken = jwt.sign({ sub: lowercaseEmail }, keys.auth.accessTokenSecret, {
      expiresIn: keys.auth.accessTokenExp,
    });

    await user.save();

    user = user.toJSON();
    delete user.passwordHash;

    res.json({ token: accessToken, user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
