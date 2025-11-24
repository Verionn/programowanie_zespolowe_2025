import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { View, StyleSheet, Pressable } from "react-native";
import * as Location from "expo-location";
import SuperCluster, { PointFeature, ClusterFeature } from "supercluster";
import UserLocationButton from "./UserLocationButton";
import {
  calculateBBox,
  returnMapZoom,
  markerToGeoJSONFeature,
} from "./mapHelpers";
import { EmergencyType } from "@/utils/types/types";
import { ApiService } from "@/utils/api/CRUD";
import { endpoint } from "@/constants/variables";
import { pinColors, tintColorLight } from "@/constants/Colors";
import ClusterMarker from "./ClusterMarker";
import { getWidthPercent } from "@/utils/function/functions";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useApiContext } from "@/utils/context/apiContext";

export const ClusteredMapView = () => {
  const mapRef = useRef<MapView>(null);
  const [clusters, setClusters] = useState<
    (PointFeature<any> | ClusterFeature<any>)[]
  >([]);
  const [region, setRegion] = useState<Region | null>(null);
  const { emergencies } = useApiContext();

  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const superClusterRef = useRef(
    new SuperCluster({ radius: getWidthPercent(6.5), maxZoom: 16 })
  );

  useEffect(() => {
    if (region) {
      const bbox = calculateBBox(region);
      const zoom = returnMapZoom(region, bbox, 1);
      superClusterRef.current.load(emergencies.map(markerToGeoJSONFeature));
      const clusters = superClusterRef.current.getClusters(bbox, zoom);
      setClusters(clusters);
    }
  }, [region, emergencies]);

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        initialRegion={region!}
        onRegionChangeComplete={onRegionChangeComplete}
        style={styles.map}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Moja lokalizacja"
            pinColor={pinColors.USER_LOCATION}
          />
        )}
        {clusters.map((cluster) => (
          <ClusterMarker
            key={cluster.id || cluster.properties.id}
            geometry={cluster.geometry}
            properties={cluster.properties}
            clusterColor={tintColorLight}
            onPress={() => {
              const zoomLevel =
                cluster.id !== undefined
                  ? Math.min(
                      superClusterRef.current.getClusterExpansionZoom(
                        Number(cluster.id)
                      ),
                      16
                    )
                  : 16;

              mapRef.current?.animateToRegion(
                {
                  latitude: cluster.geometry.coordinates[1],
                  longitude: cluster.geometry.coordinates[0],
                  latitudeDelta: region!.latitudeDelta / 2,
                  longitudeDelta: region!.longitudeDelta / 2,
                },
                500
              );
            }}
          />
        ))}
      </MapView>
      <UserLocationButton mapRef={mapRef} userLocation={userLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  locationButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1F41BB",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ClusteredMapView;