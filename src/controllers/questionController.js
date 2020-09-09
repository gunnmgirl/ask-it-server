import Question from "../models/questionModel";

async function getLatestQuestions(req, res, next) {
  const { page } = req.query;
  try {
    const totalQuestions = await Question.find().countDocuments();
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .skip(Number(page) * 20)
      .limit(20);
    return res.status(200).send({ questions, totalQuestions });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function getHotQuestions(req, res, next) {
  const { page } = req.query;
  try {
    const totalQuestions = await Question.find().countDocuments();
    const questions = await Question.find()
      .sort({ upvotes: -1 })
      .skip(Number(page) * 20)
      .limit(20);
    return res.status(200).send({ questions, totalQuestions });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

export default { getLatestQuestions, getHotQuestions };
