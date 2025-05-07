
import { PrismaClient } from "@prisma/client";
import { SurveyEntity } from "../../entities/users/survey.entity";
import { TrainingLevel } from "../../entities/users/survey.enum";
import { onSession } from "../../../infrastructure/database/prisma";

export const getSurveysService = async (
  start: number,
  end: number,
  sortField: string,
  sortOrder: string
): Promise<[SurveyEntity[], number]> => {
  return onSession(async (client: PrismaClient) => {
    const [surveys, total] = await Promise.all([
      client.survey.findMany({
        skip: start,
        take: end - start,
        orderBy: { [sortField]: sortOrder.toLowerCase() },
        include: {
          questions: {
            include: {
              answerOptions: true
            }
          }
        }
      }),
      client.survey.count()
    ]);

    return [
      surveys.map(survey => new SurveyEntity(
        survey.survey_title,
        survey.survey_description,
        survey.questions.map(q => ({
          id: q.question_id,
          text: q.question_text,
          order: q.question_order,
          answerOptions: q.answerOptions.map(o => ({
            id: o.option_id,
            text: o.option_text,
            level: o.option_level as TrainingLevel
          }))
        }))
      )),
      total
    ];
  });
};

export const getQuestionsService = async (
  start: number,
  end: number,
  sortField: string,
  sortOrder: string,
  surveyId: string
) => {
  return onSession(async (client: PrismaClient) => {
    const [questions, total] = await Promise.all([
      client.question.findMany({
        where: { question_survey: surveyId },
        skip: start,
        take: end - start,
        orderBy: { [sortField]: sortOrder.toLowerCase() },
        include: { answerOptions: true }
      }),
      client.question.count({ where: { question_survey: surveyId } })
    ]);
    return [questions, total];
  });
};

export const getQuestionByIdService = async (id: string) => {
  return onSession(async (client: PrismaClient) => {
    return client.question.findUnique({
      where: { question_id: id },
      include: { answerOptions: true }
    });
  });
};

export const createQuestionService = async (data: any) => {
  return onSession(async (client: PrismaClient) => {
    return client.question.create({
      data: {
        question_text: data.text,
        question_order: data.order,
        question_survey: data.surveyId
      }
    });
  });
};

export const updateQuestionService = async (id: string, data: any) => {
  return onSession(async (client: PrismaClient) => {
    return client.question.update({
      where: { question_id: id },
      data: {
        question_text: data.text,
        question_order: data.order
      }
    });
  });
};

export const deleteQuestionService = async (id: string) => {
  return onSession(async (client: PrismaClient) => {
    await client.question.delete({
      where: { question_id: id }
    });
  });
};

export const getAnswerOptionsService = async (
  start: number,
  end: number,
  sortField: string,
  sortOrder: string,
  questionId: string
) => {
  return onSession(async (client: PrismaClient) => {
    const [options, total] = await Promise.all([
      client.answerOption.findMany({
        where: { option_question: questionId },
        skip: start,
        take: end - start,
        orderBy: { [sortField]: sortOrder.toLowerCase() }
      }),
      client.answerOption.count({ where: { option_question: questionId } })
    ]);
    return [options, total];
  });
};

export const getAnswerOptionByIdService = async (id: string) => {
  return onSession(async (client: PrismaClient) => {
    return client.answerOption.findUnique({
      where: { option_id: id }
    });
  });
};

export const createAnswerOptionService = async (data: any) => {
  return onSession(async (client: PrismaClient) => {
    return client.answerOption.create({
      data: {
        option_text: data.text,
        option_level: data.level,
        option_question: data.questionId
      }
    });
  });
};

export const updateAnswerOptionService = async (id: string, data: any) => {
  return onSession(async (client: PrismaClient) => {
    return client.answerOption.update({
      where: { option_id: id },
      data: {
        option_text: data.text,
        option_level: data.level
      }
    });
  });
};

export const deleteAnswerOptionService = async (id: string) => {
  return onSession(async (client: PrismaClient) => {
    await client.answerOption.delete({
      where: { option_id: id }
    });
  });
};
