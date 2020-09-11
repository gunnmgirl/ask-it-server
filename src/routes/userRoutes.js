import express from "express";

import userController from "../controllers/userController";
import isAuth from "../middleware/isAuth";

const router = express.Router();

router.get("/popular", isAuth, userController.getMostPopular);
router.get("/", isAuth, userController.getUser);
router.post("/edit", isAuth, userController.editUser);
router.post("/changePassword", isAuth, userController.changePassword);

export default router;
