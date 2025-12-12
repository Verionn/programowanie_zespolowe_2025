import {EmergencyTypesWithTranslationEnum} from "@/utils/types/types";
import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useApiContext} from "@/utils/context/apiContext";

type TabNavigationType = {
    item: EmergencyTypesWithTranslationEnum;
};

export const ButtonNavigation: React.FC<TabNavigationType> = ({item}) => {
    const {selectedCategories, setSelectedCategories} = useApiContext();

    const isActive = selectedCategories.includes(item.value);

    const handlePress = () => {
        setSelectedCategories((prev) => {
            if (prev.includes(item.value)) {
                return prev.filter((cat => cat !== item.value))
            } else {
                return [...prev, item.value]
            }
        })
    };

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handlePress}
                style={[
                    styles.button,
                    {backgroundColor: isActive || selectedCategories.length === 0 ? "#FFFFFF" : "transparent"},
                    {borderColor: isActive || selectedCategories.length === 0 ? "#FFFFFF" : "#000000"},
                ]}
            >
                <Text
                    style={[
                        styles.buttonText,
                        {color: isActive || selectedCategories.length === 0 ? "#000000" : "#000000"},
                    ]}
                >
                    {item.label}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginHorizontal: 10,
    },
    button: {
        backgroundColor: "transparent",
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        borderWidth: 2,
    },
    buttonText: {
        color: "#000000",
        fontSize: 20,
    },
});
