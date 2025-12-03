import { Href } from "expo-router";
import { Timespan } from "react-native/Libraries/Utilities/IPerformanceLogger";

export type RegionType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type EmergencyType = {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: string;
  status: boolean;
  latitude: number;
  longitude: number;
  startDate: Date;
};

export type ItemNavigationType = {
  name: string;
  goTo: Href;
};

export type EmergencyTypesEnum =
  | "CLEANUP_ASSISTANCE"
  | "FOOD_SUPPLY"
  | "WATER_SUPPLY"
  | "MEDICINE_SUPPLY"
  | "HYGIENE_PRODUCTS"
  | "REPAIR_ASSISTANCE"
  | "USER_LOCATION";

export type EmergencyTypesWithTranslationEnum = {
  label: string;
  value: string;
};
export const EmergencyTypesWithTranslation = [
  { label: "Wsparcie przy sprzątaniu", value: "CLEANUP_ASSISTANCE" },
  { label: "Dostawa jedzenia", value: "FOOD_SUPPLY" },
  { label: "Dostawa wody", value: "WATER_SUPPLY" },
  { label: "Dostawa leków", value: "MEDICINE_SUPPLY" },
  { label: "Dostawa środków higienicznych", value: "HYGIENE_PRODUCTS" },
  { label: "Wsparcie przy naprawach", value: "REPAIR_ASSISTANCE" },
];
