import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes";
import questionRoutes from "./routes/questionRoutes";
import userRoutes from "./routes/userRoutes";
import answerRoutes from "./routes/answerRoutes";

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/question", questionRoutes);
app.use("/user", userRoutes);
app.use("/answer", answerRoutes);

app.use((error, req, res, next) => {
  res.status(error.statusCode).send(error.message);
});

mongoose
  .connect(process.env.CONNECTION_STRING, { useUnifiedTopology: true })
  .then((result) => {
    app.listen(port);
  })
  .catch((error) => {
    console.log(error);
  });
