interface Household {
  id: string,
  name: string,
  created_at: number,
  updated_at: number,
  joinCode?: string,
}


export interface CreateHouseholdResponse {
  "created_at": string,
  "id": string,
  "name": string,
  "updated_at": string
}