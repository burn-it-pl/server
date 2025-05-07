
import { body } from 'express-validator';
import { validate } from '../../adapters/api/validator';
import { TrainingLevel } from '../../core/entities/users/survey.enum';

export const submitSurveyValidation = [
  body('answers').isArray(),
  body('answers.*.question').isString(),
  body('answers.*.value').isString(),
  body('answers.*.level').isIn(Object.values(TrainingLevel)),
  validate,
];
