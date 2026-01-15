import React, {useCallback, useEffect, useRef, useState} from "react";
import MapView, {Marker, Region} from "react-native-maps";
import {ActivityIndicator, Modal, Pressable, StyleSheet, Text, View,} from "react-native";
import SuperCluster, {ClusterFeature, PointFeature} from "supercluster";
import UserLocationButton from "./UserLocationButton";
import {calculateBBox, markerToGeoJSONFeature, returnMapZoom,} from "./mapHelpers";
import {pinColors, tintColorLightVariant} from "@/constants/Colors";
import ClusterMarker from "./ClusterMarker";
import {getWidthPercent, translateEmergencyType} from "@/utils/function/functions";
import {useApiContext} from "@/utils/context/apiContext";
import RefreshMap from "../refreshMap";
import {EmergencyType, EmergencyTypesEnum} from "@/utils/types/types";
import {router, useFocusEffect} from "expo-router";

export const ClusteredMapView = () => {
    const mapRef = useRef<MapView>(null);
    const [clusters, setClusters] = useState<
        (PointFeature<any> | ClusterFeature<any>)[]
    >([]);
    const [region, setRegion] = useState<Region | null>(null);
    const {filteredEmergencies, location} = useApiContext();
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [emergency, setEmergency] = useState<EmergencyType | null>(null);
    const [isMapActive, setIsMapActive] = useState(false);
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const superClusterRef = useRef(
        new SuperCluster({radius: getWidthPercent(6.5), maxZoom: 16})
    );

    const initialRegionRef = useRef<Region | null>(null);

    useEffect(() => {
        if (region && !initialRegionRef.current) {
            initialRegionRef.current = region;
        }
    }, [region]);

    useEffect(() => {
        if (!region || !filteredEmergencies.length) return;

        superClusterRef.current.load(filteredEmergencies.map(markerToGeoJSONFeature));
        const bbox = calculateBBox(region);
        const zoom = returnMapZoom(region, bbox, 1);
        setClusters(superClusterRef.current.getClusters(bbox, zoom));
    }, [region, filteredEmergencies]);



    useFocusEffect(
        useCallback(() => {
            if (!region && userLocation) {
                setRegion({
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });
            }

            setIsMapActive(true);

            return () => {
                setIsMapActive(false);
                setModalVisible(false);
                setEmergency(null);
                setClusters([]);
            };
        }, [userLocation])
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
        if (!isMapActive) return;
        setRegion(newRegion);
    };


    const handleMapLongPressPress = (event: {
        nativeEvent: { coordinate: { latitude: number; longitude: number } };
    }) => {
        const {latitude, longitude} = event.nativeEvent.coordinate;
        router.navigate({
            pathname: "/EmergencyForm",
            params: {lat: latitude, lng: longitude},
        })
    };

    if (!isMapActive || loading || !initialRegionRef.current) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }


    return (
        <View style={{flex: 1}}>
            {isMapActive && (
                <MapView
                    ref={mapRef}
                    initialRegion={initialRegionRef.current!}
                    onRegionChangeComplete={onRegionChangeComplete}
                    style={styles.map}
                    showsUserLocation
                    showsMyLocationButton
                    onLongPress={(e) => handleMapLongPressPress(e)}
                >
                    {userLocation && (
                        <Marker
                            coordinate={userLocation}
                            title="Moja lokalizacja"
                            pinColor={pinColors.USER_LOCATION}
                        />
                    )}

                    {clusters.map((cluster) => {
                        const {geometry, properties} = cluster;
                        if (!geometry.coordinates || geometry.coordinates.length !== 2) {
                            console.log("Invalid cluster coordinates:", cluster);
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
                                    key={`marker-${properties.id}`}
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
            )}

            <UserLocationButton mapRef={mapRef}/>
            <RefreshMap/>

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

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{emergency.title}</Text>

                                <View style={styles.typeBadge}>
                                    <Text style={styles.typeBadgeText}>
                                        {translateEmergencyType(
                                            emergency.type as EmergencyTypesEnum
                                        )}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.modalDescription}>
                                {emergency.description}
                            </Text>

                            <Text style={styles.modalDate}>
                                Data: {new Date(emergency.startDate).toLocaleDateString()}
                            </Text>

                            <Pressable
                                style={styles.primaryButton}
                                onPress={() =>
                                    router.navigate(`/(tabs)/emergency-details/${emergency.id}`)
                                }
                            >
                                <Text style={styles.primaryButtonText}>
                                    Więcej szczegółów
                                </Text>
                            </Pressable>

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
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        width: "85%",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,

        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {width: 0, height: 6},
        elevation: 8,
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        flex: 1,
        marginRight: 8,
    },

    typeBadge: {
        backgroundColor: "#E0F2FE",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },

    typeBadgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#0369A1",
    },

    modalDescription: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
        marginBottom: 14,
    },

    modalDate: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 20,
    },

    primaryButton: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
        width: "100%",
    },

    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
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
        fontSize: 14,
    },
});

export default ClusteredMapView;
