import { PrismaClient } from "@prisma/client";

import { ErrorMessage } from "../../../adapters/api/errors/errors.enum";
import { NotFoundError } from "../../../adapters/api/errors/not_found.error";
import { onSession } from "../../../infrastructure/database/prisma";
import { CommonUserEntity } from "../../entities/users/common_user.entity";
import { findUsersService } from "../../services/users/users.service";

export const getUsersInteractor = async (): Promise<CommonUserEntity[]> => {
  const users = await onSession(async (client: PrismaClient) => {
    return findUsersService(client);
  });

  if (!users.length) {
    throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
  }

  return users;
};

