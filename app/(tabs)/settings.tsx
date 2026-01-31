import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { theme } from "../../constants/theme";
import { useSubjectsStore } from "../../src/store/useSubjectsStore";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";

export default function SettingsScreen() {
  const resetToDefaults = useSubjectsStore((state) => state.resetToDefaults);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.header}>Settings</Text>

        <CPCard style={styles.card}>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <Text style={styles.cardText}>
            Future features will include account management, AI tuning, and
            cloud sync.
          </Text>
        </CPCard>

        <CPCard style={styles.card}>
          <Text style={styles.cardTitle}>Demo Mode</Text>
          <Text style={styles.cardText}>
            Reset your subjects to the default demo data.
          </Text>
          <CPButton
            title="Reset Demo Data"
            onPress={resetToDefaults}
            variant="secondary"
          />
        </CPCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  card: {
    gap: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  cardText: {
    fontSize: 15,
    color: theme.colors.subtext,
    lineHeight: 22,
  },
});
