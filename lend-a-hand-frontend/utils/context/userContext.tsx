import React, {createContext, ReactNode, useEffect, useState} from "react";
import * as Location from "expo-location";
import {Platform} from "react-native";
import * as Device from "expo-device";

interface userContextType {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<userContextType | undefined>(undefined);

interface userProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<userProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Device.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(JSON.stringify(locationResult));
    })();
  }, []);

  
  return (
    <UserContext.Provider value={{ location, setLocation }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
