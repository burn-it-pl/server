import { Router } from "express";
import { getUsersController } from "../../adapters/api/controllers/users/user.controller";
import { submitSurvey, getUserSurveys } from './survey.controller'; // Import new controllers
import { submitSurveyValidation } from './survey.validation'; // Import validation middleware


const user = Router();

// User
user.get("/users", getUsersController);

// Surveys
user.post("/surveys", submitSurveyValidation, submitSurvey);
user.get("/surveys", getUserSurveys);


export default user;

//Dummy survey.controller.ts
export const submitSurvey = (req, res) => {
  // Implementation to handle survey submission, including level assignment logic
  res.status(200).json({ message: 'Survey submitted' });
};

export const getUserSurveys = (req, res) => {
  // Implementation to retrieve user's survey history
  res.status(200).json({ surveys: [] });
};


//Dummy survey.validation.ts
export const submitSurveyValidation = (req, res, next) => {
  //Implementation for survey input validation
  next();
};