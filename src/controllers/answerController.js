import Answer from "../models/answerModel";
import User from "../models/userModel";
import Question from "../models/questionModel";

async function postAnswer(req, res, next) {
  const { questionId, values } = req.body;
  try {
    const answer = await Answer.create({
      body: values.body,
      upvotes: 0,
      downvotes: 0,
      createdBy: req.userId,
    });
    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      { $push: { answers: answer } }
    );
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { $push: { answers: answer } }
    );
    res.status(200).send(answer);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function deleteAnswer(req, res, next) {
  const { answerId, questionId } = req.query;
  try {
    await Answer.findByIdAndDelete(answerId);
    const user = await User.findById(req.userId);
    const question = await Question.findById(questionId);
    question.answers.pull(answerId);
    await question.save();
    user.answers.pull(answerId);
    await user.save();
    res.status(200).send(answerId);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function editAnswer(req, res, next) {
  const { answerId, values } = req.body;
  try {
    await Answer.findByIdAndUpdate(answerId, { body: values.body });
    res.status(200).send({ answerId, newContent: values.body });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

export default { postAnswer, deleteAnswer, editAnswer };
