import {ToastContext, ToastContextProps} from "../contexts/Contexts.tsx";
import {useContext} from "react";

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};