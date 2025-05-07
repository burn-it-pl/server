
import { Request, Response } from "express";
import { body } from "express-validator";
import { validate } from "../../validator";
import { createSurveyService, getUserSurveysService } from "../../../../core/services/users/survey.service";
import { TrainingLevel } from "../../../../core/entities/users/survey.enum";
import { AuthenticatedRequest } from "../../middlewares/basics";

export const submitSurveyValidation = [
  body("answers").isArray(),
  body("answers.*.question").isString(),
  body("answers.*.value").isString(),
  body("answers.*.level").isIn(Object.values(TrainingLevel)),
  validate,
];

export const submitSurvey = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.getId();
  const survey = await createSurveyService(userId, req.body.answers);
  res.status(201).json(survey);
};

export const getUserSurveys = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.getId();
  const surveys = await getUserSurveysService(userId);
  res.status(200).json(surveys);
};
