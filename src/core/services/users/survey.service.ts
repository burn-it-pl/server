
import { PrismaClient } from "@prisma/client";
import { SurveyEntity, SurveyAnswerPayload } from "../../entities/users/survey.entity";
import { TrainingLevel } from "../../entities/users/survey.enum";
import { onSession } from "../../../infrastructure/database/prisma";

export const createSurveyService = async (
  userId: string,
  answers: SurveyAnswerPayload[]
): Promise<SurveyEntity> => {
  return onSession(async (client: PrismaClient) => {
    const finalLevel = determineFinalLevel(answers);

    const survey = await client.survey.create({
      data: {
        survey_user: userId,
        survey_level: finalLevel,
        answers: {
          create: answers.map((answer) => ({
            answer_question: answer.question,
            answer_value: answer.value,
            answer_level: answer.level,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return SurveyEntity.fromPrisma(survey);
  });
};

export const getUserSurveysService = async (userId: string): Promise<SurveyEntity[]> => {
  return onSession(async (client: PrismaClient) => {
    const surveys = await client.survey.findMany({
      where: {
        survey_user: userId,
      },
      include: {
        answers: true,
      },
      orderBy: {
        survey_created_at: "desc",
      },
    });

    return surveys.map((survey) => SurveyEntity.fromPrisma(survey));
  });
};

function determineFinalLevel(answers: SurveyAnswerPayload[]): TrainingLevel {
  const levelCounts = answers.reduce((acc, answer) => {
    acc[answer.level] = (acc[answer.level] || 0) + 1;
    return acc;
  }, {} as Record<TrainingLevel, number>);

  // Decision matrix based on the provided spreadsheet
  if (levelCounts[TrainingLevel.PRO] >= 2) {
    return TrainingLevel.PRO;
  } else if (levelCounts[TrainingLevel.POWER] >= 2) {
    return TrainingLevel.POWER;
  }
  return TrainingLevel.BASIC;
}
