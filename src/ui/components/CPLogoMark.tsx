import React from "react";
import { Image, StyleSheet } from "react-native";

interface CPLogoMarkProps {
  size?: number;
}

export function CPLogoMark({ size = 22 }: CPLogoMarkProps) {
  return (
    <Image
      source={require("../../../assets/brand/logo.png")}
      style={[styles.logo, { width: size, height: size }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    // No additional styles needed
  },
});
