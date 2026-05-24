import type {
  CrudListParams,
  CrudRepository,
  PaginatedResult,
} from "@/core/repositories/crud.types";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFilters,
} from "../model/user.types";

export interface IUserRepository
  extends CrudRepository<User, CreateUserInput, UpdateUserInput, UserFilters> {
  list(filters?: CrudListParams<UserFilters>): Promise<PaginatedResult<User>>;
}
