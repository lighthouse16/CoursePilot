import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
import { MaterialKind } from "../../src/types/course";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";

const materialKinds: MaterialKind[] = ["pdf", "slides", "notes", "link"];

export default function AddMaterialScreen() {
  const router = useRouter();
  const { courseId, unitId } = useLocalSearchParams();
  const addMaterial = useAppStore((state) => state.addMaterial);

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<MaterialKind>("pdf");

  const handleSave = () => {
    if (!title.trim()) return;
    addMaterial(
      courseId as string,
      unitId ? (unitId as string) : undefined,
      title.trim(),
      kind,
    );
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CPHeader subtitle="Add material" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <CPCard style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Lecture 3 slides"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={[styles.label, styles.labelMargin]}>Type</Text>
          <View style={styles.kindButtons}>
            {materialKinds.map((k) => (
              <Pressable
                key={k}
                style={[
                  styles.kindButton,
                  kind === k && styles.kindButtonActive,
                ]}
                onPress={() => setKind(k)}
              >
                <Text
                  style={[
                    styles.kindButtonText,
                    kind === k && styles.kindButtonTextActive,
                  ]}
                >
                  {k}
                </Text>
              </Pressable>
            ))}
          </View>
        </CPCard>

        <CPButton
          title="Save"
          onPress={handleSave}
          disabled={!title.trim()}
          style={styles.saveButton}
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
  card: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  labelMargin: {
    marginTop: theme.spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  kindButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  kindButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    alignItems: "center",
  },
  kindButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  kindButtonText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  kindButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  saveButton: {
    marginTop: theme.spacing.md,
  },
});
