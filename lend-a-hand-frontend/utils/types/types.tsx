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

export type EmergencyTypeEnum =
  | "CLEANUP_ASSISTANCE"
  | "FOOD_SUPPLY"
  | "WATER_SUPPLY"
  | "MEDICINE_SUPPLY"
  | "HYGIENE_PRODUCTS"
  | "REPAIR_ASSISTANCE"
  | "USER_LOCATION";
