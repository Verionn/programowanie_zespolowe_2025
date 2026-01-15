import React, {createContext, ReactNode, useEffect, useState} from "react";
import * as Location from "expo-location";
import {Platform} from "react-native";
import * as Device from "expo-device";
import {UserType} from "@/utils/types/types";
import {getSecureItem} from "@/utils/function/functions";
import {getEndpoint, token} from "@/constants/variables";
import {ApiService} from "@/utils/api/CRUD";

interface userContextType {
    location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;
    user: UserType | null;
    fetchUser: (userId: string) => Promise<void>;
}

const UserContext = createContext<userContextType | undefined>(undefined);

interface userProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<userProviderProps> = ({children}) => {
    const [location, setLocation] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS === "android" && !Device.isDevice) {
                setErrorMsg(
                    "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
                );
                return;
            }
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let locationResult = await Location.getCurrentPositionAsync({});
            setLocation(JSON.stringify(locationResult));
        })();
    }, []);

    const fetchUser = async (userId: string) => {
        try {
            const savedToken = await getSecureItem(token);
            if (!savedToken) throw Error("No token");

            const response = await ApiService.get<UserType>(
                `${await getEndpoint()}/user/${userId}`,
                {Authorization: `Bearer ${savedToken}`}
            );

            setUser(response.data);
        } catch (e) {
            console.log("Error fetching user");
        }
    };

    return (
        <UserContext.Provider value={{location, setLocation, user, fetchUser}}>
            {children}
        </UserContext.Provider>
    );
};

export {UserProvider, UserContext};
