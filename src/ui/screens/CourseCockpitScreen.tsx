import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";
import { CPCard } from "../components/CPCard";
import { CPHeader } from "../components/CPHeader";

export default function CourseCockpitScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();

  const courseById = useAppStore((state) => state.courseById);
  const unitsForCourse = useAppStore((state) => state.unitsForCourse);
  const updateCourse = useAppStore((state) => state.updateCourse);
  const updateUnit = useAppStore((state) => state.updateUnit);
  const addUnit = useAppStore((state) => state.addUnit);

  const course = courseById(courseId as string);
  const units = unitsForCourse(courseId as string);

  const [description, setDescription] = useState(course?.description || "");
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [unitTitles, setUnitTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (course?.description) {
      setDescription(course.description);
    }
  }, [course?.description]);

  useEffect(() => {
    const titles: Record<string, string> = {};
    units.forEach((unit) => {
      titles[unit.id] = unit.title;
    });
    setUnitTitles(titles);
  }, [units]);

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <CPHeader subtitle="Course not found" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Course not found</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleDescriptionBlur = () => {
    if (description !== course.description) {
      updateCourse(course.id, { description });
    }
  };

  const handleUnitTitleChange = (unitId: string, newTitle: string) => {
    setUnitTitles((prev) => ({ ...prev, [unitId]: newTitle }));
  };

  const handleUnitTitleBlur = (unitId: string) => {
    const newTitle = unitTitles[unitId];
    const unit = units.find((u) => u.id === unitId);
    if (unit && newTitle && newTitle !== unit.title) {
      updateUnit(unitId, { title: newTitle });
    }
    setEditingUnitId(null);
  };

  const handleAddUnit = () => {
    const nextWeek = units.length + 1;
    addUnit(course.id, `Week ${nextWeek}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CPHeader subtitle="Course cockpit" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <CPCard style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <View
                style={[styles.colorDot, { backgroundColor: course.color }]}
              />
              <View style={styles.courseInfo}>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
              </View>
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              onBlur={handleDescriptionBlur}
              placeholder="Add a course description..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          </CPCard>

          <View style={styles.unitsHeader}>
            <Text style={styles.sectionTitle}>Units</Text>
            <Text style={styles.unitCount}>{units.length}</Text>
          </View>

          <FlatList
            data={units}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CPCard style={styles.unitCard}>
                <View style={styles.unitRow}>
                  <View style={styles.weekBadge}>
                    <Text style={styles.weekText}>
                      W{item.weekNumber || "?"}
                    </Text>
                  </View>

                  {editingUnitId === item.id ? (
                    <TextInput
                      style={styles.unitTitleInput}
                      value={unitTitles[item.id] || ""}
                      onChangeText={(text) =>
                        handleUnitTitleChange(item.id, text)
                      }
                      onBlur={() => handleUnitTitleBlur(item.id)}
                      autoFocus
                    />
                  ) : (
                    <Pressable
                      style={styles.unitTitleContainer}
                      onPress={() => setEditingUnitId(item.id)}
                    >
                      <Text style={styles.unitTitle}>{item.title}</Text>
                      <Text style={styles.tapHint}>Tap to edit</Text>
                    </Pressable>
                  )}
                </View>
              </CPCard>
            )}
            ListEmptyComponent={
              <CPCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No units yet. Add your first one below.
                </Text>
              </CPCard>
            }
            ListFooterComponent={
              <Pressable style={styles.addButton} onPress={handleAddUnit}>
                <Text style={styles.addButtonText}>+ Add Unit</Text>
              </Pressable>
            }
            contentContainerStyle={styles.listContent}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#4338CA",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  courseCard: {
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  courseTitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  descriptionInput: {
    fontSize: 14,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  unitsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
  },
  unitCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4338CA",
  },
  listContent: {
    paddingBottom: 24,
  },
  unitCard: {
    padding: 16,
    marginBottom: 12,
  },
  unitRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weekBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  weekText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4338CA",
  },
  unitTitleContainer: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  tapHint: {
    fontSize: 12,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  unitTitleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    borderBottomWidth: 2,
    borderBottomColor: "#4338CA",
    paddingVertical: 4,
  },
  emptyCard: {
    padding: 24,
    alignItems: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4338CA",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
