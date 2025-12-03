import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ApiService } from "@/utils/api/CRUD";
import { getEndpoint } from "@/constants/variables";
import Icon from "react-native-vector-icons/MaterialIcons";
import { translateEmergencyType } from "@/utils/function/functions";
import { tintColorLight } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedBackground } from "@/components/ThemedBackground";
export default function EmergencyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [emergency, setEmergency] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const iconSize = 30;
  useEffect(() => {
    const fetchEmergencyDetails = async () => {
      try {
        const response = await ApiService.get<{ emergency: any }>(
          `${await getEndpoint()}emergencies/${id}`
        );
        setEmergency(response);
      } catch (error) {
        console.error("Błąd podczas pobierania szczegółów zdarzenia:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmergencyDetails();
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color={tintColorLight} />;
  }

  if (!emergency) {
    return <Text style={styles.noDataText}>Brak szczegółów zdarzenia.</Text>;
  }

  return (
    <ThemedBackground style={{ flex: 1 }} isSafeAreaNeeded={false}>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>{emergency.title}</Text>
          <Text style={styles.description}>{emergency.description}</Text>

          <View style={styles.detailRow}>
            <Icon name="category" size={iconSize} color={tintColorLight} />
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
            <Icon name="location-on" size={iconSize} color={tintColorLight} />
            <Text style={styles.detail}>
              Lokalizacja: {emergency.latitude.toFixed(4)},{" "}
              {emergency.longitude.toFixed(4)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="event" size={iconSize} color={tintColorLight} />
            <Text style={styles.detail}>
              Data rozpoczęcia:{" "}
              {new Date(emergency.startDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button}>
            <ThemedText style={styles.text}>Przyjmij Zadanie</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    backgroundColor: "#1F41BB",
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
  },
});
