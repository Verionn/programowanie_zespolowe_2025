import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import React, { useState } from "react";
import { TextInput, StyleSheet, View, Pressable, Text } from "react-native";
import { ThemedBackground } from "@/components/ThemedBackground";
import { getHeightPercent, getWidthPercent } from "@/utils/function/functions";
import loginUser from "@/utils/api/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if (!email || !password || email === "" || password === "") {
      alert("Please enter a valid email and password");
    } else {
      await loginUser(email, password);
    }
  };

  return (
      <ThemedBackground style={styles.background}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Zaloguj się</Text>
            <ThemedText style={styles.subtitle}>Witaj ponownie!</ThemedText>
          </View>
          <ThemedView style={styles.formContainer}>
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
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#aaa"
            />

            <Pressable style={styles.login} onPress={handleLogin}>
              <ThemedText style={styles.loginText}>Zaloguj się</ThemedText>
            </Pressable>
            <ThemedText style={styles.registerContainer}>
              <Link href={"/(tabs)/auth/register"}>Utwórz nowe konto</Link>
            </ThemedText>
          </ThemedView>
        </View>
      </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: getWidthPercent(2),
    paddingTop: getHeightPercent(10),
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: getHeightPercent(30),
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
  login: {
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
