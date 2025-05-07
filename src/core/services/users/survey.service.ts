
import { PrismaClient } from "@prisma/client";
import { SurveyEntity, UserAnswerPayload } from "../../entities/users/survey.entity";
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

export const submitSurveyService = async (
  userId: string,
  surveyId: string,
  answers: UserAnswerPayload[]
): Promise<void> => {
  return onSession(async (client: PrismaClient) => {
    const answerLevels = await client.answerOption.findMany({
      where: {
        option_id: {
          in: answers.map((a) => a.selectedOptionId),
        },
      },
      select: {
        option_level: true,
      },
    });

    const finalLevel = determineFinalLevel(answerLevels.map((a) => a.option_level));

    await client.userSurvey.create({
      data: {
        submission_user: userId,
        submission_survey: surveyId,
        submission_level: finalLevel,
        answers: {
          create: answers.map((answer) => ({
            answer_question: answer.questionId,
            answer_selected_option: answer.selectedOptionId,
          })),
        },
      },
    });
  });
};

export const getSurveyService = async (surveyId: string): Promise<SurveyEntity> => {
  return onSession(async (client: PrismaClient) => {
    const survey = await client.survey.findUnique({
      where: { survey_id: surveyId },
      include: {
        questions: {
          include: {
            answerOptions: true,
          },
        },
      },
    });

    if (!survey) {
      throw new Error('Survey not found');
    }

    return SurveyEntity.fromPrisma(survey);
  });
};

function determineFinalLevel(levels: TrainingLevel[]): TrainingLevel {
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
}
