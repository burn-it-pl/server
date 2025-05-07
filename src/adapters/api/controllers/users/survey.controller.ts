
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
  const { title, description, questions } = req.body;
  const survey = await createSurveyService(title, description, questions);
  res.status(201).json(survey);
};

export const getUserSurveys = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.getId();
  const surveys = await getUserSurveyService(userId);
  res.status(200).json(surveys);
};
import { Request, Response } from 'express';
import { 
  createSurveyService, 
  getSurveyByIdService,
  getSurveysService,
  updateSurveyService,
  deleteSurveyService,
  getQuestionsService,
  getQuestionByIdService,
  createQuestionService,
  updateQuestionService,
  deleteQuestionService,
  getAnswerOptionsService,
  getAnswerOptionByIdService,
  createAnswerOptionService,
  updateAnswerOptionService,
  deleteAnswerOptionService
} from '../../../../core/services/users/survey.service';

export const getSurveys = async (req: Request, res: Response) => {
  const { _start = 0, _end = 10, _sort = 'created_at', _order = 'DESC' } = req.query;
  const [data, total] = await getSurveysService(
    Number(_start), 
    Number(_end), 
    String(_sort), 
    String(_order)
  );
  res.set('X-Total-Count', String(total));
  res.json(data);
};

export const getSurveyById = async (req: Request, res: Response) => {
  const survey = await getSurveyByIdService(req.params.id);
  res.json(survey);
};

export const createSurvey = async (req: Request, res: Response) => {
  const survey = await createSurveyService(req.body);
  res.status(201).json(survey);
};

export const updateSurvey = async (req: Request, res: Response) => {
  const survey = await updateSurveyService(req.params.id, req.body);
  res.json(survey);
};

export const deleteSurvey = async (req: Request, res: Response) => {
  await deleteSurveyService(req.params.id);
  res.status(204).send();
};

// Similar implementations for questions and answer options...
export const getQuestions = async (req: Request, res: Response) => {
  const { _start = 0, _end = 10, _sort = 'created_at', _order = 'DESC', survey_id } = req.query;
  const [data, total] = await getQuestionsService(
    Number(_start), 
    Number(_end), 
    String(_sort), 
    String(_order),
    String(survey_id)
  );
  res.set('X-Total-Count', String(total));
  res.json(data);
};

// Implement other handlers similarly...
