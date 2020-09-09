import User from "../models/userModel";

async function getMostPopular(req, res, next) {
  const { page } = req.query;
  try {
    const totalUsers = await User.find().countDocuments();
    const users = await User.aggregate([
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          password: 1,
          answers: 1,
          length: {
            $cond: {
              if: { $isArray: "$answers" },
              then: { $size: "$answers" },
              else: "NA",
            },
          },
        },
      },
      { $sort: { length: 1 } },
      { $skip: Number(page) },
      { $limit: 20 },
    ]);
    return res.status(200).send({ users, totalUsers });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

export default { getMostPopular };
