import React, {useEffect, useState} from "react";
import {
  InfoEndpointResponse,
  LoginEndpointResponse,
  RefreshEndpointResponse,
  User,
} from "../models/User.ts";
import {base_url, env, Environment} from "../../env.ts";
import {Storage} from "../utils/Storage.ts";
import {AuthContext} from "./Contexts.tsx";
import {useToast} from "../hooks/useToast.tsx";
import StatusResponseHandling from "../utils/StatusResponseHandling.ts";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const Toast = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = Storage.load("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [])

  useEffect(() => {
    if (user) {
      Storage.save("user", user);
      validateToken();
    }
  }, [user]);

  const validateToken = () => {
    checkTokenValidation().then(r => r ? getInfo() : expireUser())
  }

  const isTokenExpired = (token: string): boolean => {
    try {
      const {exp} = JSON.parse(atob(token.split(".")[1]));
      return Date.now() > exp * 1000;
    } catch {
      return true;
    }
  }

  const checkTokenValidation = async (): Promise<boolean> => {
    if (env === Environment.FRONTEND) return true;
    if (!user) return false;

    if (!user.refresh_token || isTokenExpired(user.refresh_token)) {
      expireUser();
      return false;
    }

    if (!user.access_token || isTokenExpired(user.access_token)) {
      return !!(await refreshToken());
    }

    return true;
  }

  const expireUser = () => {
    Toast.push("User expired! Please login.");
    setUser(null);
    Storage.remove("user");
  }

  const getInfo = async () => {
    if (!user) return;

    const response = await fetch(`${base_url}/user/`, {
      method: "GET",
      headers: getHeadersWithTokens(),
    });

    if (!response.ok) return;

    const data: InfoEndpointResponse = await response.json();
    setUser((prev) => prev && {...prev, ...data});
  }

  const register = async (username: string, email: string, password: string) => {
    if (env === Environment.FRONTEND) {
      Toast.push("ENV is Frontend. Skipping register.");
      return;
    }

    const response = await fetch(`${base_url}/user/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, email, password}),
    });

    const handledResponse = StatusResponseHandling.register(response);
    Toast.push(handledResponse.msg, handledResponse.type);
  }

  const login = async (email: string, password: string) => {
    if (env === Environment.FRONTEND) {
      setUser({
        id: "abc123",
        username: "orcan",
        email,
        access_token: "eyra",
        refresh_token: "neyra",
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      Toast.push("ENV is Frontend. Skipping login.");
      return;
    }

    const response = await fetch(`${base_url}/user/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, password}),
    })

    const handledResponse = StatusResponseHandling.login(response);
    if (!handledResponse.ok) {
      Toast.push(handledResponse.msg, handledResponse.type);
      return;
    }

    const {accessToken, refreshToken}: LoginEndpointResponse = await response.json();
    setUser({
      id: "",
      username: "",
      email,
      access_token: accessToken,
      refresh_token: refreshToken,
      created_at: -1,
    })

    Toast.push(handledResponse.msg);
  }

  const refreshToken = async (): Promise<RefreshEndpointResponse | null> => {
    if (env === Environment.FRONTEND) {
      return {accessToken: "abc", refreshToken: "123"};
    }

    const response = await fetch(`${base_url}/user/refresh`, {
      method: "POST",
      headers: getHeadersWithTokens(),
    });

    if (!response.ok) return null;

    const data: RefreshEndpointResponse = await response.json();
    setUser((prev) => prev && {...prev, ...data});
    return data;
  }

  const logout = async () => {
    setUser(null);
    Storage.remove("user");

    if (env !== Environment.FRONTEND) {
      await fetch(`${base_url}/user/logout`, {
        method: "POST",
        headers: getHeadersWithTokens(),
      });
    }

    Toast.push("Logout was successful.");
  }

  const getHeadersWithTokens = (): HeadersInit => {
    if (!user) throw new Error("User is not logged in");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.access_token}`,
      "X-Refresh-Token": user.refresh_token,
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        refreshToken,
        logout,
        checkTokenValidation,
        getHeadersWithTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
