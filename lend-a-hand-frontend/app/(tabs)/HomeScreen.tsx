import {FlatList, StyleSheet, View} from "react-native";
import React from "react";
import {ThemedBackground} from "@/components/ThemedBackground";
import {ButtonNavigation} from "@/components/ButtonNavigation";
import {getHeightPercent} from "@/utils/function/functions";
import ClusteredMapView from "@/components/clusterLib/ClusteredMapView";
import {EmergencyTypesWithTranslation} from "@/utils/types/types";

export default function HomeScreen() {

    return (
        <ThemedBackground style={{flex: 1}} isSafeAreaNeeded={false}>
            <View style={styles.stepContainer}>
                <FlatList
                    data={EmergencyTypesWithTranslation}
                    renderItem={({item}) => <ButtonNavigation item={item}/>}
                    keyExtractor={(item) => item.label}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.flatListContainer,
                        {paddingBottom: 50},
                    ]}
                    style={styles.flatList}
                />
                <ClusteredMapView/>
            </View>
        </ThemedBackground>
    );
}

const styles = StyleSheet.create({
    stepContainer: {
        flex: 1,
        position: "relative",
    },
    flatListContainer: {
        paddingHorizontal: 10,
        marginTop: getHeightPercent(5),
    },
    flatList: {
        position: "absolute",
        top: getHeightPercent(10),
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 100,
        display: "flex",
    },
});
