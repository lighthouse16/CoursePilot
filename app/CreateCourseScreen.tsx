import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useCourseStore } from "../src/store/useCourseStore";
import { parseSyllabus } from "../utils/aiPlaceholders";

interface UnitInput {
  id: string;
  title: string;
}

export default function CreateCourseScreen() {
  const router = useRouter();
  const addCourse = useCourseStore((state) => state.addCourse);

  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState<UnitInput[]>([]);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleUpload = async () => {
    const filePath = "mock-syllabus.pdf";
    setUploadedFile(filePath);

    const parsed = await parseSyllabus(filePath);
    setDescription(parsed.description);
    setUnits(parsed.units);
  };

  const handleAddUnit = () => {
    setUnits((prev) => [
      ...prev,
      { id: `unit-${Date.now()}`, title: "New Unit" },
    ]);
  };

  const handleUpdateUnit = (id: string, title: string) => {
    setUnits((prev) =>
      prev.map((unit) => (unit.id === id ? { ...unit, title } : unit)),
    );
  };

  const handleCreateCourse = () => {
    const newCourseId = Date.now().toString();
    addCourse({
      id: newCourseId,
      code: courseCode,
      title: courseTitle,
      description,
      units: units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        materials: [],
        concepts: [],
      })),
    });

    router.push({
      pathname: "/course/[courseId]",
      params: { courseId: newCourseId },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Course</Text>

      <TextInput
        style={styles.input}
        placeholder="Course code"
        placeholderTextColor="#94A3B8"
        value={courseCode}
        onChangeText={setCourseCode}
      />

      <TextInput
        style={styles.input}
        placeholder="Course title"
        placeholderTextColor="#94A3B8"
        value={courseTitle}
        onChangeText={setCourseTitle}
      />

      <View style={styles.buttonRow}>
        <Button
          title="Upload Syllabus"
          color="#4338CA"
          onPress={handleUpload}
        />
      </View>

      {uploadedFile && (
        <Text style={styles.uploadedText}>Uploaded: {uploadedFile}</Text>
      )}

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Course description"
        placeholderTextColor="#94A3B8"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Units</Text>
        <Button title="+ Add Unit" color="#4338CA" onPress={handleAddUnit} />
      </View>

      <FlatList
        data={units}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TextInput
            style={styles.input}
            value={item.title}
            onChangeText={(text) => handleUpdateUnit(item.id, text)}
            placeholder="Unit title"
            placeholderTextColor="#94A3B8"
          />
        )}
      />

      <View style={styles.buttonRow}>
        <Button
          title="Create Course"
          color="#4338CA"
          onPress={handleCreateCourse}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    gap: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4338CA",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    marginVertical: 6,
  },
  uploadedText: {
    fontSize: 12,
    color: "#64748B",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
});
