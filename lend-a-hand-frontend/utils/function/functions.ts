import {Dimensions} from "react-native";
import {EmergencyTypesEnum} from "../types/types";
import {emergencyTypeTranslations} from "@/constants/variables";

export function getHeightPercent(percent: number) {
  return Dimensions.get("window").width * (percent / 100);
}

export function getWidthPercent(percent: number) {
  return Dimensions.get("window").height * (percent / 100);
}

export function translateEmergencyType(type: EmergencyTypesEnum): string {
  return emergencyTypeTranslations[type];
}