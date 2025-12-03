import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Marker } from "react-native-maps";
import { Point } from "geojson";

interface ClusterMarkerProps {
  geometry: Point;
  properties: any;
  onPress: () => void;
  clusterColor?: string;
  clusterTextColor?: string;
  clusterFontFamily?: string;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  geometry,
  properties,
  onPress,
  clusterColor = "#00B386",
  clusterTextColor = "#FFFFFF",
  clusterFontFamily,
}) => {
  const points = properties.point_count || 0;
  const clusterSize = Math.min(40 + points * 5, 80);
  const fontSize = Math.min(18 + points * 0.1, 28);
  if (points > 1) {
    return (
      <Marker
        coordinate={{
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
        }}
        onPress={onPress}
      >
        <TouchableOpacity
          style={[
            styles.cluster,
            {
              backgroundColor: clusterColor,
              width: clusterSize,
              height: clusterSize,
              borderRadius: clusterSize / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.clusterText,
              {
                color: clusterTextColor,
                fontFamily: clusterFontFamily,
                fontSize,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {points}
          </Text>
        </TouchableOpacity>
      </Marker>
    );
  }
};

const styles = StyleSheet.create({
  cluster: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  clusterText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ClusterMarker;
