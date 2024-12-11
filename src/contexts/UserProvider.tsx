import React, {useEffect, useState} from "react";
import {InfoEndpointResponse, User} from "../models/User.ts";
import {base_url, env, Environment} from "../../env.ts";
import {Storage} from "../utils/Storage.ts";
import { UserContext } from "./Contexts.tsx";
import {useToast} from "../hooks/useToast.tsx";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const Toast = useToast()
  const [user, setUser] = useState<User | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      Storage.save("user", user)
      return
    }

    const storedUser = Storage.load("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      return
    }
  }, [user]);

  useEffect(() => {
    if (tokenInvalid) refreshToken()
  }, [tokenInvalid]);

  const register = async (uname: string, email: string, password: string): Promise<string> => {
    if (env === Environment.FRONTEND) {
      Toast.push('ENV is Frontend. Skipping register.')
      return ''
    }

    const r = await fetch(`${base_url}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name: uname, email, password}),
    })

    if (!r.ok) {
      Toast.push(r.statusText, 'error')
      console.error("Error registering: " + r.statusText);
      return r.statusText
    }

    Toast.push('Successfully registered!')
    console.log("Successfully registered!");
    return ''
  };

  const login = async (email: string, password: string): Promise<string> => {
    if (env === Environment.FRONTEND) {
      setUser({
        id: 'abc123-dfg-456',
        username: 'orcan',
        email: 'orcan@gmail.com',
        access_token: 'eyra',
        refresh_token: 'neyra',
        created_at: Date.now() - 543243,
        updated_at: Date.now(),
      })
      Toast.push('ENV is Frontend. Skipping login.')
      return ''
    }

    try {
      const loginResponse = await fetch(`${base_url}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      })

      if (!loginResponse.ok) {
        Toast.push(loginResponse.statusText, 'error')
        return loginResponse.statusText
      }

      let tempUser: User = {
        ...(await loginResponse.json()),
        id: '',
        username: '',
        email: '',
        created_at: -1,
        updated_at: -1,
      }

      if (!tempUser.access_token) {
        console.error("User not found! " + JSON.stringify(tempUser))
        Toast.push('User is invalid. Try again.', 'error')
        return "User is invalid! Try again."
      }

      const infoFetch: InfoEndpointResponse = await (
        await fetch(`${base_url}/user/info`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tempUser.access_token,
          },
        })
      ).json();

      tempUser = {
        ...infoFetch,
        ...tempUser,
        username: infoFetch.name,
        created_at: Date.parse(infoFetch.created_at),
        updated_at: Date.parse(infoFetch.updated_at),
      }

      setUser(tempUser)
      console.log("Login successful!")
      Toast.push('Login successful!')
    } catch (err) {
      console.error("Error logging in: ", err);
      Toast.push('Something went wrong! Try again.')
      return "Something went wrong! Try again."
    }

    return ""
  };

  const refreshToken = () => {
    console.log("Refreshing token...");
    // TODO
  };

  const logout = () => {
    if (env === Environment.FRONTEND) {
      Storage.remove("user")
      setUser(null)
      Toast.push('ENV is Frontend. Skipping logout.')
      return
    }

    if (user?.access_token) {
      fetch(`${base_url}/user/logout`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      })
        .then((r) => {
          if (r.ok) {
            Storage.remove("user")
            setUser(null);
            Toast.push('Logout was successful.')
          } else {
            Toast.push('Error logging out.', 'error')
            console.error("Error logging out. ", r.statusText);
          }
        })
        .catch((err) => console.error("Network error: ", err));
    } else {
      Toast.push('Something went wrong! Try again.', 'error')
    }
  };

  return (
    <UserContext.Provider
      value={{user, register, login, refreshToken, logout, invalidateToken: () => setTokenInvalid(true)}}
    >
      {children}
    </UserContext.Provider>
  );
}

