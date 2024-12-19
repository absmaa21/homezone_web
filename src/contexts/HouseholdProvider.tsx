import {ReactNode, useState} from "react";
import { HouseholdContext } from "./Contexts";
import {useToast} from "../hooks/useToast.tsx";
import {base_url, env, Environment} from "../../env.ts";
import {CreateHouseholdResponse, Household, JoinHouseholdResponse} from "../models/Household";
import {useAuth} from "../hooks/useAuth.tsx";

function HouseholdProvider({children}: {children: ReactNode}) {
  const Toast = useToast()
  const User = useAuth()

  const [households, setHouseholds] = useState<Household[]>([])


  const join = async (code: string) => {
    if (env === Environment.FRONTEND) {
      Toast.push('Env is Frontend. Skipping join.')
      setHouseholds([{name: 'Test household', created_at: Date.now(), updated_at: Date.now(), id: '123', joinCode: code}])
      return
    }

    if (code.length < 6) {
      Toast.push('Code is not in a valid format!')
      return
    }

    const r = await fetch(`${base_url}/home/${code}/join`, {
      method: 'POST',
      headers: User.getHeadersWithTokens(),
    })

    if (!r.ok) {
      Toast.push('Something went wrong joining the household.', 'error')
      throw new Error('Error joining household: ' + r.status)
    }

    const body: JoinHouseholdResponse = await r.json()
    setHouseholds(p => [
      ...p,
      {
        ...body,
        created_at: Date.parse(body.created_at),
        updated_at: Date.parse(body.updated_at),
      }
    ])
    console.log('Household joined: ' + JSON.stringify(body))
    Toast.push('Joined Household ' + body.name)
  }


  const create = async (name: string): Promise<void> => {
    if (env === Environment.FRONTEND) {
      Toast.push('Env is Frontend. Skipping create.')
      await join('a1b2c3')
      return
    }

    const r = await fetch(`${base_url}/home/`, {
      method: 'POST',
      headers: User.getHeadersWithTokens(),
      body: JSON.stringify({name})
    })

    if (!r.ok) {
      Toast.push('Something went wrong creating the household.', 'error')
      throw new Error('Error creating household: ' + r.status)
    }

    const body: CreateHouseholdResponse = await r.json()
    setHouseholds(p => [
      ...p,
      {
        ...body,
        created_at: Date.parse(body.created_at),
        updated_at: Date.parse(body.updated_at),
      }
    ])
    console.log('Household created: ' + JSON.stringify(body))
    Toast.push('Created household ' + name)
  }


  return (
    <HouseholdContext.Provider
      value={{households, join, create}}
    >
      {children}
    </HouseholdContext.Provider>
  )
}

export default HouseholdProvider