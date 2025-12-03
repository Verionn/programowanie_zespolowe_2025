import { EmergencyTypeEnum } from "@/utils/types/types";
import { Platform } from "react-native";
import * as Device from "expo-device";

export const getEndpoint = async () => {
  let url = "";
  if (Platform.OS === "android" && !Device.isDevice) {
    url = "http://10.0.2.2:8080/";
  } else url = "http://192.168.0.103:8080/";
  console.log(url)
  return url;
};

export const endpoint = "http://10.0.2.2:8080/"

export const emergencyTypeTranslations: Record<EmergencyTypeEnum, string> = {
  CLEANUP_ASSISTANCE: "Pomoc w sprzątaniu",
  FOOD_SUPPLY: "Dostawa żywności",
  WATER_SUPPLY: "Dostawa wody",
  MEDICINE_SUPPLY: "Dostawa leków",
  HYGIENE_PRODUCTS: "Produkty higieniczne",
  REPAIR_ASSISTANCE: "Pomoc w naprawie",
  USER_LOCATION: "Twoja lokalizacja",
};
