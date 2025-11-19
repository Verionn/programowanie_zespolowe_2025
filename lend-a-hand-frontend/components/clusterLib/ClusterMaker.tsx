import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Callout, Marker } from "react-native-maps";
import { Point } from "geojson";
import { pinColors, tintColorLight } from "@/constants/Colors";
import { EmergencyTypeEnum } from "@/utils/types/types";
import { useRouter } from "expo-router";
import { translateEmergencyType } from "@/utils/function/functions";

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
  const clusterSize = Math.min(30 + points * 3, 70);
  const fontSize = Math.min(16 + points * 0.2, 24);
  const router = useRouter();
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
          >
            {points}
          </Text>
        </TouchableOpacity>
      </Marker>
    );
  } else {
    const emergency = properties;
    return (
      <Marker
        coordinate={{
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
        }}
        pinColor={pinColors[properties.type as EmergencyTypeEnum]}
      >
        <Callout
          tooltip
          onPress={() =>
            router.push({
              pathname: "/(tabs)/emergency-details/[id]",
              params: { id: emergency.id },
            })
          }
        >
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle}>{emergency.title}</Text>
            <Text style={styles.calloutDescription}>
              {`${emergency.description.slice(0, 20)}...`}
            </Text>
            <Text style={styles.calloutType}>
              Typ: {translateEmergencyType(emergency.type as EmergencyTypeEnum)}
            </Text>
            <Text style={styles.detail}>
              Data rozpoczęcia:{" "}
              {new Date(emergency.startDate).toLocaleDateString()}
            </Text>
            <Pressable
              style={styles.viewMoreButton}
              onPress={() => console.log("Pressed")}
            >
              <Text style={styles.viewMoreText}>Więcej szczegółów</Text>
            </Pressable>
          </View>
        </Callout>
      </Marker>
    );
  }
};

const styles = StyleSheet.create({
  cluster: {
    backgroundColor: "#00B386",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  clusterText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  calloutContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: tintColorLight,
    borderWidth: 1,
    maxWidth: 200,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  calloutType: {
    fontSize: 12,
    color: "#555",
  },
  calloutDate: {
    fontSize: 12,
    color: "#555",
  },
  viewMoreButton: {
    marginTop: 8,
    padding: 6,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    alignItems: "center",
  },
  viewMoreText: {
    color: "white",
    fontSize: 14,
  },
  detail: { fontSize: 14, color: "#555", marginBottom: 5 },
});

export default ClusterMarker;
