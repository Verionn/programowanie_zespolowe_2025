import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconMoon } from "@/utils/Icons/iconMoon";
import { iconMoonEnum } from "@/constants/Iconmoon";


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          title: "Log in",
          tabBarIcon: ({ color, focused }) => (
            <IconMoon
              name={focused ? iconMoonEnum.log_in_circle : iconMoonEnum.log_in_circle_outline}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
