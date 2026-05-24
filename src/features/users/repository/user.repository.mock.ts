import { injectable } from "inversify";
import type {
  CrudListParams,
  EntityId,
} from "@/core/repositories/crud.types";
import { generateMockUsers } from "../model/user.mock-data";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFilters,
} from "../model/user.types";
import type { IUserRepository } from "./user.repository.interface";

@injectable()
export class MockUserRepository implements IUserRepository {
  private users = generateMockUsers(120);

  async list(filters?: CrudListParams<UserFilters>) {
    const search = filters?.search?.toLowerCase().trim() ?? "";
    const page = filters?.page ?? 1;
    const perPage = filters?.perPage ?? 10;

    const filtered = search
      ? this.users.filter((user) =>
          [
            user.fullName,
            user.username,
            user.email,
            user.role.name,
            user.employeeId,
            user.department,
            user.jobTitle,
            user.city,
            user.country,
            user.manager,
          ]
            .join(" ")
            .toLowerCase()
            .includes(search)
        )
      : this.users;

    const start = (page - 1) * perPage;
    const items = filtered.slice(start, start + perPage);

    return {
      items,
      total: filtered.length,
      page,
      perPage,
    };
  }

  async getById(id: EntityId) {
    const user = this.users.find((item) => item.id === Number(id));
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  }

  async create(input: CreateUserInput) {
    const user: User = {
      id: this.users.length + 1,
      employeeId: `EMP-${String(this.users.length + 1).padStart(4, "0")}`,
      fullName: input.fullName,
      username: input.username,
      email: input.email,
      phone: input.phone,
      role: { id: input.roleId, name: `Role ${input.roleId}` },
      department: "Operations",
      jobTitle: "New Hire",
      city: "Cotonou",
      country: "Benin",
      manager: "Manager 1",
      contractType: "CDI",
      salaryBand: "B1",
      status: "pending",
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.users.push(user);
    return user;
  }

  async update(id: EntityId, input: UpdateUserInput) {
    const user = await this.getById(id);
    const updated: User = {
      ...user,
      ...input,
      role: input.roleId
        ? { id: input.roleId, name: `Role ${input.roleId}` }
        : user.role,
    };

    this.users = this.users.map((item) =>
      item.id === updated.id ? updated : item
    );

    return updated;
  }

  async delete(id: EntityId) {
    this.users = this.users.filter((item) => item.id !== Number(id));
  }
}
