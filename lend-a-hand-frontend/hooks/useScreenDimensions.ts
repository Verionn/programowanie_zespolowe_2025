import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

export function useScreenDimensionsWidth(percent: number) {
  const [widthPercent, setWidthPercent] = useState(
    Dimensions.get("window").width * (percent / 100)
  );

  useEffect(() => {
    const updateDimensions = () => {
      const width = Dimensions.get("window").width;
      setWidthPercent(width * (percent / 100));
    };
    const subscription = Dimensions.addEventListener(
      "change",
      updateDimensions
    );
    return () => subscription.remove();
  }, [percent]);

  return widthPercent;
}

export function useScreenDimensionsHeight(percent: number) {
  const [heightPercent, setHeightPercent] = useState(
    Dimensions.get("window").height * (percent / 100)
  );

  useEffect(() => {
    const updateDimensions = () => {
      const height = Dimensions.get("window").height;
      setHeightPercent(height * (percent / 100));
    };
    const subscription = Dimensions.addEventListener(
      "change",
      updateDimensions
    );
    return () => subscription.remove();
  }, [percent]);

  return heightPercent;
}
