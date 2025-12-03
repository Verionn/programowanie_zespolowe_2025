import React, {useState} from "react";
import {Alert, Pressable, StyleSheet, Text, TextInput, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemedText} from "@/components/ThemedText";
import {Picker} from "@react-native-picker/picker";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {faker} from "@faker-js/faker";
import {useApiContext} from "@/utils/context/apiContext";
import {EmergencyTypesWithTranslation} from "@/utils/types/types";

export default function AddEmergencyForm() {
    const {addEmergency} = useApiContext();
    const [title, setTitle] = useState("Przykładowe wydarzenie kryzysowe");
    const [description, setDescription] = useState("Opis wydarzenia");
    const [type, setType] = useState("CLEANUP_ASSISTANCE");
    const [latitude, setLatitude] = useState("51.0");
    const [longitude, setLongitude] = useState("19.0");
    const [dateTime, setDateTime] = useState(new Date());

    const handleValueChange = (itemValue: string) => {
        setType(itemValue);
    };

    const openDateTimePicker = (mode: any, display: any) => {
        DateTimePickerAndroid.open({
            value: dateTime,
            onChange: (event, selectedDate) => {
                if (selectedDate) {
                    setDateTime(selectedDate);
                    if (mode === 'date') {
                        openDateTimePicker('time', 'clock');
                    }
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

    const formatDateTime = (date: Date) => {
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <Text style={styles.label}>Tytuł</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Wpisz tytuł"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Opis</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Wpisz opis"
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={styles.label}>Typ</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue) => handleValueChange(itemValue)}
                        mode="dropdown"
                    >
                        {EmergencyTypesWithTranslation.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value}/>
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Szerokość geograficzna</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Wpisz szerokość geograficzną"
                    value={latitude}
                    onChangeText={setLatitude}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Długość geograficzna</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Wpisz długość geograficzną"
                    value={longitude}
                    onChangeText={setLongitude}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Data i godzina rozpoczęcia</Text>
                <Pressable onPress={() => openDateTimePicker("date", "calendar")} style={styles.input}>
                    <Text>{formatDateTime(dateTime)}</Text>
                </Pressable>

                <Pressable onPress={handleSubmit} style={styles.submitButton}>
                    <ThemedText style={styles.buttonText}>Dodaj</ThemedText>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    label: {
        fontSize: 12,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: "#ddd",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
        justifyContent: "center",
    },
    pickerContainer: {
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 4,
        marginBottom: 12,
        height: 50,
    },

    submitButton: {
        backgroundColor: "#1F41BB",
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
    },
});
