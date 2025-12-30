import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
} from "react-native";
import SuperCluster, { ClusterFeature, PointFeature } from "supercluster";
import UserLocationButton from "./UserLocationButton";
import {
  calculateBBox,
  markerToGeoJSONFeature,
  returnMapZoom,
} from "./mapHelpers";
import { pinColors, tintColorLightVariant } from "@/constants/Colors";
import ClusterMarker from "./ClusterMarker";
import { getWidthPercent } from "@/utils/function/functions";
import { useApiContext } from "@/utils/context/apiContext";
import { translateEmergencyType } from "@/utils/function/functions";
import RefreshMap from "../refreshMap";
import { EmergencyType, EmergencyTypesEnum } from "@/utils/types/types";
import { Link } from "expo-router";

export const ClusteredMapView = () => {
  const mapRef = useRef<MapView>(null);
  const [clusters, setClusters] = useState<
    (PointFeature<any> | ClusterFeature<any>)[]
  >([]);
  const [region, setRegion] = useState<Region | null>(null);
  const { filteredEmergencies, location } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [emergency, setEmergency] = useState<EmergencyType | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const superClusterRef = useRef(
    new SuperCluster({ radius: getWidthPercent(6.5), maxZoom: 16 })
  );

  useEffect(() => {
    setLoading(true);
    if (location) {
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
    } else {
      console.log("No location available yet...");
    }
  }, [location]);

  useEffect(() => {
    if (region) {
      const bbox = calculateBBox(region);
      const zoom = returnMapZoom(region, bbox, 1);
      superClusterRef.current.load(
        filteredEmergencies.map(markerToGeoJSONFeature)
      );
      const clusters = superClusterRef.current.getClusters(bbox, zoom);
      setClusters(clusters);
    } else {
      console.log("Region is not set, skipping cluster generation...");
    }
  }, [region, filteredEmergencies]);

  const ShowEmergencyDetails = (emergency: EmergencyType | null) => {
    if (!emergency) return;
    setEmergency(emergency);
    setModalVisible(true);
  };

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
        showsUserLocation
        showsMyLocationButton
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Moja lokalizacja"
            pinColor={pinColors.USER_LOCATION}
            key="user-location"
          />
        )}

        {clusters.map((cluster, index) => {
          const { geometry, properties } = cluster;
          if (!geometry.coordinates || geometry.coordinates.length !== 2) {
            console.error("Invalid cluster coordinates:", cluster);
            return null;
          }

          const isCluster = properties.cluster;
          if (isCluster) {
            return (
              <ClusterMarker
                key={`cluster-${properties.cluster_id}`}
                geometry={geometry}
                properties={properties}
                clusterColor={tintColorLightVariant}
                onPress={() => {
                  const zoomLevel = Math.min(
                    superClusterRef.current.getClusterExpansionZoom(
                      properties.cluster_id
                    ),
                    16
                  );

                  mapRef.current?.animateToRegion(
                    {
                      latitude: geometry.coordinates[1],
                      longitude: geometry.coordinates[0],
                      latitudeDelta: region!.latitudeDelta / 2,
                      longitudeDelta: region!.longitudeDelta / 2,
                    },
                    500
                  );
                }}
              />
            );
          } else {
            return (
              <Marker
                key={`marker-${index}-${properties.id || properties.title}`}
                coordinate={{
                  latitude: geometry.coordinates[1],
                  longitude: geometry.coordinates[0],
                }}
                onPress={() => ShowEmergencyDetails(properties)}
                title={properties.title}
                description={translateEmergencyType(
                  properties.type as EmergencyTypesEnum
                )}
                pinColor={pinColors[properties.type as EmergencyTypesEnum]}
              />
            );
          }
        })}
      </MapView>
      <UserLocationButton mapRef={mapRef} />
      <RefreshMap />

      {emergency && (
        <Modal
          key={emergency.id}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{emergency.title}</Text>
              <Text style={styles.modalDescription}>
                {`${emergency.description.slice(0, 100)}...`}
              </Text>
              <Text style={styles.modalType}>
                Typ:{" "}
                {translateEmergencyType(emergency.type as EmergencyTypesEnum)}
              </Text>
              <Text style={styles.modalDetail}>
                Data rozpoczęcia:{" "}
                {new Date(emergency.startDate).toLocaleDateString()}
              </Text>
              <View style={styles.viewMoreButton}>
                <Link href={`/(tabs)/emergency-details/${emergency.id}`}>
                  Więcej szczegołów
                </Link>
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>Zamknij</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    textAlign: "justify",
    justifyContent: "flex-start",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  modalType: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalDetail: {
    fontSize: 14,
    marginBottom: 20,
  },
  viewMoreButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  viewMoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "gray",
    alignItems: "center",
    width: "100%",
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ClusteredMapView;
