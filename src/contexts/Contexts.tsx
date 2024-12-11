import {createContext} from "react";
import {User} from "../models/User.ts";
import {Message} from "./ToastProvider.tsx";


export interface UserContextProps {
  user: User | null;
  register: (uname: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  refreshToken: () => void;
  logout: () => void;
  invalidateToken: () => void;
}
export const UserContext = createContext<UserContextProps | undefined>(undefined);


export interface ToastContextProps {
  message: Message | null,
  push: (message: string, type?: MessageType) => void,
  clear: () => void,
}
export const ToastContext = createContext<ToastContextProps | undefined>(undefined)


export interface HouseholdContextProps {
  household: Household | null,
  join: (code: string) => Promise<void>,
  create: () => Promise<void>,
}
export const HouseholdContext = createContext<HouseholdContextProps | undefined>(undefined)