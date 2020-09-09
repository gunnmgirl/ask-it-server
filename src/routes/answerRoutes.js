import express from "express";

import answerController from "../controllers/answerController";

const router = express.Router();

router.post("/", answerController.postAnswer);

export default router;
