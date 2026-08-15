export interface ApiError {
  detail: string | { msg: string; loc: (string | number)[] }[];
}
