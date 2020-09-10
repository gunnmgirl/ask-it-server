import Answer from "../models/answerModel";
import User from "../models/userModel";
import Question from "../models/questionModel";

async function postAnswer(req, res, next) {
  const { questionId } = req.body;
  try {
    const answer = await Answer.create({
      body: req.body.body,
      upvotes: 0,
      downvotes: 0,
      createdBy: req.userId,
    });
    const user = await User.findById(req.userId);
    const question = await Question.findById(questionId);
    question.answers.push(answer);
    await question.save();
    user.answers.push(answer);
    await user.save();
    res.status(200).send(answer);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

export default { postAnswer };
