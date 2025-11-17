import { Href } from "expo-router";

export type RegionType = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };

export type ItemNavigationType = {
  name: string;
  goTo: Href;
};