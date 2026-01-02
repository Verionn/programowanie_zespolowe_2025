import React from "react";
import {Pressable, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView from "react-native-maps";
import {useApiContext} from "@/utils/context/apiContext";

interface UserLocationButtonProps {
  mapRef: React.RefObject<MapView>;
}

const UserLocationButton: React.FC<UserLocationButtonProps> = ({ mapRef }) => {
  const { location } = useApiContext();
  const goToCurrentLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
      }, 1000);
    }
  };

  return (
    <Pressable style={styles.locationButton} onPress={goToCurrentLocation}>
      <Icon name="my-location" size={24} color="#FFF" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    position: "absolute",
    bottom: 60,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1F41BB",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UserLocationButton;
