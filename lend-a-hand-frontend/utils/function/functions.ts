import * as SecureStore from "expo-secure-store";
import {jwtDecode} from "jwt-decode";
import {Dimensions} from "react-native";
import {EmergencyTypesEnum} from "../types/types";
import {emergencyTypeTranslations, token} from "@/constants/variables";

export function getHeightPercent(percent: number) {
    return Dimensions.get("window").width * (percent / 100);
}

export function getWidthPercent(percent: number) {
    return Dimensions.get("window").height * (percent / 100);
}

export function translateEmergencyType(type: EmergencyTypesEnum): string {
    return emergencyTypeTranslations[type];
}

export async function saveSecureItem(
    key: string,
    value: string
): Promise<void> {
    await SecureStore.setItemAsync(key, value);
}

export async function getSecureItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
}

export async function deleteSecureItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
}

export const checkToken = async (token: string): Promise<boolean | null> => {
    try {
        if (!token) {
            throw new Error("Token not found.");
        }

        const decodedToken = jwtDecode(token);
        if (!decodedToken.exp) {
            throw new Error("Token does not have an expiration time.");
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
            throw new Error("Token is expired.");
        }

        return true;
    } catch (e: any) {
        console.log("Error validating token:", e.message);
        return false;
    }
};

export const getUserId = async (token: string): Promise<string | null> => {
    try {
        const isvalid = await checkToken(token);
        if (!isvalid) {
            throw new Error("Token is not valid");
        }
        const decodedToken = jwtDecode(token);
        if (!decodedToken.sub) {
            throw new Error("User ID not found in token.");
        }
        return decodedToken.sub;
    } catch (e: any) {
        console.log("Error validating token:", e.message);
        return null;
    }
};

export const getToken = async (token: string): Promise<string | null> => {
  if (!token) return null;
  const savedToken: string | null = await getSecureItem(token);
  console.log("Retrieved Token:", savedToken);
  return savedToken || null;
};
