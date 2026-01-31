import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { theme } from "../../constants/theme";
import { useSubjectsStore } from "../../src/store/useSubjectsStore";
import { CPCard } from "../../src/ui/components/CPCard";

export default function SubjectsScreen() {
  const router = useRouter();
  const subjects = useSubjectsStore((state) => state.subjects);
  const addSubject = useSubjectsStore((state) => state.addSubject);

  const handleAddSubject = () => {
    if (Platform.OS === "ios") {
      Alert.prompt("New Subject", "Enter subject name:", (name) => {
        if (name && name.trim()) {
          addSubject(name.trim());
        }
      });
    } else {
      // For Android/web, create a default subject
      addSubject(`New Subject ${subjects.length + 1}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerRow}>
          <Text style={styles.header}>Subjects</Text>
          <Pressable onPress={handleAddSubject} style={styles.addButton}>
            <Ionicons
              name="add-circle"
              size={32}
              color={theme.colors.primary}
            />
          </Pressable>
        </View>

        {subjects.map((subject) => (
          <Pressable
            key={subject.id}
            onPress={() => router.push(`/subject/${subject.id}`)}
          >
            <CPCard style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.masteryBadge}>{subject.mastery}%</Text>
              </View>
              <Text style={styles.nextDue}>Next due: {subject.nextDue}</Text>
            </CPCard>
          </Pressable>
        ))}

        {subjects.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No subjects yet</Text>
            <Text style={styles.emptySubtext}>
              Tap + to add your first subject
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.text,
  },
  addButton: {
    padding: theme.spacing.xs,
  },
  subjectCard: {
    gap: theme.spacing.sm,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subjectName: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.text,
  },
  masteryBadge: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.success,
  },
  nextDue: {
    fontSize: 14,
    color: theme.colors.subtext,
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
