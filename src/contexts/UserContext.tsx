import React, {createContext, useContext, useEffect, useState} from "react";
import {InfoEndpointResponse, User} from "../models/User.ts";
import {base_url, env, Environment} from "../../env.ts";
import {useNavigate} from "react-router-dom";
import {Storage} from "../utils/Storage.ts";

interface UserContextProps {
  user: User | null;
  register: (uname: string, email: string, password: string) => Promise<string>;
  login: (email: string, password: string) => Promise<string>;
  refreshToken: () => void;
  logout: () => void;
  invalidateToken: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      Storage.save("user", user)
      navigate("/")
      return
    }

    const storedUser = Storage.load("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      return
    }
  }, [navigate, user]);

  useEffect(() => {
    if (tokenInvalid) refreshToken()
  }, [tokenInvalid]);

  const register = async (uname: string, email: string, password: string): Promise<string> => {
    if (env === Environment.FRONTEND) {
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
      console.error("Error registering: " + r.statusText);
      return r.statusText
    }

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
  } catch (err) {
    console.error("Error logging in: ", err);
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

return (
  <UserContext.Provider
    value={{user, register, login, refreshToken, logout, invalidateToken: () => setTokenInvalid(true)}}
  >
    {children}
  </UserContext.Provider>
);
}
;

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
