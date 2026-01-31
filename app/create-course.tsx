import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../constants/theme";
import { parseSyllabus } from "../src/services/aiPlaceholders";
import { useAppStore } from "../src/store/useAppStore";
import { CPHeader } from "../src/ui/components/CPHeader";

interface UnitInput {
  id: string;
  title: string;
  weekNumber?: number;
}

export default function CreateCourseScreen() {
  const router = useRouter();
  const addUnit = useAppStore((state) => state.addUnit);
  const terms = useAppStore((state) => state.terms);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState<UnitInput[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUploadSyllabus = async () => {
    setLoading(true);
    try {
      // Mock file upload - in production, use DocumentPicker
      const result = await parseSyllabus(null);

      setDescription(result.description);
      setUnits(
        result.units.map((unit, index) => ({
          id: `temp-${Date.now()}-${index}`,
          title: unit.title,
          weekNumber: unit.weekNumber,
        })),
      );

      Alert.alert("Success", "Syllabus parsed successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to parse syllabus");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUnit = (id: string, newTitle: string) => {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === id ? { ...unit, title: newTitle } : unit,
      ),
    );
  };

  const handleRemoveUnit = (id: string) => {
    setUnits((prev) => prev.filter((unit) => unit.id !== id));
  };

  const handleAddUnit = () => {
    setUnits((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        title: "",
        weekNumber: prev.length + 1,
      },
    ]);
  };

  const handleCreateCourse = () => {
    if (!code.trim() || !title.trim()) {
      Alert.alert("Error", "Please enter course code and title");
      return;
    }

    // Get the first term, or create a default one
    const termId = terms.length > 0 ? terms[0].id : "term-default";

    // Generate a unique course ID
    const courseId = `course-${Date.now()}`;

    // Add the course with the generated ID
    const state = useAppStore.getState();
    const newCourse = {
      id: courseId,
      termId,
      code: code.trim(),
      title: title.trim(),
      description: description.trim() || undefined,
      color: "#4338CA",
      createdAt: new Date().toISOString(),
    };

    useAppStore.setState({
      courses: [...state.courses, newCourse],
    });

    // Add units if any
    units.forEach((unit) => {
      if (unit.title.trim()) {
        addUnit(courseId, unit.title.trim());
      }
    });

    // Navigate to the course cockpit screen
    router.push(`/subject/${courseId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CPHeader subtitle="Create new course" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.label}>Course Code</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="e.g., CS101"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Course Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Introduction to Computer Science"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Syllabus (Optional)</Text>
          <Pressable
            style={styles.uploadButton}
            onPress={handleUploadSyllabus}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>
                📄 Upload & Parse Syllabus
              </Text>
            )}
          </Pressable>
          <Text style={styles.hint}>
            Upload a syllabus to auto-generate description and units
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Course description..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Units</Text>
            <Pressable style={styles.addButton} onPress={handleAddUnit}>
              <Text style={styles.addButtonText}>+ Add Unit</Text>
            </Pressable>
          </View>

          {units.length === 0 ? (
            <Text style={styles.emptyText}>
              No units yet. Add units manually or upload a syllabus.
            </Text>
          ) : (
            <View style={styles.unitsList}>
              {units.map((unit, index) => (
                <View key={unit.id} style={styles.unitItem}>
                  <View style={styles.unitNumber}>
                    <Text style={styles.unitNumberText}>{index + 1}</Text>
                  </View>
                  <TextInput
                    style={styles.unitInput}
                    value={unit.title}
                    onChangeText={(text) => handleUpdateUnit(unit.id, text)}
                    placeholder="Unit title..."
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => handleRemoveUnit(unit.id)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <Pressable
          style={[
            styles.createButton,
            (!code.trim() || !title.trim()) && styles.createButtonDisabled,
          ]}
          onPress={handleCreateCourse}
          disabled={!code.trim() || !title.trim()}
        >
          <Text style={styles.createButtonText}>Create Course</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: "#1E293B",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#4338CA",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  hint: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
    fontStyle: "italic",
  },
  addButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#4338CA",
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    paddingVertical: 20,
    fontStyle: "italic",
  },
  unitsList: {
    gap: 12,
  },
  unitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  unitNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4338CA",
    alignItems: "center",
    justifyContent: "center",
  },
  unitNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  unitInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: "#4338CA",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  createButtonDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.6,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
