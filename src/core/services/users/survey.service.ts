import { PrismaClient } from "@prisma/client";
import { SurveyEntity } from "../../entities/users/survey.entity";

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
      surveys.map(survey => SurveyEntity.fromPrisma(survey)),
      total
    ];
  });
};

export const createSurveyService = async (data: { title: string; description?: string }) => {
  return onSession(async (client: PrismaClient) => {
    return client.survey.create({
      data: {
        survey_title: data.title,
        survey_description: data.description
      }
    });
  });
};

export const associateQuestionsWithSurveyService = async (surveyId: string, questionIds: string[]) => {
  return onSession(async (client: PrismaClient) => {
    // First, remove any existing associations
    await client.question.updateMany({
      where: { question_survey: surveyId },
      data: { question_survey: null }
    });

    // Then create new associations
    for (const questionId of questionIds) {
      await client.question.update({
        where: { question_id: questionId },
        data: { question_survey: surveyId }
      });
    }
  });
};

export const getSurveyByIdService = async (id: string) => {
  return onSession(async (client: PrismaClient) => {
    return client.survey.findUnique({
      where: { survey_id: id },
      include: {
        questions: {
          include: {
            answerOptions: true
          }
        }
      }
    });
  });
};


export const updateSurveyService = async (id: string, data: { title?: string; description?: string }) => {
  return onSession(async (client: PrismaClient) => {
    return client.survey.update({
      where: { survey_id: id },
      data: {
        survey_title: data.title,
        survey_description: data.description
      }
    });
  });
};

export const deleteSurveyService = async (id: string) => {
  return onSession(async (client: PrismaClient) => {
    await client.survey.delete({
      where: { survey_id: id }
    });
  });
};

export const getQuestionsService = async (
  start: number,
  end: number,
  sortField: string,
  sortOrder: string,
  surveyId?: string
) => {
  return onSession(async (client: PrismaClient) => {
    const where = surveyId ? { question_survey: surveyId } : {};
    const [questions, total] = await Promise.all([
      client.question.findMany({
        where,
        skip: start,
        take: end - start,
        orderBy: { [sortField]: sortOrder.toLowerCase() },
        include: { answerOptions: true }
      }),
      client.question.count({ where })
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