
import { Request, Response } from 'express';
import { TrainingLevel } from '../../../../core/entities/users/survey.enum';
import {
  createSurveyService,
  getSurveysService,
  getSurveyByIdService,
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

interface AuthenticatedRequest extends Request {
  user: {
    getId: () => string;
  }
}

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

export const getQuestionById = async (req: Request, res: Response) => {
  const question = await getQuestionByIdService(req.params.id);
  res.json(question);
};

export const createQuestion = async (req: Request, res: Response) => {
  const question = await createQuestionService(req.body);
  res.status(201).json(question);
};

export const updateQuestion = async (req: Request, res: Response) => {
  const question = await updateQuestionService(req.params.id, req.body);
  res.json(question);
};

export const deleteQuestion = async (req: Request, res: Response) => {
  await deleteQuestionService(req.params.id);
  res.status(204).send();
};

export const getAnswerOptions = async (req: Request, res: Response) => {
  const { _start = 0, _end = 10, _sort = 'created_at', _order = 'DESC', question_id } = req.query;
  const [data, total] = await getAnswerOptionsService(
    Number(_start),
    Number(_end),
    String(_sort),
    String(_order),
    String(question_id)
  );
  res.set('X-Total-Count', String(total));
  res.json(data);
};

export const getAnswerOptionById = async (req: Request, res: Response) => {
  const option = await getAnswerOptionByIdService(req.params.id);
  res.json(option);
};

export const createAnswerOption = async (req: Request, res: Response) => {
  const option = await createAnswerOptionService(req.body);
  res.status(201).json(option);
};

export const updateAnswerOption = async (req: Request, res: Response) => {
  const option = await updateAnswerOptionService(req.params.id, req.body);
  res.json(option);
};

export const deleteAnswerOption = async (req: Request, res: Response) => {
  await deleteAnswerOptionService(req.params.id);
  res.status(204).send();
};
