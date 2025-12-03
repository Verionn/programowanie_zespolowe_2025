import { UserContext } from "@/utils/context/userContext";
import { useContext } from "react";

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};

export { useUserContext };