import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../../constants/theme";
import { CPLogoMark } from "./CPLogoMark";
import { GradientText } from "./GradientText";

interface CPHeaderProps {
  title?: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export function CPHeader({
  title = "CoursePilot",
  subtitle,
  rightSlot,
}: CPHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.titleRow}>
            <CPLogoMark size={28} />
            {title === "CoursePilot" ? (
              <GradientText style={styles.title}>{title}</GradientText>
            ) : (
              <Text style={styles.title}>{title}</Text>
            )}
          </View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightSlot && <View style={styles.rightSection}>{rightSlot}</View>}
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  leftSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  rightSection: {
    marginLeft: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginLeft: 36,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});
