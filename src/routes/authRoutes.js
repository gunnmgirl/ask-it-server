import express from "express";
import { body } from "express-validator/check";

import authController from "../controllers/authController";
import User from "../models/userModel";

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists!");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Must be at least 5 characters long"),
  ],
  authController.signup
);
router.post("/login", authController.login);

export default router;
