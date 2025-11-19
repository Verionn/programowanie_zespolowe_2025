import GeoViewport from "@mapbox/geo-viewport";
import { Dimensions } from "react-native";
import { Region } from "react-native-maps";
import { PointFeature } from "supercluster";

const { width, height } = Dimensions.get("window");

export type BoundingBox = [number, number, number, number];

export const calculateBBox = (region: Region): BoundingBox => {
  const lngD =
    region.longitudeDelta < 0
      ? region.longitudeDelta + 360
      : region.longitudeDelta;
  return [
    region.longitude - lngD,
    region.latitude - region.latitudeDelta,
    region.longitude + lngD,
    region.latitude + region.latitudeDelta,
  ];
};

export const returnMapZoom = (
  region: Region,
  bBox: BoundingBox,
  minZoom: number
) => {
  const viewport =
    region.longitudeDelta >= 40
      ? { zoom: minZoom }
      : GeoViewport.viewport(bBox, [width, height]);

  return viewport.zoom;
};

export const markerToGeoJSONFeature = (marker: any): PointFeature<any> => {
  return {
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [marker.longitude, marker.latitude],
    },
    properties: {
      point_count: 0,
      id: marker.id,
      ...marker,
    },
  };
};
