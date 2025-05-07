
import { Router, Request, Response } from "express";
import { getUsersController } from "../../adapters/api/controllers/users/user.controller";
import { body } from "express-validator";
import { validate } from "../../adapters/api/validator";
import { TrainingLevel } from "../../core/entities/users/survey.enum";

const user = Router();

// Survey validation middleware
const submitSurveyValidation = [
  body("answers").isArray(),
  body("answers.*.question").isString(),
  body("answers.*.value").isString(),
  body("answers.*.level").isIn(Object.values(TrainingLevel)),
  validate,
];

// Survey controllers
const submitSurvey = async (req: Request, res: Response) => {
  const data = req.body;
  res.status(200).json({ message: "Survey submitted", data });
};

const getUserSurveys = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  res.status(200).json({ surveys: [], userId });
};

// Routes
user.get("/users", getUsersController);
user.post("/surveys", submitSurveyValidation, submitSurvey);
user.get("/surveys", getUserSurveys);

export default user;
