import {ReactNode, useState} from "react";
import { HouseholdContext } from "./Contexts";
import {useToast} from "../hooks/useToast.tsx";
import {env, Environment} from "../../env.ts";

function HouseholdProvider({children}: {children: ReactNode}) {

  const Toast = useToast()

  const [household, setHousehold] = useState<Household | null>(null)

  const join = async (code: string) => {
    if (env === Environment.FRONTEND) {
      Toast.push('Env is Frontend. Skipping join.')
      setHousehold({name: 'Absi\'s household', joinCode: code})
      return
    }

    // TODO
  }

  const create = async (): Promise<void> => {
    if (env === Environment.FRONTEND) {
      Toast.push('Env is Frontend. Skipping create.')
      await join('a1b2c3')
      return
    }

    // TODO
  }

  return (
    <HouseholdContext.Provider
      value={{household, join, create}}
    >
      {children}
    </HouseholdContext.Provider>
  )
}

export default HouseholdProvider