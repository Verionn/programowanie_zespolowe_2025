import {Stack} from "expo-router";
import {DarkTheme, DefaultTheme, ThemeProvider,} from "@react-navigation/native";
import {useColorScheme} from "@/hooks/useColorScheme";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack >
        <Stack.Screen name="login" options={{headerShown:false}}/>
        <Stack.Screen name="register" options={{headerShown:false}}/>
      </Stack>
    </ThemeProvider>
  );
}
