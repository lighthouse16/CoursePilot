import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";

export default function SettingsScreen() {
  const router = useRouter();
  const signOut = useAppStore((state) => state.signOut);
  const user = useAppStore((state) => state.user);
  const firebaseUserId = useAppStore((state) => state.firebaseUserId);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth/sign-in");
  };

  const handleChangeAccount = () => {
    router.push("/auth/sign-in");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CPHeader subtitle="Preferences" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {user && (
          <CPCard style={styles.card}>
            <Text style={styles.cardTitle}>Account</Text>
            <Text style={styles.cardText}>Name: {user.name}</Text>
            {user.email && (
              <Text style={styles.cardText}>Email: {user.email}</Text>
            )}
            {firebaseUserId && (
              <Text style={styles.syncStatus}>✓ Cloud sync enabled</Text>
            )}
            <CPButton
              title="Change Account"
              onPress={handleChangeAccount}
              variant="secondary"
              style={styles.changeAccountButton}
            />
            <CPButton
              title="Sign Out"
              onPress={handleSignOut}
              style={styles.signOutButton}
            />
          </CPCard>
        )}

        {!user && (
          <CPCard style={styles.card}>
            <Text style={styles.cardTitle}>Account</Text>
            <Text style={styles.cardText}>
              Sign in to enable cloud sync and access your data across devices.
            </Text>
            <CPButton
              title="Sign In"
              onPress={() => router.push("/auth/sign-in")}
              style={styles.signInButton}
            />
          </CPCard>
        )}

        <CPCard style={styles.card}>
          <Text style={styles.cardTitle}>Offline-first demo</Text>
          <Text style={styles.cardText}>
            CoursePilot runs entirely on your device. All data is stored locally
            using AsyncStorage. Future updates will add cloud sync and real
            AI-powered study pack generation.
          </Text>
        </CPCard>

        <CPCard style={styles.card}>
          <Text style={styles.cardTitle}>Course-first design</Text>
          <Text style={styles.cardText}>
            Your study materials are organized by courses, units, and weeks—not
            scattered files. The &quot;Today&quot; view pulls from upcoming
            deadlines and your spaced repetition queue.
          </Text>
        </CPCard>
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
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  syncStatus: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    fontWeight: "600",
  },
  signInButton: {
    marginTop: theme.spacing.md,
  },
  changeAccountButton: {
    marginTop: theme.spacing.md,
  },
  signOutButton: {
    marginTop: theme.spacing.sm,
  },
});
