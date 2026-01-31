import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";
import { CPProgressBar } from "../../src/ui/components/CPProgressBar";

export default function ResultScreen() {
  const router = useRouter();
  const { total, correct } = useLocalSearchParams();

  const totalNum = parseInt(total as string, 10) || 0;
  const correctNum = parseInt(correct as string, 10) || 0;
  const percentage =
    totalNum > 0 ? Math.round((correctNum / totalNum) * 100) : 0;

  const getEncouragement = () => {
    if (percentage >= 90) return "Clear skies ahead, pilot!";
    if (percentage >= 70) return "Steady progress, keep climbing!";
    if (percentage >= 50) return "Building altitude, stay focused!";
    return "Every flight counts, keep going!";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CPHeader subtitle="Session summary" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <CPCard style={styles.resultCard}>
          <Text style={styles.resultTitle}>Session complete</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{correctNum}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalNum - correctNum}</Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{percentage}%</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
          </View>

          <CPProgressBar
            current={correctNum}
            total={totalNum}
            style={styles.progress}
          />

          <Text style={styles.encouragement}>{getEncouragement()}</Text>
        </CPCard>

        <CPButton
          title="Back to Today"
          onPress={() => router.replace("/(tabs)")}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  resultCard: {
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.xl,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  progress: {
    marginBottom: theme.spacing.xl,
  },
  encouragement: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    marginTop: theme.spacing.md,
  },
});
