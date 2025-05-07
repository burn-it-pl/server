import { PrismaClient } from "@prisma/client";
import { SurveyEntity } from "../../entities/users/survey.entity";
import { TrainingLevel } from "../../entities/users/survey.enum";
import { onSession } from "../../../infrastructure/database/prisma";

export const createSurveyService = async (
  title: string,
  description: string | null,
  questions: Array<{
    text: string;
    order: number;
    options: Array<{ text: string; level: TrainingLevel }>;
  }>
): Promise<SurveyEntity> => {
  return onSession(async (client: PrismaClient) => {
    const survey = await client.survey.create({
      data: {
        survey_title: title,
        survey_description: description,
        questions: {
          create: questions.map((q) => ({
            question_text: q.text,
            question_order: q.order,
            answerOptions: {
              create: q.options.map((opt) => ({
                option_text: opt.text,
                option_level: opt.level,
              })),
            },
          })),
        },
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

export const getUserSurveyService = async (userId: string): Promise<SurveyEntity[]> => {
  return onSession(async (client: PrismaClient) => {
    const surveys = await client.userSurvey.findMany({
      where: { submission_user: userId },
      include: {
        survey: {
          include: {
            questions: {
              include: {
                answerOptions: true,
              }
            }
          }
        }
      }
    });

    return surveys.map(s => SurveyEntity.fromPrisma(s.survey));
  });
};

export const determineFinalLevel = (levels: TrainingLevel[]): TrainingLevel => {
  const levelCounts = levels.reduce((acc, level) => {
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<TrainingLevel, number>);

  if (levelCounts[TrainingLevel.PRO] >= 2) {
    return TrainingLevel.PRO;
  } else if (levelCounts[TrainingLevel.POWER] >= 2) {
    return TrainingLevel.POWER;
  }
  return TrainingLevel.BASIC;
};