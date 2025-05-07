
import { Router } from 'express';
import { body, query } from 'express-validator';
import { validate } from '../../validator';
import { 
  getSurveys, 
  getSurveyById, 
  createSurvey, 
  updateSurvey, 
  deleteSurvey,
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAnswerOptions,
  getAnswerOptionById,
  createAnswerOption,
  updateAnswerOption,
  deleteAnswerOption
} from './survey.controller';

const router = Router();

// Survey validation rules
const surveyValidation = [
  body('title').isString().notEmpty(),
  body('description').optional().isString(),
  validate
];

// Question validation rules
const questionValidation = [
  body('text').isString().notEmpty(),
  body('order').isInt(),
  validate
];

// Answer option validation rules
const answerOptionValidation = [
  body('text').isString().notEmpty(),
  body('level').isIn(['BASIC', 'POWER', 'PRO']),
  validate
];

// Pagination validation
const paginationValidation = [
  query('_start').optional().isInt(),
  query('_end').optional().isInt(),
  query('_sort').optional().isString(),
  query('_order').optional().isIn(['ASC', 'DESC']),
  validate
];

// Survey routes
router.get('/surveys', paginationValidation, getSurveys);
router.get('/surveys/:id', getSurveyById);
router.post('/surveys', surveyValidation, createSurvey);
router.put('/surveys/:id', surveyValidation, updateSurvey);
router.delete('/surveys/:id', deleteSurvey);

// Question routes
router.get('/questions', paginationValidation, getQuestions);
router.get('/questions/:id', getQuestionById);
router.post('/questions', questionValidation, createQuestion);
router.put('/questions/:id', questionValidation, updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// Answer option routes
router.get('/answer-options', paginationValidation, getAnswerOptions);
router.get('/answer-options/:id', getAnswerOptionById);
router.post('/answer-options', answerOptionValidation, createAnswerOption);
router.put('/answer-options/:id', answerOptionValidation, updateAnswerOption);
router.delete('/answer-options/:id', deleteAnswerOption);

export default router;
