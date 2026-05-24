import { getAppContainer } from "@/core/di/container";
import { TOKENS } from "@/core/di/tokens";
import type { CrudListParams } from "@/core/repositories/crud.types";
import type { UserFilters } from "../model/user.types";
import type { IUserRepository } from "../repository/user.repository.interface";

const getUserRepository = () => {
  return getAppContainer().get<IUserRepository>(TOKENS.UserRepository);
};

export const userService = {
  list(filters?: CrudListParams<UserFilters>) {
    return getUserRepository().list(filters);
  },
  getStats() {
    return getUserRepository().getStats();
  },
  getById(id: string | number) {
    return getUserRepository().getById(id);
  },
};
