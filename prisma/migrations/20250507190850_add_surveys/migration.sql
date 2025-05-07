-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "organizations";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "subscriptions";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateEnum
CREATE TYPE "users"."auth_provider_enum" AS ENUM ('FIREBASE');

-- CreateEnum
CREATE TYPE "users"."auth_type_enum" AS ENUM ('EMAIL_AND_PASSWORD', 'FACEBOOK_AUTH', 'GOOGLE_AUTH', 'GITHUB_AUTH');

-- CreateEnum
CREATE TYPE "users"."training_level_enum" AS ENUM ('BASIC', 'POWER', 'PRO');

-- CreateTable
CREATE TABLE "users"."users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_username" VARCHAR(63) NOT NULL,
    "user_first_name" VARCHAR(63) NOT NULL,
    "user_last_name" VARCHAR(63) NOT NULL,
    "user_email" VARCHAR(63) NOT NULL,
    "user_terms" BOOLEAN NOT NULL DEFAULT false,
    "user_is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_uid" VARCHAR(255) NOT NULL,
    "user_role" VARCHAR(63) NOT NULL,
    "user_auth_provider" "users"."auth_provider_enum" NOT NULL,
    "user_auth_type" "users"."auth_type_enum" NOT NULL,
    "user_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "users"."roles" (
    "role_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_name" VARCHAR(63) NOT NULL,
    "role_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "users"."auth_token_statuses" (
    "auth_token_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "auth_token_user" UUID NOT NULL,
    "auth_token_issued_at" BIGINT NOT NULL,
    "auth_token_expiration_time" BIGINT NOT NULL,
    "auth_token_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auth_token_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_token_statuses_pkey" PRIMARY KEY ("auth_token_id")
);

-- CreateTable
CREATE TABLE "users"."surveys" (
    "survey_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "survey_user" UUID NOT NULL,
    "survey_level" "users"."training_level_enum" NOT NULL,
    "survey_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "survey_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("survey_id")
);

-- CreateTable
CREATE TABLE "users"."survey_answers" (
    "answer_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "answer_survey" UUID NOT NULL,
    "answer_question" VARCHAR(255) NOT NULL,
    "answer_value" VARCHAR(255) NOT NULL,
    "answer_level" "users"."training_level_enum" NOT NULL,
    "answer_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answer_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_answers_pkey" PRIMARY KEY ("answer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "users"."roles"("role_name");

-- AddForeignKey
ALTER TABLE "users"."users" ADD CONSTRAINT "users_user_role_fkey" FOREIGN KEY ("user_role") REFERENCES "users"."roles"("role_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."auth_token_statuses" ADD CONSTRAINT "auth_token_statuses_auth_token_user_fkey" FOREIGN KEY ("auth_token_user") REFERENCES "users"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."surveys" ADD CONSTRAINT "surveys_survey_user_fkey" FOREIGN KEY ("survey_user") REFERENCES "users"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."survey_answers" ADD CONSTRAINT "survey_answers_answer_survey_fkey" FOREIGN KEY ("answer_survey") REFERENCES "users"."surveys"("survey_id") ON DELETE RESTRICT ON UPDATE CASCADE;
