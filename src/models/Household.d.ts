interface Household {
  id: string,
  name: string,
  created_at: number,
  updated_at: number,
  joinCode?: string,
}


export type CreateHouseholdResponse = {
  "created_at": string,
  "id": string,
  "name": string,
  "updated_at": string
}

export type JoinHouseholdResponse = CreateHouseholdResponse

export type AllHouseholdsResponse = CreateHouseholdResponse[]