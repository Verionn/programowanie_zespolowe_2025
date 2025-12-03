import { FlatList, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import React from "react";
import { ThemedBackground } from "@/components/ThemedBackground";
import { MapViewContainer } from "@/components/MapViewContainer";
import { ButtonNavigation } from "@/components/ButtonNavigation";
import { TabNavigationData } from "@/constants/TabNavigation";
import { getHeightPercent } from "@/utils/function/functions";

export default function HomeScreen() {
  return (
    <ThemedBackground style={{ flex: 1 }} isSafeAreaNeeded={false}>
      <View style={styles.stepContainer}>
        <FlatList
          data={TabNavigationData}
          renderItem={({ item }) => <ButtonNavigation item={item} />}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          style={styles.flatList}
        />
        <MapViewContainer />
      </View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    position: "relative",
  },
  flatListContainer: {
    paddingHorizontal: 10,
    marginTop: getHeightPercent(20),
  },
  flatList: {
    position: "absolute",
    top: getHeightPercent(10),
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 100,
    display: "flex",
  },
});
