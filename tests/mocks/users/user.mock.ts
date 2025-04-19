import { faker } from "@faker-js/faker";

import { AuthProvider, AuthType, UserPrisma } from "../../../src/core/entities/users/common_user.entity";
import { UserRole } from "../../../src/core/entities/users/role.enum";

export const genRandomUserPrisma = ({
  user_id = faker.string.uuid(),
  user_username = faker.internet.userName(),
  user_first_name = faker.person.firstName(),
  user_last_name = faker.person.lastName(),
  user_email = faker.internet.email(),
  user_terms = true,
  user_is_active = true,
  user_uid = faker.string.alpha(),
  user_role = UserRole.COMMON_USER,
  user_auth_provider = AuthProvider.FIREBASE,
  user_auth_type = AuthType.EMAIL_AND_PASSWORD,
  user_organization_client_id = "CLIENT_ID",
  user_created_at = new Date(),
  user_updated_at = new Date(),
} = {}): UserPrisma => {
  return {
    user_id,
    user_username,
    user_first_name,
    user_last_name,
    user_email,
    user_terms,
    user_is_active,
    user_uid,
    user_role,
    user_auth_provider,
    user_auth_type,
    user_organization_client_id,
    user_created_at,
    user_updated_at,
  };
};
