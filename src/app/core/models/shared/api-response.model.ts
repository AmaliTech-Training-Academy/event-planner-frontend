export interface ApiResponse<T> {
  description: string | null;
  data: T;
}
