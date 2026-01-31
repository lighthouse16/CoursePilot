import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";

export default function CoursesScreen() {
  const router = useRouter();
  const terms = useAppStore((state) => state.terms);
  const courses = useAppStore((state) => state.courses);
  const units = useAppStore((state) => state.units);
  const reviewItems = useAppStore((state) => state.reviewItems);

  const currentTerm = terms[0];
  const termCourses = courses.filter((c) => c.termId === currentTerm?.id);

  const getDueCount = (courseId: string) => {
    const now = new Date().toISOString();
    return reviewItems.filter((r) => r.courseId === courseId && r.dueAt <= now)
      .length;
  };

  const getUnitsCount = (courseId: string) => {
    return units.filter((u) => u.courseId === courseId).length;
  };

  const handleAddCourse = () => {
    if (!currentTerm) return;
    const num = courses.length + 1;
    const addCourseAction = useAppStore.getState().addCourse;
    addCourseAction({
      code: `NEW${1000 + num}`,
      title: `New Course ${num}`,
      termId: currentTerm.id,
    });

    const latestCourse = useAppStore.getState().courses.slice(-1)[0];
    if (latestCourse) {
      router.push(`/course/${latestCourse.id}?rename=true` as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CPHeader subtitle="Your courses" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <CPButton
          title="Add course"
          onPress={handleAddCourse}
          style={styles.addButtonTop}
        />

        {termCourses.map((course) => {
          const unitsCount = getUnitsCount(course.id);
          const dueCount = getDueCount(course.id);
          return (
            <Pressable
              key={course.id}
              onPress={() => router.push(`/course/${course.id}` as any)}
            >
              <CPCard style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <View
                    style={[styles.colorBar, { backgroundColor: course.color }]}
                  />
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseCode}>{course.code}</Text>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                  </View>
                </View>
                <View style={styles.courseStats}>
                  <Text style={styles.statText}>{unitsCount} units</Text>
                  {dueCount > 0 && (
                    <Text style={styles.dueText}>{dueCount} due</Text>
                  )}
                </View>
              </CPCard>
            </Pressable>
          );
        })}
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
  courseCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  colorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  courseTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  courseStats: {
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
  addButtonTop: {
    marginBottom: theme.spacing.lg,
  },
});
