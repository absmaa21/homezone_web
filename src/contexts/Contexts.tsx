import {createContext} from "react";
import {RefreshEndpointResponse, User} from "../models/User.ts";
import {Message} from "./ToastProvider.tsx";
import {Household} from "../models/Household";


export interface UserContextProps {
  user: User | null;
  register: (uname: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  refreshToken: () => Promise<RefreshEndpointResponse | null>;
  logout: () => void;
  checkTokenValidation: () => Promise<boolean>;
  getHeadersWithTokens: () => HeadersInit;
}
export const UserContext = createContext<UserContextProps | undefined>(undefined);


export interface ToastContextProps {
  message: Message | null,
  push: (message: string, type?: MessageType) => void,
  clear: () => void,
}
export const ToastContext = createContext<ToastContextProps | undefined>(undefined)


export interface HouseholdContextProps {
  households: Household[],
  join: (code: string) => Promise<void>,
  create: (name: string) => Promise<void>,
}
export const HouseholdContext = createContext<HouseholdContextProps | undefined>(undefined)
