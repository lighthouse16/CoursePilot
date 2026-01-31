import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";

export default function TodayScreen() {
  const router = useRouter();
  const init = useAppStore((state) => state.init);
  const loading = useAppStore((state) => state.loading);
  const initialized = useAppStore((state) => state.initialized);
  const getTodayQueue = useAppStore((state) => state.getTodayQueue);
  const courses = useAppStore((state) => state.courses);
  const reviewItems = useAppStore((state) => state.reviewItems);

  useEffect(() => {
    init();
  }, [init]);

  if (loading || !initialized) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CPHeader subtitle="Today's mission" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your mission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dueItems = getTodayQueue();
  const estimatedMinutes = Math.max(5, Math.ceil(dueItems.length * 0.6));

  const upcomingCourses = courses
    .slice()
    .sort((a, b) => {
      const dateA = a.examDate || a.createdAt;
      const dateB = b.examDate || b.createdAt;
      return dateA.localeCompare(dateB);
    })
    .slice(0, 3);

  const getMastery = (courseId: string) => {
    const items = reviewItems.filter((r) => r.courseId === courseId);
    if (items.length === 0) return 0;
    const correct = items.filter((r) => r.streak > 0).length;
    return Math.round((correct / items.length) * 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CPHeader subtitle="Today's mission" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <CPCard style={styles.missionCard}>
          <Text style={styles.missionTitle}>Review Queue</Text>
          <Text style={styles.missionCount}>{dueItems.length} items due</Text>
          <Text style={styles.missionTime}>~{estimatedMinutes} min</Text>
          <CPButton
            title="Start Review"
            onPress={() => router.push("/study/review")}
            disabled={dueItems.length === 0}
            style={styles.startButton}
          />
        </CPCard>

        <Text style={styles.sectionTitle}>Next checkpoints</Text>
        {upcomingCourses.map((course) => (
          <CPCard key={course.id} style={styles.checkpointCard}>
            <View style={styles.checkpointHeader}>
              <View
                style={[styles.colorDot, { backgroundColor: course.color }]}
              />
              <View style={styles.checkpointInfo}>
                <Text style={styles.checkpointCode}>{course.code}</Text>
                <Text style={styles.checkpointTitle}>{course.title}</Text>
              </View>
            </View>
            <Text style={styles.masteryText}>
              Mastery: {getMastery(course.id)}%
            </Text>
          </CPCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  missionCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  missionCount: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  missionTime: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  startButton: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  checkpointCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  checkpointHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  checkpointInfo: {
    flex: 1,
  },
  checkpointCode: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  checkpointTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  masteryText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
