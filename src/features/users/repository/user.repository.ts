import { inject, injectable } from "inversify";
import type { ApiClient } from "@/core/http/api-client.interface";
import { BaseCrudRepository } from "@/core/repositories/base-crud.repository";
import type { CrudListParams } from "@/core/repositories/crud.types";
import { TOKENS } from "@/core/di/tokens";
import { USERS_ENDPOINT } from "../api/user.api";
import { extractUsersList, mapUserDtoToUser } from "../model/user.mapper";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserDto,
  UserFilters,
  UserStatsSummary,
} from "../model/user.types";
import type { IUserRepository } from "./user.repository.interface";

@injectable()
export class UserRepository
  extends BaseCrudRepository<
    User,
    CreateUserInput,
    UpdateUserInput,
    UserFilters,
    UserDto
  >
  implements IUserRepository
{
  constructor(@inject(TOKENS.ApiClient) client: ApiClient) {
    super(client, {
      endpoint: USERS_ENDPOINT,
      mapOne: mapUserDtoToUser,
      mapMany: (items) => items.map(mapUserDtoToUser),
      buildListQuery: (filters?: CrudListParams<UserFilters>) => {
        const params = new URLSearchParams();
        params.set("page", String(filters?.page ?? 1));
        params.set("itemsPerPage", String(filters?.perPage ?? 10));

        if (filters?.search) {
          params.set("search", filters.search);
        }

        if (filters?.status) {
          params.set("status", filters.status);
        }

        if (filters?.role) {
          params.set("role", filters.role);
        }

        if (filters?.department) {
          params.set("department", filters.department);
        }

        if (filters?.city) {
          params.set("city", filters.city);
        }

        return `?${params.toString()}`;
      },
      extractList: (response, filters) =>
        extractUsersList(response, {
          page: filters?.page,
          perPage: filters?.perPage,
        }),
    });
  }

  async getStats(): Promise<UserStatsSummary> {
    const response = await this.client.get<UserStatsSummary>(`${USERS_ENDPOINT}/stats`);
    return response;
  }
}
