import { Entity } from "../entity";
import { TrainingLevel } from "./survey.enum";

export interface QuestionPayload {
  id: string;
  text: string;
  order: number;
  answerOptions: AnswerOptionPayload[];
}

export interface AnswerOptionPayload {
  id: string;
  text: string;
  level: TrainingLevel;
}

export interface UserAnswerPayload {
  questionId: string;
  selectedOptionId: string;
}

export class SurveyEntity extends Entity {
  constructor(
    private title: string,
    private description: string | null,
    private questions: QuestionPayload[],
  ) {
    super();
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getQuestions(): QuestionPayload[] {
    return this.questions;
  }

  static fromPrisma(payload: any): SurveyEntity {
    const survey = new SurveyEntity(
      payload.survey_title,
      payload.survey_description,
      payload.questions?.map((q: any) => ({
        id: q.question_id,
        text: q.question_text,
        order: q.question_order,
        answerOptions: q.answerOptions?.map((opt: any) => ({
          id: opt.option_id,
          text: opt.option_text,
          level: opt.option_level,
        })) || [],
      })) || []
    );
    survey.setId(payload.survey_id);
    return survey;
  }
}