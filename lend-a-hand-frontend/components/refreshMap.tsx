import React, {useEffect, useRef, useState} from "react";
import {Animated, Pressable, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useApiContext} from "@/utils/context/apiContext";

const RefreshMap = () => {
  const { fetchEmergencies } = useApiContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const startSpinning = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSpinning = () => {
    spinValue.stopAnimation(() => spinValue.setValue(0));
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    startSpinning();
    await fetchEmergencies();
    stopSpinning();
    setIsRefreshing(false);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    fetchEmergencies();
  }, [fetchEmergencies]);

  return (
    <Pressable style={styles.locationButton} onPress={handleRefresh}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Icon name="refresh" size={24} color="#FFF" />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1F41BB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export default RefreshMap;
