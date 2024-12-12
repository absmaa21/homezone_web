interface QueryResponse {
  data: object | null,
  status: number,
  message: string,
  ok: boolean,
  isFetching: boolean,
}