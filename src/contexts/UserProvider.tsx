import React, {useEffect, useState} from "react";
import {InfoEndpointResponse, LoginEndpointResponse, RefreshEndpointResponse, User} from "../models/User.ts";
import {base_url, env, Environment} from "../../env.ts";
import {Storage} from "../utils/Storage.ts";
import {UserContext} from "./Contexts.tsx";
import {useToast} from "../hooks/useToast.tsx";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const Toast = useToast()
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      Storage.save("user", user)
      checkTokenValidation()
      return
    }

    const storedUser = Storage.load("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      return
    }
  }, [user]);

  useEffect(() => {
    getInfo()
  }, [user?.access_token]);

  async function checkTokenValidation(): Promise<boolean> {
    if (env === Environment.FRONTEND) return true
    if (!user) return false

    console.log('Checking token validation')

    try {
      const refreshStr = atob(user.refresh_token.split('.')[1]);
      const expiresAt = JSON.parse(refreshStr)['exp']
      if (Date.now() > Date.parse(expiresAt)) {
        console.log('Refresh Token expired!')
        expireUser()
        return false
      }
    } catch (error) {
      console.error("Invalid Base64 string", error);
      expireUser()
      return false
    }

    let str = ''

    if (!user.access_token) {
      console.log("access token invalid!")
      expireUser()
      return false
    }

    try {
      str = atob(user.access_token.split('.')[1]);
    } catch (error) {
      console.error("Invalid Base64 string", error);
      return !!await refreshToken()
    }

    const expiresAt = JSON.parse(str)['exp']
    if (Date.now() > Date.parse(expiresAt)) {
      console.log('access token expired!')
      return !!await refreshToken()
    }

    return true
  }

  function expireUser() {
    Toast.push('User expired! Please login.')
    setUser(null)
    Storage.remove('user')
  }

  async function getInfo() {
    if (!user) return

    const infoFetch = await fetch(`${base_url}/user/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.access_token,
      },
    })

    if (!infoFetch.ok) return

    const infoBody: InfoEndpointResponse = await infoFetch.json()

    setUser(p => p && ({
      ...p,
      ...infoBody,
      created_at: Date.parse(infoBody.createdAt),
      updated_at: Date.parse(infoBody.updatedAt),
    }))
  }

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
      body: JSON.stringify({username: uname, email, password}),
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
      console.error(loginResponse.statusText)
      Toast.push(`Something went wrong! Try again.`, 'error')
      return
    }

    const loginBody: LoginEndpointResponse = await loginResponse.json()

    if (!loginBody.accessToken) {
      throw new Error('Login: Invalid access token')
    }

    setUser({
      access_token: loginBody.accessToken,
      refresh_token: loginBody.refreshToken,
      id: '',
      username: '',
      email,
      created_at: -1,
    })

    Toast.push('Login successful!')
  };

  const refreshToken = async (): Promise<RefreshEndpointResponse | null> => {
    if (env === Environment.FRONTEND) {
      console.log('Env is frontend. Skipping token refresh.')
      return {accessToken: 'abc', refreshToken: '123'}
    }

    if (!user) return null

    const r = await fetch(`${base_url}/user/refresh`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.access_token,
        'X-Refresh-Token': user.refresh_token,
      }
    })

    if (!r.ok) {
      console.error(r.statusText)
      return null
    }

    const body: RefreshEndpointResponse = await r.json()
    setUser(p => p && ({...p, ...body}))
    return body
  };

  const logout = async () => {
    Storage.remove("user")
    setUser(null)

    if (env === Environment.FRONTEND) {
      Toast.push('ENV is Frontend. Skipping logout.')
      return
    }

    await checkTokenValidation()

    if (!user?.access_token || !user.refresh_token) {
      Toast.push('Something went wrong! Refresh website.', 'error')
      return;
    }

    const r = await fetch(`${base_url}/user/logout`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + user.access_token,
        'X-Refresh-Token': user.refresh_token,
      },
    })

    if (r.status !== 200) {
      console.error(r.statusText)
      Toast.push('Something went wrong! Try again.', 'error')
      return
    }

    Toast.push('Logout was successful.')
  };

  return (
    <UserContext.Provider
      value={{user, register, login, refreshToken, logout, checkTokenValidation}}
    >
      {children}
    </UserContext.Provider>
  );
}

