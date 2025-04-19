import { CommonUserEntity, UserResponse } from "../../../core/entities/users/common_user.entity";
import { presentUserBase } from "./user_base.presenter";

export const presentCommonUser = (commonUser: CommonUserEntity): UserResponse => {
  return {
    ...presentUserBase(commonUser),
    username: commonUser.getUsername(),
    terms: commonUser.getTerms(),
    isActive: commonUser.getIsActive(),
    uid: commonUser.getUid(),
    authProvider: commonUser.getAuthProvider(),
    authType: commonUser.getAuthType(),
  };
};
