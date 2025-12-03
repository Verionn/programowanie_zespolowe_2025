import { Dimensions } from "react-native";

export function getHeightPercent(percent: number) {
  return Dimensions.get("window").width * (percent / 100);
}

export function getWidthPercent(percent: number) {
  return Dimensions.get("window").height * (percent / 100);
}
