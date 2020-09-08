import { validationResult } from "express-validator/check";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel";

async function signup(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).send(user);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new Error("A user with this email could not be found!");
      error.statusCode = 400;
      throw error;
    }
    const isEqual = await bcrypt.compare(req.body.password, user.password);
    if (!isEqual) {
      const error = new Error("You entered a wrong password!");
      error.statusCode = 400;
      throw error;
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.SECRET,
      { expiresIn: "2h" }
    );
    res.status(200).send({ token, userId: user._id.toString() });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

export default { signup, login };
