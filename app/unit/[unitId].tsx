import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";

export default function UnitScreen() {
  const router = useRouter();
  const { unitId } = useLocalSearchParams();
  const unitById = useAppStore((state) => state.unitById);
  const courseById = useAppStore((state) => state.courseById);
  const concepts = useAppStore((state) => state.concepts);
  const flashcards = useAppStore((state) => state.flashcards);
  const practiceQs = useAppStore((state) => state.practiceQs);
  const generateStudyPack = useAppStore((state) => state.generateStudyPack);

  const unit = unitById(unitId as string);
  const course = unit ? courseById(unit.courseId) : undefined;

  if (!unit || !course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Unit not found</Text>
      </SafeAreaView>
    );
  }

  const unitConcepts = concepts.filter((c) => c.unitId === unit.id);
  const unitFlashcards = flashcards.filter((f) => f.unitId === unit.id);
  const unitPractice = practiceQs.filter((p) => p.unitId === unit.id);

  const handleGenerateStudyPack = () => {
    generateStudyPack(course.id, unit.id);
  };

  const handleAddMaterial = () => {
    router.push(`/materials/add?courseId=${course.id}&unitId=${unit.id}`);
  };

  const handleReview = () => {
    router.push("/study/review");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CPHeader subtitle="Unit cockpit" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <CPCard style={styles.headerCard}>
          <Text style={styles.unitTitle}>{unit.title}</Text>
          <Text style={styles.courseName}>
            {course.code} • {course.title}
          </Text>
        </CPCard>

        <CPCard style={styles.statsCard}>
          <Text style={styles.statsTitle}>Study content</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{unitConcepts.length}</Text>
              <Text style={styles.statLabel}>Concepts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{unitFlashcards.length}</Text>
              <Text style={styles.statLabel}>Flashcards</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{unitPractice.length}</Text>
              <Text style={styles.statLabel}>Practice</Text>
            </View>
          </View>
        </CPCard>

        {unitConcepts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Concepts preview</Text>
            {unitConcepts.slice(0, 3).map((concept) => (
              <CPCard key={concept.id} style={styles.conceptCard}>
                <Text style={styles.conceptTitle}>{concept.title}</Text>
                {concept.bullets.map((bullet, i) => (
                  <Text key={i} style={styles.bulletText}>
                    • {bullet}
                  </Text>
                ))}
              </CPCard>
            ))}
          </>
        )}

        <CPButton
          title="Generate study pack"
          onPress={handleGenerateStudyPack}
          style={styles.button}
        />
        <CPButton
          title="Add material to this unit"
          onPress={handleAddMaterial}
          style={styles.button}
        />
        <CPButton
          title="Review due items"
          onPress={handleReview}
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
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
  headerCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  unitTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  courseName: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statsCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  conceptCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  conceptTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  bulletText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
});
