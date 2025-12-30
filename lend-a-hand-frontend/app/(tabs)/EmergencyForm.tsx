import React, {useState} from "react";
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {Picker} from "@react-native-picker/picker";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {faker} from "@faker-js/faker";
import {useApiContext} from "@/utils/context/apiContext";
import {EmergencyTypesWithTranslation} from "@/utils/types/types";
import {ThemedBackground} from "@/components/ThemedBackground";
import {useRouter} from "expo-router";

export default function AddEmergencyForm() {
    const {addEmergency} = useApiContext();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [dateTime, setDateTime] = useState<any>(new Date());

    const router = useRouter();

    const handleValueChange = (itemValue: string) => {
        setType(itemValue);
    };

    const openDateTimePicker = (mode: "date" | "time", display: "calendar" | "clock") => {
        DateTimePickerAndroid.open({
            value: dateTime,
            onChange: (event, selectedDate) => {
                if (selectedDate) {
                    setDateTime((prev: string | number | Date) => {
                        if (mode === "date") {
                            const newDate = new Date(prev);
                            newDate.setFullYear(selectedDate.getFullYear());
                            newDate.setMonth(selectedDate.getMonth());
                            newDate.setDate(selectedDate.getDate());
                            openDateTimePicker("time", "clock");
                            return newDate;
                        } else {
                            const newDate = new Date(prev);
                            newDate.setHours(selectedDate.getHours());
                            newDate.setMinutes(selectedDate.getMinutes());
                            return newDate;
                        }
                    });
                }
            },
            mode: mode,
            display: display,
        });
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
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            startDate: dateTime,
        };

        console.log("Wysyłanie:", newEmergency);

        try {
            await addEmergency(newEmergency);
            Alert.alert("Sukces", "Zdarzenie dodane pomyślnie!");


        } catch (error) {
            Alert.alert("Błąd", "Nie udało się dodać zdarzenia.");
            console.error("Error in API request:", error);
        }
    };

    return (
        <ThemedBackground style={{flex: 1}}>
            <ScrollView style={styles.container} keyboardShouldPersistTaps={"handled"}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Tytuł</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Wpisz tytuł"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Opis</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Wpisz opis"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Typ</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={type}
                            onValueChange={handleValueChange}
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

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Szerokość geograficzna</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Wpisz szerokość geograficzną"
                        value={latitude}
                        onChangeText={setLatitude}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Długość geograficzna</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Wpisz długość geograficzną"
                        value={longitude}
                        onChangeText={setLongitude}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Data i godzina rozpoczęcia</Text>
                    <Pressable
                        onPress={() => openDateTimePicker("date", "calendar")}
                        style={styles.input}
                    >
                        <Text>
                            {dateTime
                                ? `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`
                                : "Wybierz datę i godzinę"}
                        </Text>
                    </Pressable>
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
    inputContainer: {
        minHeight: 80,
    }
});