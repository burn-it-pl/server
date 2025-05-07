
import { Request, Response } from 'express';
import { TrainingLevel } from '../../core/entities/users/survey.enum';

export interface AuthenticatedRequest extends Request {
  user: {
    getId: () => string;
  };
}

export const submitSurvey = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.getId();
  res.status(201).json({ userId, survey: req.body });
};

export const getUserSurveys = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.getId();
  res.status(200).json({ userId, surveys: [] });
};
