import React, {useEffect, useState} from "react";
import {InfoEndpointResponse, User} from "../models/User.ts";
import {base_url, env, Environment} from "../../env.ts";
import {Storage} from "../utils/Storage.ts";
import {UserContext} from "./Contexts.tsx";
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

  const register = async (uname: string, email: string, password: string): Promise<void> => {
    if (env === Environment.FRONTEND) {
      Toast.push('ENV is Frontend. Skipping register.')
      return
    }

    const r = await fetch(`${base_url}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name: uname, email, password}),
    })

    if (r.status === 400) {
      Toast.push('Invalid or missing body!', 'error')
      return
    } else if (r.status === 409) {
      Toast.push('Email already in use!', 'warning')
      return
    } else if (r.status === 422) {
      Toast.push('Invalid values!', 'error')
      return
    } else if (r.status === 500) {
      Toast.push('Internal Server error! Try again.', 'error')
      return
    } else if (r.status !== 200) {
      Toast.push('Something went wrong! Try again.', 'error')
      return
    }

    Toast.push('Successfully registered!')
  };

  const login = async (email: string, password: string): Promise<void> => {
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
      return
    }

    const loginResponse = await fetch(`${base_url}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password}),
    })

    if (loginResponse.status === 400) {
      Toast.push('Invalid or missing body!', 'error')
      return
    } else if ([401, 204].includes(loginResponse.status)) {
      Toast.push('Invalid credentials!', 'warning')
      return
    } else if (loginResponse.status !== 200) {
      Toast.push('Something went wrong! Try again.', 'error')
      return
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
      return
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
  };

  const refreshToken = () => {
    console.log("Refreshing token...");
    // TODO flr schuld
  };

  const logout = async () => {
    if (env === Environment.FRONTEND) {
      Storage.remove("user")
      setUser(null)
      Toast.push('ENV is Frontend. Skipping logout.')
      return
    }

    if (!user?.access_token) {
      Toast.push('Something went wrong! Refresh website.', 'error')
      return;
    }

    const r = await fetch(`${base_url}/user/logout`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + user.access_token,
      },
    })

    if (r.status !== 200) {
      Toast.push('Something went wrong! Try again.', 'error')
      return
    }

    Storage.remove("user")
    setUser(null);
    Toast.push('Logout was successful.')
  };

  return (
    <UserContext.Provider
      value={{user, register, login, refreshToken, logout, invalidateToken: () => setTokenInvalid(true)}}
    >
      {children}
    </UserContext.Provider>
  );
}

