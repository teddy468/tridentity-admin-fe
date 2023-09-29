declare interface PaginationMetadata {
  'x-next-page': number;
  'x-page': number;
  'x-pages-count': number;
  'x-per-page': number;
  'x-total-count': number;
}

declare interface PaginationData<T> {
  data: T[];
  metadata: PaginationMetadata;
}
