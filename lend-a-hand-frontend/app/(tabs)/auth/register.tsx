import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import React, {useState} from "react";
import {Pressable, StyleSheet, Text, TextInput, View,} from "react-native";
import {ThemedBackground} from "@/components/ThemedBackground";
import {Link} from "expo-router";
import {getHeightPercent, getWidthPercent} from "@/utils/function/functions";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male"); // Default value
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleRegister = () => {
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Gender:", gender);
    console.log("Age:", age);
    console.log("Username:", username);
  };

  return (
    <ThemedBackground style={styles.background}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Stwórz konto</Text>
          <ThemedText style={styles.subtitle}>Stwórz konto pomagać innym!</ThemedText>
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
            placeholder="imię"
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
          <Pressable style={styles.button} onPress={handleRegister}>
            <ThemedText style={styles.loginText}>Zaloguj się</ThemedText>
          </Pressable>
          <ThemedText style={styles.registerContainer}>
            <Link href={"/(tabs)/auth/login"}>Posiadam już konto</Link>
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
    paddingTop:getHeightPercent(10)
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
