import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ApiService } from "@/utils/api/CRUD";
import { getEndpoint } from "@/constants/variables";
import { EmergencyType } from "@/utils/types/types";
import * as Location from "expo-location";
interface ApiContextProps {
  emergencies: EmergencyType[];
  location: Location.LocationObject | null;
  fetchEmergencies: () => Promise<void>;
  updateLocation: (location: Location.LocationObject | null) => Promise<void>;
  addEmergency: (newEmergency: EmergencyType) => Promise<void>;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [emergencies, setEmergencies] = useState<EmergencyType[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
  
    async function startWatchingLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
  
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (newLocation) => {
          console.log("Location updated...");
          setLocation(newLocation);
        }
      );
    }
  
    startWatchingLocation();
  
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const fetchEmergencies = useCallback(async () => {
    try {
      const response = await ApiService.get<{ emergencies: EmergencyType[] }>(
        `${await getEndpoint()}emergencies`
      );
      console.log("Emergencie fetched ...");
      setEmergencies(response.emergencies);
    } catch (error) {
      console.error("Error fetching emergencies:", error);
    }
  }, []);

  const updateLocation = async (
    location: Location.LocationObject | null
  ): Promise<void> => {
    if (location) {
      setLocation(location);
    }
  };
  const addEmergency = useCallback(
    async (newEmergency: EmergencyType) => {
      try {
        await ApiService.post<{ emergencies: EmergencyType[] }>(
          `${await getEndpoint()}emergencies`,
          newEmergency
        );
        await fetchEmergencies();
      } catch (error) {
        console.error("Error adding emergency:", error);
      }
    },
    [fetchEmergencies]
  );

  useEffect(() => {
    fetchEmergencies();
  }, [fetchEmergencies]);

  return (
    <ApiContext.Provider
      value={{
        emergencies,
        location,
        fetchEmergencies,
        addEmergency,
        updateLocation,
      }}
    >
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
