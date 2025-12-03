import React from "react";
import {Pressable, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Callout, Marker} from "react-native-maps";
import {Point} from "geojson";
import {pinColors, tintColorLight} from "@/constants/Colors";
import {EmergencyTypesEnum} from "@/utils/types/types";
import {useRouter} from "expo-router";
import {translateEmergencyType} from "@/utils/function/functions";

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
            numberOfLines={1}
            adjustsFontSizeToFit
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
       // title={emergency.title}
       // description={translateEmergencyType(emergency.type as EmergencyTypeEnum)}
        pinColor={pinColors[properties.type as EmergencyTypesEnum]}
      >
        {/*<Callout >
          <View style={styles.calloutContainer}>

          </View>
        </Callout>*/}
        {<Callout
          tooltip={false}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/emergency-details/[id]",
              params: { id: emergency.id },
            })
          }
          style={styles.callout}
        >
          <View style={styles.calloutContainer}>
            <Text
              style={styles.calloutTitle}
              numberOfLines={1} 
              adjustsFontSizeToFit
            >
              {emergency.title}
            </Text>
            <Text style={styles.calloutDescription}>
              {`${emergency.description.slice(0, 20)}...`}
            </Text>
            <Text style={styles.calloutType}>
              Typ: {translateEmergencyType(emergency.type as EmergencyTypesEnum)}
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
        </Callout>}
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
  calloutContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: tintColorLight,
    borderWidth: 1,
    minWidth: 200,
    maxWidth: 300,
    minHeight: 80,
    justifyContent: "center",
  },
  callout: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: tintColorLight,
    borderWidth: 1,
    minWidth: 200,
    maxWidth: 300,
    minHeight: 500,
    justifyContent: "center",
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
    marginBottom: 4,
  },
  detail: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  viewMoreButton: {
    padding: 8,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    alignItems: "center",
  },
  viewMoreText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});


export default ClusterMarker;
