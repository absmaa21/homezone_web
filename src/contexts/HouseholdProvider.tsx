import {ReactNode, useState} from "react";
import {HouseholdContext} from "./Contexts";
import {useToast} from "../hooks/useToast.tsx";
import {base_url, env, Environment} from "../../env.ts";
import {CreateHouseholdResponse, Household, JoinHouseholdResponse} from "../models/Household";
import {useAuth} from "../hooks/useAuth.tsx";
import {Log} from "../utils/Logging.ts";

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
    Log.info('Household joined: ' + JSON.stringify(body))
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
    Log.info('Household created: ' + JSON.stringify(body))
    Toast.push('Created household ' + name)
  }


  const leave = async (id: string): Promise<void> => {
    if (env === Environment.FRONTEND) {
      Toast.push('Env is Frontend. Skipping leave.')
      return
    }

    const r = await fetch(`${base_url}/user/homes/${id}/leave`, {
      method: 'POST',
      headers: User.getHeadersWithTokens(),
    })

    if (!r.ok) {
      Toast.push('Something went wrong leaving the household.', 'error')
      throw new Error('Error leaving household: ' + r.status)
    }

    setHouseholds(p => p.filter(x => x.id !== id))
    Log.info('Household leaved: ' + id)
    Toast.push('Leaved household!')
  }


  return (
    <HouseholdContext.Provider
      value={{households, join, create, leave}}
    >
      {children}
    </HouseholdContext.Provider>
  )
}

export default HouseholdProvider