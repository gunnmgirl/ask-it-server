import bcrypt from "bcryptjs";

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
          questions: 1,
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

async function getUser(req, res, next) {
  const { userId } = req.query;
  try {
    const user = await User.findById(userId);
    return res.status(200).send(user);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function editUser(req, res, next) {
  const { firstName, lastName } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { firstName, lastName } },
      { new: true }
    );
    return res.status(200).send(user);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function changePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ _id: req.userId });
    const isEqual = await bcrypt.compare(currentPassword, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: { password: hashedPassword } },
      { new: true }
    );
    return res.status(200).send(updatedUser);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

export default { getMostPopular, getUser, editUser, changePassword };
