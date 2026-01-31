import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { theme } from "../../constants/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";

type Tab = "Notes" | "Flashcards" | "Practice" | "Materials";

export default function SubjectDetailScreen() {
  const router = useRouter();
  const { id, edit } = useLocalSearchParams<{ id: string; edit?: string }>();
  const courses = useAppStore((state) => state.courses);
  const updateCourse = useAppStore((state) => state.updateCourse);
  const course = courses.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState<Tab>("Notes");
  const [isEditing, setIsEditing] = useState(edit === "true");
  const [editTitle, setEditTitle] = useState(course?.title || "");
  const [editCode, setEditCode] = useState(course?.code || "");

  useEffect(() => {
    if (course) {
      setEditTitle(course.title);
      setEditCode(course.code);
    }
  }, [course]);

  useEffect(() => {
    if (edit === "true" && course) {
      // Auto-focus would happen here if we had a ref
      setIsEditing(true);
    }
  }, [edit, course]);

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editCode.trim()) {
      Alert.alert("Error", "Course name and code cannot be empty");
      return;
    }

    updateCourse(id, {
      title: editTitle.trim(),
      code: editCode.trim(),
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (course) {
      setEditTitle(course.title);
      setEditCode(course.code);
    }
    setIsEditing(false);
  };

  if (!course) {
    return (
      <View style={styles.container}>
        <CPHeader subtitle="Course detail" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Course not found</Text>
        </View>
      </View>
    );
  }

  const tabs: Tab[] = ["Notes", "Flashcards", "Practice", "Materials"];

  return (
    <View style={styles.container}>
      <CPHeader subtitle="Course detail" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <CPCard style={styles.headerCard}>
          {isEditing ? (
            <View style={styles.editContainer}>
              <Text style={styles.editLabel}>Course Code</Text>
              <TextInput
                style={styles.editInput}
                value={editCode}
                onChangeText={setEditCode}
                placeholder="Course code"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="characters"
              />
              <Text style={styles.editLabel}>Course Title</Text>
              <TextInput
                style={styles.editInput}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Course title"
                placeholderTextColor={theme.colors.textSecondary}
                autoFocus
              />
              <View style={styles.editButtons}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.saveButton} onPress={handleSaveEdit}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable onPress={() => setIsEditing(true)}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.editHint}>Tap to edit</Text>
              </View>
              <Text style={styles.courseName}>{course.title}</Text>
              {course.description && (
                <Text style={styles.courseDescription}>
                  {course.description}
                </Text>
              )}
            </Pressable>
          )}
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
          title="Upload Material to This Course"
          onPress={() =>
            router.push({ pathname: "/upload", params: { courseId: id } })
          }
          variant="secondary"
        />
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
    gap: theme.spacing.lg,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  headerCard: {
    padding: theme.spacing.lg,
  },
  editContainer: {
    gap: theme.spacing.md,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  editInput: {
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  editButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  editHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  courseName: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  courseDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
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
});
