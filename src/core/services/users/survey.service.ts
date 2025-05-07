
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
        survey.survey_id,
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

export const getSurveyByIdService = async (id: string): Promise<SurveyEntity> => {
  return onSession(async (client: PrismaClient) => {
    const survey = await client.survey.findUnique({
      where: { survey_id: id },
      include: {
        questions: {
          include: {
            answerOptions: true
          }
        }
      }
    });

    if (!survey) {
      throw new Error('Survey not found');
    }

    return new SurveyEntity(
      survey.survey_id,
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
    );
  });
};

export const createSurveyService = async (data: {
  title: string;
  description?: string;
  questions?: Array<{
    text: string;
    order: number;
    options: Array<{
      text: string;
      level: TrainingLevel;
    }>;
  }>;
}): Promise<SurveyEntity> => {
  return onSession(async (client: PrismaClient) => {
    const survey = await client.survey.create({
      data: {
        survey_title: data.title,
        survey_description: data.description,
        questions: {
          create: data.questions?.map(q => ({
            question_text: q.text,
            question_order: q.order,
            answerOptions: {
              create: q.options.map(o => ({
                option_text: o.text,
                option_level: o.level
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            answerOptions: true
          }
        }
      }
    });

    return new SurveyEntity(
      survey.survey_id,
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
    );
  });
};

// Implement other service methods similarly...

export const updateSurveyService = async (id: string, data: {
  title?: string;
  description?: string;
}): Promise<SurveyEntity> => {
  return onSession(async (client: PrismaClient) => {
    const survey = await client.survey.update({
      where: { survey_id: id },
      data: {
        survey_title: data.title,
        survey_description: data.description
      },
      include: {
        questions: {
          include: {
            answerOptions: true
          }
        }
      }
    });

    return new SurveyEntity(
      survey.survey_id,
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
    );
  });
};

export const deleteSurveyService = async (id: string): Promise<void> => {
  return onSession(async (client: PrismaClient) => {
    await client.survey.delete({
      where: { survey_id: id }
    });
  });
};

// Add other service methods (questions, answer options) with similar patterns
