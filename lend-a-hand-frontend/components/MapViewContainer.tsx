import { useUserContext } from "@/hooks/useUserContext";
import { RegionType } from "@/utils/types/types";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

export const MapViewContainer = () => {
  const [region, setRegion] = useState<RegionType | null>(null);
  const { location, setLocation } = useUserContext();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(JSON.stringify(loc));
      console.log(JSON.stringify(loc));
      const { latitude, longitude } = loc.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {region ? (
        <View style={styles.mapContainer}>
          <MapView initialRegion={region} style={{ flex: 1 }} />
        </View>
      ) : (
        <Text>Loading map...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    zIndex:1
  },
});