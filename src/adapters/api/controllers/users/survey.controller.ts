
import { Response } from "express";
import { body } from "express-validator";
import { validate } from "../../validator";
import { createSurveyService, getUserSurveyService } from "../../../../core/services/users/survey.service";
import { TrainingLevel } from "../../../../core/entities/users/survey.enum";

import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: {
    getId: () => string;
  }
}

export const submitSurveyValidation = [
  body("title").isString(),
  body("description").optional().isString(),
  body("questions").isArray(),
  body("questions.*.text").isString(),
  body("questions.*.order").isInt(),
  body("questions.*.options").isArray(),
  body("questions.*.options.*.text").isString(),
  body("questions.*.options.*.level").isIn(Object.values(TrainingLevel)),
  validate,
];

export const submitSurvey = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.getId();
  const { title, description, questions } = req.body;
  const survey = await createSurveyService(title, description, questions);
  res.status(201).json(survey);
};

export const getUserSurveys = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.getId();
  const surveys = await getUserSurveyService(userId);
  res.status(200).json(surveys);
};
