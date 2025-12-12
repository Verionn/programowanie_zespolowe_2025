import {EmergencyTypesEnum} from "@/utils/types/types";
import {Platform} from "react-native";
import * as Device from "expo-device";

export const getEndpoint = async () => {
  let url = "";
  if (Platform.OS === "android" && !Device.isDevice) {
    url = "http://10.0.2.2:8080";
  } else url = "http://192.168.0.103:8080";
  return url;
};

export const token = `token`;

export const emergencyTypeTranslations: Record<EmergencyTypesEnum, string> = {
  CLEANUP_ASSISTANCE: "Pomoc w sprzątaniu",
  FOOD_SUPPLY: "Dostawa żywności",
  WATER_SUPPLY: "Dostawa wody",
  MEDICINE_SUPPLY: "Dostawa leków",
  HYGIENE_PRODUCTS: "Produkty higieniczne",
  REPAIR_ASSISTANCE: "Pomoc w naprawie",
  USER_LOCATION: "Twoja lokalizacja",
};
