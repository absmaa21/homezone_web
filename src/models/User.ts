export interface User {
  id: string,
  username: string,
  email: string,
  access_token: string,
  refresh_token: string,
  created_at: number,
  updated_at?: number,
  image?: string,
}

// Fetches
export interface RegisterEndpointResponse {
  id: string,
  username: string,
  email: string,
  created_at: string,
  updated_at: string,
}

export interface LoginEndpointResponse {
  accessToken: string,
  refreshToken: string,
}

export interface InfoEndpointResponse {
  id: string,
  username: string,
  email: string,
  createdAt: string,
  updatedAt: string,
}

export type RefreshEndpointResponse = LoginEndpointResponse