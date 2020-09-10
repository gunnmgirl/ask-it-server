import express from "express";

import answerController from "../controllers/answerController";
import isAuth from "../middleware/isAuth";

const router = express.Router();

router.post("/", isAuth, answerController.postAnswer);

export default router;
