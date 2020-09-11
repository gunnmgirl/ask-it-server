import express from "express";

import questionController from "../controllers/questionController";
import isAuth from "../middleware/isAuth";

const router = express.Router();

router.get("/latest", isAuth, questionController.getLatestQuestions);
router.get("/hot", isAuth, questionController.getHotQuestions);
router.get("/myQuestions", isAuth, questionController.getMyQuestions);
router.get("/:questionId", isAuth, questionController.getQuestionAndAnswers);
router.post("/", isAuth, questionController.postQuestion);

export default router;
