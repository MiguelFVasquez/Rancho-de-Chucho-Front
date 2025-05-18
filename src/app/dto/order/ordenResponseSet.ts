export interface OrdenResponseSet<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  ordenes: T[];
}
