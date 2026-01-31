import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { theme } from "../../constants/theme";
import { useSubjectsStore } from "../../src/store/useSubjectsStore";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";

type Tab = "Notes" | "Flashcards" | "Practice" | "Materials";

export default function SubjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const subjects = useSubjectsStore((state) => state.subjects);
  const subject = subjects.find((s) => s.id === id);
  const [activeTab, setActiveTab] = useState<Tab>("Notes");

  if (!subject) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Subject not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const tabs: Tab[] = ["Notes", "Flashcards", "Practice", "Materials"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <CPCard style={styles.headerCard}>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Next Due</Text>
              <Text style={styles.statValue}>{subject.nextDue}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Mastery</Text>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {subject.mastery}%
              </Text>
            </View>
          </View>
        </CPCard>

        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        <CPCard style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            {activeTab} content will appear here
          </Text>
        </CPCard>

        <CPButton
          title="Upload Material to This Subject"
          onPress={() =>
            router.push({ pathname: "/upload", params: { subjectId: id } })
          }
          variant="secondary"
        />
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
  headerCard: {
    gap: theme.spacing.md,
  },
  subjectName: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.xl,
  },
  stat: {
    gap: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
    ...theme.shadow.card,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.subtext,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  placeholderCard: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  placeholderText: {
    fontSize: 15,
    color: theme.colors.subtext,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: "center",
  },
});
