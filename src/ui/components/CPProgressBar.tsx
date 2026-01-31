import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { theme } from "../../../constants/theme";

interface CPProgressBarProps {
  value?: number;
  current?: number;
  total?: number;
  style?: StyleProp<ViewStyle>;
}

export function CPProgressBar({
  value,
  current,
  total,
  style,
}: CPProgressBarProps) {
  let clampedValue = 0;
  if (value !== undefined) {
    clampedValue = Math.max(0, Math.min(1, value));
  } else if (current !== undefined && total !== undefined && total > 0) {
    clampedValue = Math.max(0, Math.min(1, current / total));
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.fill, { width: `${clampedValue * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
  },
});
