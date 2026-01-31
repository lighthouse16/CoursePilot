import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";

export default function CourseScreen() {
  const router = useRouter();
  const { courseId, rename } = useLocalSearchParams();
  const courseById = useAppStore((state) => state.courseById);
  const unitsForCourse = useAppStore((state) => state.unitsForCourse);
  const materials = useAppStore((state) => state.materials);
  const concepts = useAppStore((state) => state.concepts);
  const reviewItems = useAppStore((state) => state.reviewItems);
  const addUnit = useAppStore((state) => state.addUnit);
  const generateStudyPack = useAppStore((state) => state.generateStudyPack);
  const updateCourse = useAppStore((state) => state.updateCourse);

  const course = courseById(courseId as string);
  const units = unitsForCourse(courseId as string);
  const [showRename, setShowRename] = useState(rename === "true");
  const [renameTitle, setRenameTitle] = useState("");

  useEffect(() => {
    if (course) {
      setRenameTitle(course.title);
    }
  }, [course]);

  if (!course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Course not found</Text>
      </SafeAreaView>
    );
  }

  const getUnitMaterials = (unitId: string) => {
    return materials.filter((m) => m.unitId === unitId).length;
  };

  const getUnitConcepts = (unitId: string) => {
    return concepts.filter((c) => c.unitId === unitId).length;
  };

  const getUnitDue = (unitId: string) => {
    const now = new Date().toISOString();
    return reviewItems.filter((r) => r.unitId === unitId && r.dueAt <= now)
      .length;
  };

  const handleAddUnit = () => {
    const nextWeek = units.length + 1;
    addUnit(course.id, `Week ${nextWeek}`);
  };

  const handleAddMaterial = () => {
    router.push(`/materials/add?courseId=${course.id}`);
  };

  const handleGenerateStudyPack = () => {
    const latestUnit = units[units.length - 1];
    if (latestUnit) {
      generateStudyPack(course.id, latestUnit.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CPHeader subtitle="Course cockpit" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {showRename && course && (
          <CPCard style={styles.renameCard}>
            <Text style={styles.renameTitle}>Rename your course</Text>
            <Text style={styles.renameSubtitle}>
              Enter a name for this course folder
            </Text>
            <View style={styles.renameRow}>
              <View style={styles.renameInputWrap}>
                <TextInput
                  style={styles.renameInput}
                  value={renameTitle}
                  onChangeText={setRenameTitle}
                  placeholder="Course name"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>
            <CPButton
              title="Save name"
              onPress={() => {
                if (!renameTitle.trim()) return;
                updateCourse(course.id, { title: renameTitle.trim() });
                setShowRename(false);
              }}
            />
          </CPCard>
        )}

        <CPCard style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View
              style={[styles.colorBar, { backgroundColor: course.color }]}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.courseCode}>{course.code}</Text>
              <Text style={styles.courseTitle}>{course.title}</Text>
              {course.targetGrade && (
                <Text style={styles.targetGrade}>
                  Target: {course.targetGrade}
                </Text>
              )}
              {course.examDate && (
                <Text style={styles.examDate}>Exam: {course.examDate}</Text>
              )}
            </View>
          </View>
        </CPCard>

        <Text style={styles.sectionTitle}>Units</Text>
        {units.map((unit) => {
          const materialsCount = getUnitMaterials(unit.id);
          const conceptsCount = getUnitConcepts(unit.id);
          const dueCount = getUnitDue(unit.id);
          return (
            <Pressable
              key={unit.id}
              onPress={() => router.push(`/unit/${unit.id}` as any)}
            >
              <CPCard style={styles.unitCard}>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <View style={styles.unitStats}>
                  <Text style={styles.statText}>
                    {materialsCount} materials
                  </Text>
                  <Text style={styles.statText}>{conceptsCount} concepts</Text>
                  {dueCount > 0 && (
                    <Text style={styles.dueText}>{dueCount} due</Text>
                  )}
                </View>
              </CPCard>
            </Pressable>
          );
        })}

        <CPButton
          title="Add unit"
          onPress={handleAddUnit}
          style={styles.button}
        />
        <CPButton
          title="Add material"
          onPress={handleAddMaterial}
          style={styles.button}
        />

        <Text style={styles.sectionTitle}>Study pack</Text>
        <CPCard style={styles.studyPackCard}>
          <Text style={styles.studyPackText}>
            Generate concepts, flashcards, and practice questions for your
            latest unit.
          </Text>
          <CPButton
            title="Generate study pack"
            onPress={handleGenerateStudyPack}
            disabled={units.length === 0}
            style={styles.generateButton}
          />
        </CPCard>
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
  renameCard: {
    marginBottom: theme.spacing.lg,
  },
  renameTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  renameSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  renameRow: {
    marginBottom: theme.spacing.md,
  },
  renameInputWrap: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  renameInput: {
    fontSize: 16,
    color: theme.colors.text,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
  headerCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorBar: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  courseTitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  targetGrade: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  examDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  unitCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  unitStats: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  statText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  dueText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  button: {
    marginBottom: theme.spacing.md,
  },
  studyPackCard: {
    padding: theme.spacing.lg,
  },
  studyPackText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  generateButton: {
    marginTop: theme.spacing.sm,
  },
});
