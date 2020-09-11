import express from "express";

import answerController from "../controllers/answerController";
import isAuth from "../middleware/isAuth";

const router = express.Router();

router.post("/", isAuth, answerController.postAnswer);
router.post("/edit", isAuth, answerController.editAnswer);
router.delete("/", isAuth, answerController.deleteAnswer);

export default router;
