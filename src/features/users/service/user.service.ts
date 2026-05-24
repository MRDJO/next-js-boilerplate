import { getAppContainer } from "@/core/di/container";
import { TOKENS } from "@/core/di/tokens";
import { withSimulatedDelay } from "@/lib/simulate-delay";
import type { CrudListParams } from "@/core/repositories/crud.types";
import type { UserFilters } from "../model/user.types";
import type { IUserRepository } from "../repository/user.repository.interface";

const getUserRepository = () => {
  return getAppContainer().get<IUserRepository>(TOKENS.UserRepository);
};

export const userService = {
  list(filters?: CrudListParams<UserFilters>) {
    return withSimulatedDelay(() => getUserRepository().list(filters));
  },
  getStats() {
    return withSimulatedDelay(() => getUserRepository().getStats());
  },
  getById(id: string | number) {
    return getUserRepository().getById(id);
  },
};
