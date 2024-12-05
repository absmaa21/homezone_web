import React, {createContext, useContext, useEffect, useState} from "react";
import {InfoEndpointResponse, LoginEndpointResponse, User} from "../models/User.ts";
import {base_url, env, Environment} from "../../env.ts";
import {useNavigate} from "react-router-dom";

interface UserContextProps {
  user: User | null;
  register: (uname: string, email: string, password: string) => void;
  login: (email: string, password: string) => Promise<void>;
  refreshToken: () => void;
  logout: () => void;
  getInfo: (accessToken: string) => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      navigate("/")
      return
    }
    if (window.location.href.includes("login") || window.location.href.includes("register")) return

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      return
    }

    navigate("/login")
  }, [navigate, user]);

  const register = (uname: string, email: string, password: string): boolean => {
    fetch(`${base_url}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name: uname, email, password}),
    })
      .then((r) => {
        if (!r.ok) {
          console.error("Error registering: " + r.statusText);
          return false;
        }
        console.log("Successfully registered!");
        return true
      })
      .catch((err) => console.error("Network error: ", err));

    return false
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
      return
    }

    try {
      const loginFetch: LoginEndpointResponse = await (
        await fetch(`${base_url}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email, password}),
        })
      ).json();

      setUser({
        ...loginFetch,
        id: '',
        username: '',
        email: '',
        created_at: -1,
        updated_at: -1,
      })

      if (!loginFetch.access_token) {
        console.error("User not found! " + JSON.stringify(loginFetch))
        return
      }

      await getInfo(loginFetch.access_token)
      console.log("Login successful!")
    } catch (err) {
      console.error("Error logging in: ", err);
    }
  };

  const refreshToken = () => {
    console.log("Refreshing token...");
    // TODO
  };

  const logout = () => {
    if (env === Environment.FRONTEND) {
      localStorage.removeItem("user")
      setUser(null)
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
            localStorage.removeItem("user")
            setUser(null);
            console.log("Logged out successfully.");
          } else {
            console.error("Error logging out.");
          }
        })
        .catch((err) => console.error("Network error: ", err));
    } else {
      console.error("User is null! " + JSON.stringify(user))
    }
  };

  const getInfo = async (accessToken: string) => {
    if (!user) return

    console.log("Fetching user info...");
    const infoFetch: InfoEndpointResponse = await (
      await fetch(`${base_url}/user/info`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
    ).json();

    setUser({
      ...user,
      ...infoFetch,
      username: infoFetch.name,
      created_at: Date.parse(infoFetch.created_at),
      updated_at: Date.parse(infoFetch.updated_at),
    });
    console.log("Info Fetch successful!");
  };

  return (
    <UserContext.Provider
      value={{user, register, login, refreshToken, logout, getInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
