import React from "react";
import {
  View,
  StyleSheet,
  type ViewProps,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import LightBackground from "../assets/svg/background_bs.svg";

export type ThemedBackgroundProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedBackground({
  style,
  lightColor,
  darkColor,
  children,
  ...otherProps
}: ThemedBackgroundProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <View style={[{ backgroundColor }, style]} {...otherProps}>
      <View style={styles.backgroundContainer}>
        <LightBackground width="100%" height="100%" />
      </View>
      <SafeAreaView style={styles.overlay}>{children}</SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    paddingTop:40
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
