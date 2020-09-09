import express from "express";

import userController from "../controllers/userController";

const router = express.Router();

router.get("/popular", userController.getMostPopular);

export default router;
