export type Id = string;          // Mongo ObjectId serialized to string
export type ISODateString = string;

export type Timestamped = {
  createdAt: ISODateString;
  updatedAt: ISODateString;
};
export type WithId<T> = T & { id: Id };

export type Paginated<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};
export type PaginationQuery = {
  page?: number;     // default 1
  pageSize?: number; // default 25
};
export type SortOrder = "asc" | "desc";

export type SortQuery<K extends string> = {
  sortBy?: K;
  sortOrder?: SortOrder; // default "asc"
};
export type LibrarySortKey = "title" | "createdAt" | "updatedAt";
export type LibraryListQuery = PaginationQuery & SortQuery<LibrarySortKey>;
