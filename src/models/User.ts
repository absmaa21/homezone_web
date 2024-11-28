export interface User {
  id: string,
  username: string,
  email: string,
  access_token: string,
  refresh_token: string,
  created_at: number,
  updated_at: number,
}

// Fetches
export interface RegisterEndpointResponse {
  id: string,
  name: string,
  email: string,
  created_at: string,
}

export interface LoginEndpointResponse {
  access_token: string,
  refresh_token: string,
}

export interface InfoEndpointResponse {
  id: string,
  name: string,
  email: string,
  updated_at: string,
  created_at: string,
}

export type RefreshEndpointResponse = LoginEndpointResponse