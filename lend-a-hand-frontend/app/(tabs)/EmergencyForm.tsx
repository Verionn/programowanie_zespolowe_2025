import React, {useRef, useState} from "react";
import {Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {Picker} from "@react-native-picker/picker";
import {faker} from "@faker-js/faker";
import {useApiContext} from "@/utils/context/apiContext";
import {EmergencyTypesWithTranslation} from "@/utils/types/types";
import {ThemedBackground} from "@/components/ThemedBackground";
import {useRouter} from "expo-router";
import MapView, {LatLng, Marker} from "react-native-maps";
import * as Location from "expo-location";

export default function AddEmergencyForm() {
    const {addEmergency} = useApiContext();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");
    const [dateTime, setDateTime] = useState(new Date());
    const [markerLocation, setMarkerLocation] = useState<LatLng | null>(null);

    const router = useRouter();
    const mapViewRef = useRef<MapView | null>(null);

    function navigateWithAnimation(lat: number, lng: number) {
        mapViewRef.current?.animateToRegion(
            {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.0015,
                longitudeDelta: 0.00121,
            },
            1000
        );
    }

    async function setMarkerToUserLocation() {
        try {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Błąd", "Nie uzyskano dostępu do lokalizacji.");
                return;
            }

            const userLocation = await Location.getCurrentPositionAsync({});
            const userCoords: LatLng = {
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
            };

            setMarkerLocation(userCoords);
            setLatitude(userCoords.latitude.toString());
            setLongitude(userCoords.longitude.toString());
            navigateWithAnimation(userCoords.latitude, userCoords.longitude);
        } catch (error) {
            console.error("Error getting user location:", error);
            Alert.alert("Błąd", "Nie udało się uzyskać lokalizacji.");
        }
    }

    const handleMapLongPressPress = (event: {
        nativeEvent: { coordinate: { latitude: number; longitude: number } };
    }) => {
        const {latitude, longitude} = event.nativeEvent.coordinate;
        setMarkerLocation({latitude, longitude});
        setLatitude(latitude.toString());
        setLongitude(longitude.toString());
    };

    const handleSubmit = async () => {
        const missingFields = [];
        if (!title) missingFields.push("Tytuł");
        if (!description) missingFields.push("Opis");
        if (!latitude) missingFields.push("Szerokość geograficzna");
        if (!longitude) missingFields.push("Długość geograficzna");

        if (missingFields.length > 0) {
            Alert.alert(
                "Błąd",
                `Proszę wypełnić brakujące pola: ${missingFields.join(", ")}.`
            );
            return;
        }

        const newEmergency = {
            id: faker.string.uuid(),
            title,
            description,
            type,
            status: false,
            userId: faker.string.uuid(),
            latitude: parseFloat(latitude).toFixed(6),
            longitude: parseFloat(longitude).toFixed(6),
            startDate: dateTime,
        };

        console.log("Wysyłanie:", newEmergency);

        try {
            await addEmergency(newEmergency);
            Alert.alert("Sukces", "Zdarzenie dodane pomyślnie!");
            router.navigate({
                pathname: "/HomeScreen",
            });
        } catch (error) {
            Alert.alert("Błąd", "Nie udało się dodać zdarzenia.");
            console.error("Error in API request:", error);
        }
    };

    return (
        <ThemedBackground style={{flex: 1}}>
            <ScrollView style={styles.container} keyboardShouldPersistTaps={"handled"}>
                <View style={styles.container}>
                    <Text style={styles.label}>Tytuł</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Wpisz tytuł"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>


                <View style={styles.container}>
                    <Text style={styles.label}>Opis</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Wpisz opis"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.container}>
                    <Text style={styles.label}>Typ</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={type}
                            onValueChange={(value) => setType(value)}
                            style={{maxHeight: 50, minHeight: 50}}
                        >
                            {EmergencyTypesWithTranslation.map((option) => (
                                <Picker.Item
                                    key={option.value}
                                    label={option.label}
                                    value={option.value}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapViewRef}
                        style={{flex: 1}}
                        initialRegion={{
                            latitude: 51.7592,
                            longitude: 19.456,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        onLongPress={(e) => handleMapLongPressPress(e)}
                    >
                        {markerLocation && (
                            <Marker
                                coordinate={markerLocation}
                                title="Twoja lokalizacja"
                                description="Twoja lokalizacja"
                            />
                        )}
                    </MapView>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Ustaw moją lokalizację"
                        onPress={setMarkerToUserLocation}
                    />
                </View>

                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    <ThemedText style={styles.buttonText}>Dodaj</ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: "5%",
        paddingBottom: "5%",
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderColor: "#ddd",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
        justifyContent: "center",
        minHeight: 50,
    },
    pickerContainer: {
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: "center",
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: "#1F41BB",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 50,
        borderRadius: 5,
        marginVertical: 20,
    },
    buttonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
    },
    mapContainer: {
        flex: 1,
        marginVertical: "5%",
        minWidth: 350,
        minHeight: 400,
        alignSelf: "center",
    },
    buttonContainer: {
        marginHorizontal: "5%",
        marginBottom: "10%",
        alignSelf: "center",
    },
});