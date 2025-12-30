import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import React, {useState} from "react";
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View,} from "react-native";
import {ThemedBackground} from "@/components/ThemedBackground";
import {Link, useRouter} from "expo-router";
import {getHeightPercent, getWidthPercent} from "@/utils/function/functions";
import {registerUser} from "@/utils/api/auth";
import {HTTP_STATUS_CREATED} from "@/constants/variables";

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const router = useRouter();


    const handleRegister = async () => {
        if (!firstName || firstName === "") alert("Wpisz poprawne Imię!");
        else if (!lastName || lastName === "") alert("Wpisz poprawne Nazwisko!");
        else if (!email || email === "") alert("Wpisz poprawny email!");
        else if (!password || password === "") alert("Wpisz poprawne hasło!");
        else if (!confirmPassword || confirmPassword === "") alert("Wpisz poprawne hasło!");
        else if (!phoneNumber || phoneNumber === "") alert("Wpisz poprawny numer telefonu");
        else if (password !== confirmPassword) alert("Hasła muszą być takie same");
        else {
            const res = await registerUser(firstName, lastName, email, password, phoneNumber);
            console.log(res);
            if (res === HTTP_STATUS_CREATED) {
                alert("Rejestracja przebiegła pomyślnie");
                router.push({
                    pathname: "/(tabs)/auth/login"
                });
            } else alert("Niepoprawne wartości!");

        }
    };

    return (
        <ThemedBackground style={styles.background}>
            <ScrollView style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Stwórz konto</Text>
                        <ThemedText style={styles.subtitle}>Stwórz konto pomagać innym!</ThemedText>
                    </View>
                    <ThemedView style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Imię"
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#aaa"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Nazwisko"
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#aaa"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Hasło"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#aaa"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder=" Potwierdż Hasło"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#aaa"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#aaa"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Numer telefonu"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#aaa"
                        />
                        <Pressable style={styles.button} onPress={handleRegister}>
                            <ThemedText style={styles.loginText}>Zarejestruj się</ThemedText>
                        </Pressable>
                        <ThemedText style={styles.registerContainer}>
                            <Link href={"/(tabs)/auth/login"}>Posiadam już konto</Link>
                        </ThemedText>
                    </ThemedView>
                </View>
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
    background: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: getWidthPercent(2),
        paddingTop: getHeightPercent(5)
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: getHeightPercent(2),
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: getHeightPercent(5),
        gap: 10,
        textAlign: "center",
    },
    formContainer: {
        backgroundColor: "white",
        padding: getHeightPercent(8),
        display: "flex",
        justifyContent: "center",
        width: "100%",
    },
    input: {
        height: 50,
        borderColor: "#F1F4FF",
        borderWidth: 1,
        marginBottom: getHeightPercent(5),
        paddingHorizontal: getWidthPercent(1),
        borderRadius: 5,
        backgroundColor: "#F1F4FF",
    },
    button: {
        backgroundColor: "#1F41BB",
        textAlign: "center",
        alignItems: "center",
        color: "white",
        display: "flex",
        justifyContent: "center",
        height: 50,
        borderRadius: 5,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#1F41BB",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    subtitle: {
        fontSize: 18,
        color: "#000",
    },

    loginText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
    },
    registerContainer: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        alignItems: "center",
        textAlign: "center",
        paddingTop: getHeightPercent(10),
        fontWeight: "bold",
    },
});
