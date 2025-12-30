import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {ApiService} from "@/utils/api/CRUD";
import {getEndpoint, token} from "@/constants/variables";
import {EmergencyType} from "@/utils/types/types";
import * as Location from "expo-location";
import {getSecureItem} from "@/utils/function/functions";

interface ApiContextProps {
    emergencies: EmergencyType[];
    filteredEmergencies: EmergencyType[];
    location: Location.LocationObject | null;
    fetchEmergencies: () => Promise<void>;
    updateLocation: (location: Location.LocationObject | null) => Promise<void>;
    addEmergency: (newEmergency: EmergencyType) => Promise<void>;
    selectedCategories: String[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<String[]>>;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [emergencies, setEmergencies] = useState<EmergencyType[]>([]);
    const [filteredEmergencies, setFilteredEmergencies] = useState<EmergencyType[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<String[]>([]);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        let locationSubscription: Location.LocationSubscription | null = null;

        async function startWatchingLocation() {
            const {status} = await Location.requestForegroundPermissionsAsync();
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
            if (!token) throw new Error("No token provided");
            const savedToken: string | null = await getSecureItem(token);
            console.log("Retrieved Token:", savedToken);
            if (!savedToken || savedToken === "") throw Error("Invalid token");

            const response = await ApiService.get<{ emergencies: EmergencyType[] }>(
                `${await getEndpoint()}/emergencies`, {Authorization: `Bearer ${savedToken}`}
            );
            console.log("Emergencies fetched ...");
            setEmergencies(response.data.emergencies);
            setSelectedCategories([])
        } catch (error) {
            console.error("Error fetching emergencies:", error);
        }
    }, []);

    const updateLocation = async (location: Location.LocationObject | null): Promise<void> => {
        if (location) {
            setLocation(location);
        }
    };

    const addEmergency = useCallback(
        async (newEmergency: EmergencyType) => {
            try {
                if (!token) throw new Error("No token provided");
                const savedToken: string | null = await getSecureItem(token);
                console.log("Retrieved Token:", savedToken);
                if (!savedToken || savedToken === "") throw Error("Invalid token");

                await ApiService.post<{ emergencies: EmergencyType[] }>(
                    `${await getEndpoint()}/emergencies`,
                    newEmergency,
                    {Authorization: `Bearer ${savedToken}`}
                );
                await fetchEmergencies();
            } catch (error) {
                console.error("Error adding emergency:", error);
            }
        },
        [fetchEmergencies]
    );

    useEffect(() => {

        if (selectedCategories.length === 0) {
            setFilteredEmergencies(emergencies)
        } else {
            setFilteredEmergencies(
                emergencies.filter((emergency) => selectedCategories.includes(emergency.type))
            );
        }

    }, [selectedCategories, emergencies]);

    return (
        <ApiContext.Provider
            value={{
                emergencies,
                filteredEmergencies,
                location,
                fetchEmergencies,
                addEmergency,
                updateLocation,
                setSelectedCategories,
                selectedCategories
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
