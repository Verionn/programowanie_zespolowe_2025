import React from "react";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import createIconSetFromIcoMoon from "@expo/vector-icons/createIconSetFromIcoMoon";
import { ThemedView } from "@/components/ThemedView";

const Icon = createIconSetFromIcoMoon(
  require("../../assets/svg/iconMoon/selection.json"),
  "IcoMoon",
  "icomoon.ttf"
);

interface IcoMoonProps {
  name: string;
  size?: number;
  width?: number | string;
  height?: number | string;
  color?:string;
}

export const IconMoon: React.FC<IcoMoonProps> = ({
  name,
  size = 30,
  width = '100%',
  height = '100%',
  color='#000000'
}) => {
  const [fontsLoaded] = useFonts({
    IcoMoon: require("../../assets/svg/iconMoon/icomoon.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <Icon name={name} size={size} color={color} style={{ width:width, height:height }} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    display:'flex',
    justifyContent: "center",
    alignItems: "center",
  },
});
