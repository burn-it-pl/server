/*
  Warnings:

  - You are about to drop the column `survey_level` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `survey_user` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the `survey_answers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `survey_title` to the `surveys` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users"."survey_answers" DROP CONSTRAINT "survey_answers_answer_survey_fkey";

-- DropForeignKey
ALTER TABLE "users"."surveys" DROP CONSTRAINT "surveys_survey_user_fkey";

-- AlterTable
ALTER TABLE "users"."surveys" DROP COLUMN "survey_level",
DROP COLUMN "survey_user",
ADD COLUMN     "survey_description" TEXT,
ADD COLUMN     "survey_title" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "users"."survey_answers";

-- CreateTable
CREATE TABLE "users"."questions" (
    "question_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question_survey" UUID NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_order" INTEGER NOT NULL,
    "question_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "users"."answer_options" (
    "option_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "option_question" UUID NOT NULL,
    "option_text" TEXT NOT NULL,
    "option_level" "users"."training_level_enum" NOT NULL,
    "option_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "option_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "users"."user_surveys" (
    "submission_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "submission_user" UUID NOT NULL,
    "submission_survey" UUID NOT NULL,
    "submission_level" "users"."training_level_enum" NOT NULL,
    "submission_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submission_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_surveys_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "users"."user_answers" (
    "answer_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "answer_submission" UUID NOT NULL,
    "answer_question" UUID NOT NULL,
    "answer_selected_option" UUID NOT NULL,
    "answer_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answer_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_answers_pkey" PRIMARY KEY ("answer_id")
);

-- AddForeignKey
ALTER TABLE "users"."questions" ADD CONSTRAINT "questions_question_survey_fkey" FOREIGN KEY ("question_survey") REFERENCES "users"."surveys"("survey_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."answer_options" ADD CONSTRAINT "answer_options_option_question_fkey" FOREIGN KEY ("option_question") REFERENCES "users"."questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."user_surveys" ADD CONSTRAINT "user_surveys_submission_user_fkey" FOREIGN KEY ("submission_user") REFERENCES "users"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."user_surveys" ADD CONSTRAINT "user_surveys_submission_survey_fkey" FOREIGN KEY ("submission_survey") REFERENCES "users"."surveys"("survey_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."user_answers" ADD CONSTRAINT "user_answers_answer_submission_fkey" FOREIGN KEY ("answer_submission") REFERENCES "users"."user_surveys"("submission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."user_answers" ADD CONSTRAINT "user_answers_answer_question_fkey" FOREIGN KEY ("answer_question") REFERENCES "users"."questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."user_answers" ADD CONSTRAINT "user_answers_answer_selected_option_fkey" FOREIGN KEY ("answer_selected_option") REFERENCES "users"."answer_options"("option_id") ON DELETE RESTRICT ON UPDATE CASCADE;
