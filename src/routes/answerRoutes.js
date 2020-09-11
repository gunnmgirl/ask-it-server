import express from "express";

import answerController from "../controllers/answerController";
import isAuth from "../middleware/isAuth";

const router = express.Router();

router.post("/", isAuth, answerController.postAnswer);
router.post("/edit", isAuth, answerController.editAnswer);
router.post("/downvote", isAuth, answerController.downvoteAnswer);
router.post("/upvote", isAuth, answerController.upvoteAnswer);
router.delete("/", isAuth, answerController.deleteAnswer);

export default router;
