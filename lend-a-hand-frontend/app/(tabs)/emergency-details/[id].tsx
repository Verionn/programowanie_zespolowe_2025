import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View,} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {ApiService} from "@/utils/api/CRUD";
import {getEndpoint, token} from "@/constants/variables";
import Icon from "react-native-vector-icons/MaterialIcons";
import {getSecureItem, getToken, translateEmergencyType,} from "@/utils/function/functions";
import {tintColorLight} from "@/constants/Colors";
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemedText} from "@/components/ThemedText";
import {ThemedBackground} from "@/components/ThemedBackground";
import {checkVolunteeringStatus, handleVolunteering,} from "@/utils/api/volunteer";
import {EmergencyType} from "@/utils/types/types";
import MapView, {LatLng, Marker} from "react-native-maps";

export default function EmergencyDetailsScreen() {
    const {id} = useLocalSearchParams();
    const [emergency, setEmergency] = useState<any | null>(null);
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState<number>(0);
    const mapViewRef = useRef<MapView | null>(null);
    const [markerLocation, setMarkerLocation] = useState<LatLng | null>(null);


    const iconSize = 30;

    useEffect(() => {
        const fetchEmergencyDetails = async () => {
            try {
                console.log("Starting fetchEmergencyDetails...");
                const gotToken = await getToken(token);
                if (!gotToken) throw new Error("No valid token found");

                const endpoint = await getEndpoint();
                console.log("Endpoint:", endpoint);

                const response = await ApiService.get<{ emergency: EmergencyType }>(
                    `${endpoint}/emergencies/${id}`,
                    {Authorization: `Bearer ${gotToken}`}
                );

                console.log("Fetched emergency:", response.data);
                setEmergency(response.data);
                setMarkerLocation({
                    latitude: response.data.latitude,
                    longitude: response.data.longitude,
                });
            } catch (error) {
                console.error("Error fetching emergency details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEmergencyDetails();
        }
    }, [id, reloadTrigger]);

    useEffect(() => {
        const fetchEmergencyStatus = async () => {
            if (token) {
                const localToken = await getSecureItem(token);
                if (!localToken || localToken === null) {
                    throw new Error("Invalid token or missing userId");
                }
                const isThere = await checkVolunteeringStatus(emergency.id);
                setIsJoined(isThere);
            }
        };

        if (emergency && token) {
            fetchEmergencyStatus();
        }
    }, [emergency, reloadTrigger]);

    useEffect(() => {
        if (markerLocation && mapViewRef.current) {
            mapViewRef.current.animateToRegion(
                {
                    latitude: markerLocation.latitude,
                    longitude: markerLocation.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.01,
                },
                500
            );
        }
    }, [markerLocation]);


    const handleTaskAction = async () => {
        try {
            await handleVolunteering(emergency.id, !isJoined);
            setReloadTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Error performing task action:", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color={tintColorLight}/>;
    }

    if (!emergency) {
        return <Text style={styles.noDataText}>Brak szczegółów zdarzenia.</Text>;
    }

    return (
        <ThemedBackground style={{flex: 1}} isSafeAreaNeeded={false}>
          <ScrollView style={styles.container} keyboardShouldPersistTaps={"handled"}>
            <SafeAreaView>

                    <Text style={styles.title}>{emergency.title}</Text>
                    <Text style={styles.description}>{emergency.description}</Text>

                    <View style={styles.detailRow}>
                        <Icon name="category" size={iconSize} color={tintColorLight}/>
                        <Text style={styles.detail}>
                            Typ: {translateEmergencyType(emergency.type)}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Icon
                            name="account-circle"
                            size={iconSize}
                            color={tintColorLight}
                        />
                        <Text style={styles.detail}>
                            szukający pomocy: Patryk Lewandoski
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Icon
                            name="toggle-on"
                            size={iconSize}
                            color={emergency.status ? "green" : "red"}
                        />
                        <Text style={styles.detail}>
                            Status: {emergency.status ? "Wykonane" : "Niewykonane"}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Icon name="location-on" size={iconSize} color={tintColorLight}/>
                        <Text style={styles.detail}>
                            Lokalizacja: {emergency.latitude.toFixed(4)},{" "}
                            {emergency.longitude.toFixed(4)}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Icon name="event" size={iconSize} color={tintColorLight}/>
                        <Text style={styles.detail}>
                            Data rozpoczęcia:{" "}
                            {new Date(emergency.startDate).toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={styles.mapContainer}>
                        <MapView
                            ref={mapViewRef}
                            style={{flex: 1}}
                            initialRegion={{
                                latitude: emergency.latitude,
                                longitude: emergency.longitude,
                                latitudeDelta: 0.03,
                                longitudeDelta: 0.01,
                            }}
                        >
                            {markerLocation && (
                                <Marker coordinate={markerLocation} />
                            )}
                        </MapView>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={{
                                backgroundColor: isJoined ? "red" : "#1F41BB",
                                ...styles.button,
                            }}
                            onPress={handleTaskAction}
                        >
                            <ThemedText style={styles.text}>
                                {!isJoined ? "Przyjmij Zadanie" : "Rezygnuj Zadanie"}
                            </ThemedText>
                        </Pressable>
                    </View>

            </SafeAreaView>
          </ScrollView>
        </ThemedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: "5%",
        paddingBottom: "10%",
        paddingTop: "5%",
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        margin: 10,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: tintColorLight,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#333",
        marginBottom: 20,
        lineHeight: 22,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        paddingLeft: 8,
    },
    detail: {
        fontSize: 16,
        color: "#555",
        marginLeft: 10,
    },
    noDataText: {
        fontSize: 18,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
    button: {
        textAlign: "center",
        alignItems: "center",
        color: "white",
        display: "flex",
        justifyContent: "center",
        height: 50,
        borderRadius: 5,
        width: "70%",
    },
    text: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
    },
    buttonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10%",
    },
    mapContainer: {
        flex: 1,
        marginVertical: "5%",
        minWidth: 350,
        minHeight: 400,
        alignSelf: "center",
    },
});
