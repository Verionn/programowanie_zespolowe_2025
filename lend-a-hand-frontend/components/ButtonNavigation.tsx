import { EmergencyTypesWithTranslationEnum } from "@/utils/types/types";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useApiContext } from "@/utils/context/apiContext";

type TabNavigationType = {
  item: EmergencyTypesWithTranslationEnum;
};

export const ButtonNavigation: React.FC<TabNavigationType> = ({ item }) => {
  const { setFilter } = useApiContext();
  const [currentFilter, setCurrentFilter] = useState<EmergencyTypesWithTranslationEnum | null>(null);

  const isActive = currentFilter?.value === item.value;

  const handlePress = () => {
    if (isActive) {
      setCurrentFilter(null);
      setFilter(null);
    } else {
      setCurrentFilter(item);
      setFilter(item);
    }
  };

  return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
            onPress={handlePress}
            style={[
              styles.button,
              { backgroundColor: isActive ? "#FFFFFF" : "transparent" },
              { borderColor: isActive ? "#FFFFFF" : "#000000" },
            ]}
        >
          <Text
              style={[
                styles.buttonText,
                { color: isActive ? "#000000" : "#000000" },
              ]}
          >
            {item.label}
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
