import express from "express";

import questionController from "../controllers/questionController";

const router = express.Router();

router.get("/latest", questionController.getLatestQuestions);
router.get("/hot", questionController.getHotQuestions);

export default router;
