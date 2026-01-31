import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { theme } from "../../../constants/theme";

interface CPCardProps extends ViewProps {
  children: React.ReactNode;
}

export function CPCard({ children, style, ...props }: CPCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.card,
  },
});
