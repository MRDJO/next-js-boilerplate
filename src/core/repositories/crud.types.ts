export type EntityId = string | number;

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export type CrudListParams<TFilters> = PaginationParams & SortParams & TFilters;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface CrudRepositoryConfig<TEntity, TResponseDto, TFilters> {
  endpoint: string;
  mapOne?: (dto: TResponseDto) => TEntity;
  mapMany?: (dtos: TResponseDto[]) => TEntity[];
  buildListQuery?: (filters?: CrudListParams<TFilters>) => string;
  extractList?: (
    response: unknown,
    filters?: CrudListParams<TFilters>
  ) => PaginatedResult<TResponseDto>;
}

export interface CrudRepository<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TFilters,
> {
  list(filters?: CrudListParams<TFilters>): Promise<PaginatedResult<TEntity>>;
  getById(id: EntityId): Promise<TEntity>;
  create(input: TCreateInput): Promise<TEntity>;
  update(id: EntityId, input: TUpdateInput): Promise<TEntity>;
  delete(id: EntityId): Promise<void>;
}
