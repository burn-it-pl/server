
import { Request, Response } from 'express';
import { submitSurvey as submitSurveyService, getUserSurveys as getUserSurveysService } from '../../core/services/users/survey.service';
import { AuthenticatedRequest } from '../../adapters/api/middlewares/basics';

export const submitSurvey = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.getId();
  const survey = await submitSurveyService(userId, req.body.answers);
  res.status(201).json(survey);
};

export const getUserSurveys = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.getId();
  const surveys = await getUserSurveysService(userId);
  res.status(200).json(surveys);
};
