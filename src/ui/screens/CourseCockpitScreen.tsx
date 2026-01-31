import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useCourseStore } from "../../store/useCourseStore";

const PRIMARY = "#4338CA";
const BG = "#F8FAFC";

export default function CourseCockpitScreen() {
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();

  const course = useCourseStore(
    (s) => s.courses.find((c) => c.id === String(courseId || "")) || null,
  );
  const updateCourse = useCourseStore((s) => s.updateCourse);
  const addUnit = useCourseStore((s) => s.addUnit);
  const updateUnit = useCourseStore((s) => s.updateUnit);

  if (!course) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Course not found</Text>
        <Text style={styles.subtle}>Ensure a valid courseId is provided.</Text>
      </View>
    );
  }

  const handleDescriptionChange = (text: string) => {
    updateCourse(course.id, { description: text });
  };

  const handleAddUnit = () => {
    const id = Date.now().toString();
    addUnit(course.id, { id, title: "New Unit", materials: [], concepts: [] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{course.title}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          multiline
          placeholder="Describe this course..."
          value={course.description || ""}
          onChangeText={handleDescriptionChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Units</Text>
        <FlatList
          data={course.units}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.unitCard}>
              <TextInput
                style={styles.input}
                placeholder="Unit title"
                value={item.title}
                onChangeText={(text) =>
                  updateUnit(course.id, item.id, { title: text })
                }
              />
              <View style={styles.unitActions}>
                <Button
                  title="+ Add Material"
                  color={PRIMARY}
                  onPress={() => {
                    // Mocked for now
                    console.log("Add material to unit", item.id);
                  }}
                />
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.footer}>
        <Button title="+ Add Unit" color={PRIMARY} onPress={handleAddUnit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 12,
  },
  subtle: {
    color: "#64748B",
  },
  section: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#0F172A",
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  listContent: {
    paddingVertical: 8,
  },
  separator: {
    height: 12,
  },
  unitCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  unitActions: {
    marginTop: 8,
  },
  footer: {
    marginTop: 24,
  },
});

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
