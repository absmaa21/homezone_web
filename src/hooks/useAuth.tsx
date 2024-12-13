import {useContext} from "react";
import {AuthContext, AuthContextProps} from "../contexts/Contexts.tsx";

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};