import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiService } from "@/utils/api/CRUD";
import { endpoint } from "@/constants/variables";
import { EmergencyType } from "@/utils/types/types";

interface ApiContextProps {
  emergencies: EmergencyType[];
  fetchEmergencies: () => Promise<void>;
  addEmergency: (newEmergency: EmergencyType) => Promise<void>;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [emergencies, setEmergencies] = useState<EmergencyType[]>([]);

  const fetchEmergencies = async () => {
    try {
      const response = await ApiService.get<{ emergencies: EmergencyType[] }>(
        `${endpoint}emergencies`
      );
      setEmergencies(response.emergencies);
    } catch (error) {
      console.error("Error fetching emergencies:", error);
    }
  };

  const addEmergency = async (newEmergency: EmergencyType) => {
    try {
      await ApiService.post<{ emergencies: EmergencyType[] }>(
        `${endpoint}emergencies`,
        newEmergency
      );
      await fetchEmergencies();
    } catch (error) {
      console.error("Error adding emergency:", error);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  return (
    <ApiContext.Provider value={{ emergencies, fetchEmergencies, addEmergency }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
};
