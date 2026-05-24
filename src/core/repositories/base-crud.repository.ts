import { injectable } from "inversify";
import type { ApiClient } from "@/core/http/api-client.interface";
import { toQueryString } from "@/core/utils/query-string";
import type {
  CrudListParams,
  CrudRepository,
  CrudRepositoryConfig,
  EntityId,
} from "./crud.types";

@injectable()
export abstract class BaseCrudRepository<
    TEntity,
    TCreateInput,
    TUpdateInput,
    TFilters,
    TResponseDto = TEntity,
  >
  implements CrudRepository<TEntity, TCreateInput, TUpdateInput, TFilters>
{
  constructor(
    protected readonly client: ApiClient,
    protected readonly config: CrudRepositoryConfig<
      TEntity,
      TResponseDto,
      TFilters
    >
  ) {}

  async list(filters?: CrudListParams<TFilters>) {
    const query = this.config.buildListQuery
      ? this.config.buildListQuery(filters)
      : toQueryString((filters ?? {}) as Record<string, unknown>);
    const response = await this.client.get<unknown>(
      `${this.config.endpoint}${query}`
    );

    if (this.config.extractList) {
      const extracted = this.config.extractList(response, filters);
      return {
        ...extracted,
        items: this.mapMany(extracted.items),
      };
    }

    const data = response as TResponseDto[];
    return {
      items: this.mapMany(data),
      total: data.length,
      page: filters?.page ?? 1,
      perPage: filters?.perPage ?? data.length,
    };
  }

  async getById(id: EntityId) {
    const response = await this.client.get<TResponseDto>(
      `${this.config.endpoint}/${id}`
    );
    return this.mapOne(response);
  }

  async create(input: TCreateInput) {
    const response = await this.client.post<TResponseDto>(
      this.config.endpoint,
      input
    );
    return this.mapOne(response);
  }

  async update(id: EntityId, input: TUpdateInput) {
    const response = await this.client.patch<TResponseDto>(
      `${this.config.endpoint}/${id}`,
      input
    );
    return this.mapOne(response);
  }

  async delete(id: EntityId) {
    await this.client.delete(`${this.config.endpoint}/${id}`);
  }

  protected mapOne(dto: TResponseDto) {
    return this.config.mapOne
      ? this.config.mapOne(dto)
      : (dto as unknown as TEntity);
  }

  protected mapMany(dtos: TResponseDto[]) {
    return this.config.mapMany
      ? this.config.mapMany(dtos)
      : dtos.map((item) => this.mapOne(item));
  }
}
