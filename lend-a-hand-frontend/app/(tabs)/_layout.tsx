import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconMoon } from "@/utils/Icons/iconMoon";
import { iconMoonEnum } from "@/constants/Iconmoon";
import Icon from "react-native-vector-icons/MaterialIcons";

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
        name="EmergencyForm"
        options={{
          title: "Dodaj krisis",
          headerShown:true,
          tabBarIcon: ({ color, focused }) => (
            <Icon name="add-circle" color={color} size={focused ? 28 : 24} />
          ),
        }}
      />

      <Tabs.Screen
        name="auth"
        options={{
          title: "Zaloguj się",
          tabBarIcon: ({ color, focused }) => (
            <IconMoon
              name={
                focused
                  ? iconMoonEnum.log_in_circle
                  : iconMoonEnum.log_in_circle_outline
              }
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="emergency-details/[id]"
        options={{
          headerShown: true,
          title: "Szczegółów wydarzenia kryzysowego",
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
