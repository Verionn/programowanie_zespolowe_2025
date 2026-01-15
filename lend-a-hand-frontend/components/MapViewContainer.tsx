import {useUserContext} from "@/hooks/useUserContext";
import {
    EmergencyType,
    EmergencyTypeEnum,
    RegionType,
} from "@/utils/types/types";
import React, {useEffect, useRef, useState} from "react";
import {View, StyleSheet, Text, Pressable} from "react-native";
import MapView, {Callout, Marker, Region} from "react-native-maps";

import * as Location from "expo-location";
import {ApiService} from "@/utils/api/CRUD";
import {getEndpoint} from "@/constants/variables";
import {pinColors, tintColorLight} from "@/constants/Colors";
import {translateEmergencyType} from "@/utils/function/functions";
import {useRouter} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

export const MapViewContainer = () => {
    const mapRef = useRef<MapView>(null);

    const [region, setRegion] = useState<RegionType | null>(null);
    const {location, setLocation} = useUserContext();
    const [emergencies, setEmergencies] = useState<EmergencyType[]>([]);
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchDataAndLocation = async () => {
            try {
                const response = await ApiService.get<{ emergencies: EmergencyType[] }>(
                    `${await getEndpoint()}emergencies`
                );
                setEmergencies(response.emergencies);

                let {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    console.log("Permission to access location was denied");
                    return;
                }

                let loc = await Location.getCurrentPositionAsync({});
                setLocation(JSON.stringify(loc));

        const { latitude, longitude } = loc.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
        setUserLocation({ latitude, longitude });
      } catch (error) {
        console.log("Error fetching data or location:");
      }
    };

        fetchDataAndLocation();
    }, []);

    const onRegionChange = (newRegion: Region) => {
        setRegion(newRegion);
    };

    const animateToRegion = async () => {
        if (userLocation && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    ...userLocation,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                1000
            );
        }
    };
    return (
        <View style={{flex: 1}}>
            {region ? (
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        initialRegion={region}
                        style={{flex: 1}}
                        onRegionChange={onRegionChange}
                    >
                        {userLocation && (
                            <Marker
                                coordinate={userLocation}
                                title="Your Location"
                                pinColor={pinColors.USER_LOCATION}
                            />
                        )}

                        {emergencies.map((emergency) => (
                            <Marker
                                key={emergency.id}
                                coordinate={{
                                    latitude: emergency.latitude,
                                    longitude: emergency.longitude,
                                }}
                                pinColor={pinColors[emergency.type as EmergencyTypeEnum]}
                            >
                                <Callout
                                    tooltip
                                    onPress={() =>
                                        router.navigate({
                                            pathname: "/(tabs)/emergency-details/[id]",
                                            params: {id: emergency.id},
                                        })
                                    }
                                >
                                    <View style={styles.calloutContainer}>
                                        <Text style={styles.calloutTitle}>{emergency.title}</Text>
                                        <Text style={styles.calloutDescription}>
                                            {`${emergency.description.slice(0, 20)}...`}
                                        </Text>
                                        <Text style={styles.calloutType}>
                                            Typ: {" "}
                                            {translateEmergencyType(
                                                emergency.type as EmergencyTypeEnum
                                            )}
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
                        ))}
                    </MapView>

                    <Pressable style={styles.locationButton} onPress={animateToRegion}>
                        <Icon name="my-location" size={24} color="#FFF"/>
                    </Pressable>
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
        zIndex: 1,
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
    detail: {fontSize: 14, color: "#555", marginBottom: 5},
    locationButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: tintColorLight,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
});
