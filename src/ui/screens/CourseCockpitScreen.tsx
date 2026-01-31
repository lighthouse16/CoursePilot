import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
  const { courseId, rename } = useLocalSearchParams<{
    courseId?: string;
    rename?: string;
  }>();

  const course = useCourseStore(
    (s) => s.courses.find((c) => c.id === String(courseId || "")) || null,
  );
  const updateCourse = useCourseStore((s) => s.updateCourse);
  const addUnit = useCourseStore((s) => s.addUnit);
  const updateUnit = useCourseStore((s) => s.updateUnit);

  const [showRename, setShowRename] = useState(rename === "true");
  const [renameTitle, setRenameTitle] = useState(course ? course.title : "");

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
  const handleSaveRename = () => {
    const next = renameTitle.trim();
    if (!next) return;
    updateCourse(course.id, { title: next });
    setShowRename(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{course.title}</Text>

      {showRename && (
        <View style={styles.renameSection}>
          <Text style={styles.label}>Rename course</Text>
          <TextInput
            style={styles.input}
            value={renameTitle}
            onChangeText={setRenameTitle}
            placeholder="Course name"
            placeholderTextColor="#94A3B8"
          />
          <View style={styles.renameActions}>
            <Button
              title="Save name"
              color={PRIMARY}
              onPress={handleSaveRename}
            />
          </View>
        </View>
      )}

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
  renameSection: {
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  renameActions: {
    marginTop: 8,
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
