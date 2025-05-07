
import { Entity } from "../entity";
import { TrainingLevel } from "./survey.enum";

export interface SurveyAnswerPayload {
  question: string;
  value: string;
  level: TrainingLevel;
}

export class SurveyEntity extends Entity {
  private userId: string;
  private level: TrainingLevel;
  private answers: SurveyAnswerPayload[];

  constructor(userId: string, level: TrainingLevel, answers: SurveyAnswerPayload[]) {
    super();
    this.userId = userId;
    this.level = level;
    this.answers = answers;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getLevel(): TrainingLevel {
    return this.level;
  }

  public getAnswers(): SurveyAnswerPayload[] {
    return this.answers;
  }

  static fromPrisma(payload: any): SurveyEntity {
    const survey = new SurveyEntity(
      payload.survey_user,
      payload.survey_level,
      payload.answers.map((answer: any) => ({
        question: answer.answer_question,
        value: answer.answer_value,
        level: answer.answer_level,
      }))
    );
    survey.setId(payload.survey_id);
    return survey;
  }
}
