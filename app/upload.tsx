import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { useSubjectsStore } from "../src/store/useSubjectsStore";
import { CPButton } from "../src/ui/components/CPButton";
import { CPCard } from "../src/ui/components/CPCard";
import { CPHeader } from "../src/ui/components/CPHeader";

export default function UploadScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId?: string }>();
  const subjects = useSubjectsStore((state) => state.subjects);
  const preselectedSubject = subjectId
    ? subjects.find((s) => s.id === subjectId)
    : null;

  return (
    <View style={styles.container}>
      <CPHeader subtitle="Add learning material" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {preselectedSubject && (
          <View style={styles.subjectBadge}>
            <Text style={styles.badgeText}>
              Uploading to: {preselectedSubject.name}
            </Text>
          </View>
        )}

        <CPCard style={styles.uploadCard}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="cloud-upload-outline"
              size={64}
              color={theme.colors.primary}
            />
          </View>

          <Text style={styles.title}>Upload Material</Text>
          <Text style={styles.description}>
            PDF, slides, or notes — CoursePilot will generate a study pack for
            you.
          </Text>

          <View style={styles.buttonGroup}>
            <CPButton
              title="Choose File"
              onPress={() => {}}
              variant="secondary"
            />
            <CPButton
              title="Generate Study Pack"
              onPress={() => {}}
              variant="primary"
            />
          </View>
        </CPCard>

        <CPCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>What we&apos;ll generate</Text>
          <View style={styles.featureList}>
            <FeatureItem
              icon="document-text-outline"
              text="Smart notes and summaries"
            />
            <FeatureItem
              icon="albums-outline"
              text="Flashcards from key concepts"
            />
            <FeatureItem icon="help-circle-outline" text="Practice questions" />
          </View>
        </CPCard>
      </ScrollView>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  subjectBadge: {
    backgroundColor: theme.colors.primary + "15",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  uploadCard: {
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
  },
  description: {
    fontSize: 15,
    color: theme.colors.subtext,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
  },
  buttonGroup: {
    width: "100%",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  infoCard: {
    gap: theme.spacing.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  featureList: {
    gap: theme.spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
  },
});
