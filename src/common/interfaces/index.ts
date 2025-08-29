export interface ApiResponse<T> {
  result: boolean;
  code?: string;
  data?: T;
  message: string;
  date?: Date | string;
  path?: string;
  takenTime?: string;
}

export interface ResponseListDto<T> {
  data: T;
  totalElements: number;
  totalPages: number;
}
