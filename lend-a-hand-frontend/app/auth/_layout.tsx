import {Stack} from "expo-router";
import {DarkTheme, DefaultTheme, ThemeProvider,} from "@react-navigation/native";
import {useColorScheme} from "@/hooks/useColorScheme";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    </ThemeProvider>
  );
}
