-- DropForeignKey
ALTER TABLE "users"."answer_options" DROP CONSTRAINT "answer_options_option_question_fkey";

-- DropForeignKey
ALTER TABLE "users"."questions" DROP CONSTRAINT "questions_question_survey_fkey";

-- AlterTable
ALTER TABLE "users"."answer_options" ALTER COLUMN "option_question" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users"."questions" ALTER COLUMN "question_survey" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users"."questions" ADD CONSTRAINT "questions_question_survey_fkey" FOREIGN KEY ("question_survey") REFERENCES "users"."surveys"("survey_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."answer_options" ADD CONSTRAINT "answer_options_option_question_fkey" FOREIGN KEY ("option_question") REFERENCES "users"."questions"("question_id") ON DELETE SET NULL ON UPDATE CASCADE;
