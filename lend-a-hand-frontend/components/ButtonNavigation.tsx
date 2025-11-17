import { ItemNavigationType } from "@/utils/types/types";
import { useRouter, usePathname } from "expo-router";
import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

type TabNavigationType = {
  item: ItemNavigationType;
};

export const ButtonNavigation: React.FC<TabNavigationType> = ({ item }) => {
  const router = useRouter();
  const currentRoute = usePathname();
  const isActive = currentRoute === item.goTo;

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => router.push(item.goTo)}
        style={[
          styles.button,
          { backgroundColor: isActive ? "#FFFFFF" : "transparent" },
          { borderColor: isActive ? "#FFFFFF" : "#00000" },
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            { color: isActive ? "#000000" : "#000000" },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 2,
  },
  buttonText: {
    color: "#000000",
    fontSize: 20,
  },
});
