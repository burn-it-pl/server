
import { PrismaClient } from "@prisma/client";
import { SurveyEntity } from "../../entities/users/survey.entity";
import { TrainingLevel } from "../../entities/users/survey.enum";
import { onSession } from "../../../infrastructure/database/prisma";

interface PaginationResult<T> {
  data: T[];
  total: number;
}

export const getSurveysService = async (
  start: number,
  end: number,
  sortField: string,
  sortOrder: string
): Promise<[SurveyEntity[], number]> => {
  return onSession(async (client: PrismaClient) => {
    const [data, total] = await Promise.all([
      client.survey.findMany({
        skip: start,
        take: end - start,
        orderBy: { [sortField]: sortOrder.toLowerCase() },
        include: {
          questions: {
            include: {
              answerOptions: true,
            },
          },
        },
      }),
      client.survey.count(),
    ]);

    return [data.map(s => ({
      id: s.survey_id,
      title: s.survey_title,
      description: s.survey_description,
      createdAt: s.survey_created_at,
      updatedAt: s.survey_updated_at,
      questions: s.questions.map(q => ({
        id: q.question_id,
        text: q.question_text,
        order: q.question_order,
        answerOptions: q.answerOptions.map(o => ({
          id: o.option_id,
          text: o.option_text,
          level: o.option_level,
        })),
      })),
    })), total];
  });
};

export const createSurveyService = async (data: {
  title: string;
  description?: string;
  questions?: Array<{
    text: string;
    order: number;
    options: Array<{ text: string; level: TrainingLevel }>;
  }>;
}): Promise<SurveyEntity> => {
  return onSession(async (client: PrismaClient) => {
    const survey = await client.survey.create({
      data: {
        survey_title: data.title,
        survey_description: data.description,
        questions: data.questions ? {
          create: data.questions.map(q => ({
            question_text: q.text,
            question_order: q.order,
            answerOptions: {
              create: q.options,
            },
          })),
        } : undefined,
      },
      include: {
        questions: {
          include: {
            answerOptions: true,
          },
        },
      },
    });

    return SurveyEntity.fromPrisma(survey);
  });
};

// Implement other service methods similarly...
