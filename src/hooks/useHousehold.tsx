import {HouseholdContext, HouseholdContextProps} from "../contexts/Contexts.tsx";
import {useContext} from "react";

export const useHousehold = (): HouseholdContextProps => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHousehold must be used within a HouseholdProvider");
  }
  return context;
};