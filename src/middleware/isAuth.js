import jwt from "jsonwebtoken";

export default function isAuth(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
}
