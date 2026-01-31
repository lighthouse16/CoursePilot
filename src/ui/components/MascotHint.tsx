import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../../constants/theme";

interface MascotHintProps {
  hint: string;
}

export function MascotHint({ hint }: MascotHintProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="paper-plane-outline"
          size={16}
          color={theme.colors.primary}
        />
      </View>
      <Text style={styles.text}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.subtext,
    lineHeight: 20,
  },
});
