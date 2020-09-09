import jwt from "jsonwebtoken";

export default function isAuth(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken) {
      const error = new Error("Not authenticated!");
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
}
