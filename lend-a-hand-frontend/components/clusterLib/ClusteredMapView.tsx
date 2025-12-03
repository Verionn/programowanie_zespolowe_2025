import React, {useEffect, useRef, useState} from "react";
import MapView, {Marker, Region} from "react-native-maps";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import SuperCluster, {ClusterFeature, PointFeature} from "supercluster";
import UserLocationButton from "./UserLocationButton";
import {calculateBBox, markerToGeoJSONFeature, returnMapZoom,} from "./mapHelpers";
import {pinColors, tintColorLightVariant} from "@/constants/Colors";
import ClusterMarker from "./ClusterMarker";
import {getWidthPercent} from "@/utils/function/functions";
import {useApiContext} from "@/utils/context/apiContext";
import RefreshMap from "../refreshMap";

export const ClusteredMapView = () => {
  const mapRef = useRef<MapView>(null);
  const [clusters, setClusters] = useState<
    (PointFeature<any> | ClusterFeature<any>)[]
  >([]);
  const [region, setRegion] = useState<Region | null>(null);
  const { filteredEmergencies, location } = useApiContext();
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const superClusterRef = useRef(
    new SuperCluster({ radius: getWidthPercent(6.5), maxZoom: 16 })
  );
  useEffect(() => {
    let text = "Waiting...";
    setLoading(true);
    if (location) {
      text = JSON.stringify(location);
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
      setLoading(false);
    }
    console.log("Got location... ");
  }, [location]);

  useEffect(() => {
    if (region) {
      const bbox = calculateBBox(region);
      const zoom = returnMapZoom(region, bbox, 1);
      superClusterRef.current.load(filteredEmergencies.map(markerToGeoJSONFeature));
      const clusters = superClusterRef.current.getClusters(bbox, zoom);
      setClusters(clusters);
    }
  }, [region, filteredEmergencies]);

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading map...</Text>
    </View>
    );
  }
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
            clusterColor={tintColorLightVariant}
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
      <UserLocationButton mapRef={mapRef} />
      {<RefreshMap />}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", 
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555", 
  },
});

export default ClusteredMapView;
