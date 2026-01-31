import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";

export default function SubjectsScreen() {
  const router = useRouter();
  const courses = useAppStore((state) => state.courses);
  const terms = useAppStore((state) => state.terms);

  const handleAddSubject = () => {
    const courseNumber = courses.length + 1;
    const termId = terms.length > 0 ? terms[0].id : "term-default";

    // Create course with default name using the addCourse action
    const newCourse = {
      code: `COURSE${courseNumber}`,
      title: `New Course ${courseNumber}`,
      termId,
    };

    // Use the store's addCourse action which handles persistence
    const addCourse = useAppStore.getState().addCourse;
    addCourse(newCourse);

    // Get the most recently added course (the one we just created)
    // Since addCourse uses Date.now(), we need to get the latest course
    setTimeout(() => {
      const updatedCourses = useAppStore.getState().courses;
      const latestCourse = updatedCourses[updatedCourses.length - 1];
      if (latestCourse) {
        router.push(`/subject/${latestCourse.id}?edit=true`);
      }
    }, 100);
  };

  return (
    <View style={styles.container}>
      <CPHeader subtitle="Your course folders" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <CPButton title="Create course" onPress={() => router.push("/CreateCourseScreen")} />
        <CPButton title="Add course" onPress={handleAddSubject} />

        {courses.map((course) => (
          <Pressable
            key={course.id}
            onPress={() => router.push(`/subject/${course.id}`)}
          >
            <CPCard style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{course.title}</Text>
                <Text style={styles.courseCode}>{course.code}</Text>
              </View>
              {course.description && (
                <Text style={styles.courseDescription} numberOfLines={2}>
                  {course.description}
                </Text>
              )}
            </CPCard>
          </Pressable>
        ))}

        {courses.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No courses yet</Text>
            <Text style={styles.emptySubtext}>
              Tap + to add your first course
            </Text>
          </View>
        )}
      </ScrollView>
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
    gap: theme.spacing.md,
  },
  subjectCard: {
    gap: theme.spacing.sm,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  subjectName: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  courseDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    marginTop: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginTop: theme.spacing.xs,
  },
});
