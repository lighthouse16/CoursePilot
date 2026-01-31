import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { ReviewItem } from "../../src/types/course";
import { CPButton } from "../../src/ui/components/CPButton";
import { CPCard } from "../../src/ui/components/CPCard";
import { CPHeader } from "../../src/ui/components/CPHeader";
import { CPProgressBar } from "../../src/ui/components/CPProgressBar";

export default function ReviewScreen() {
  const router = useRouter();
  const getTodayQueue = useAppStore((state) => state.getTodayQueue);
  const flashcards = useAppStore((state) => state.flashcards);
  const concepts = useAppStore((state) => state.concepts);
  const recordReviewResult = useAppStore((state) => state.recordReviewResult);

  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const items = getTodayQueue();
    setQueue(items);
  }, [getTodayQueue]);

  if (queue.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CPHeader subtitle="Review session" />
        <View style={styles.emptyContainer}>
          <CPCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>You&apos;re clear for now</Text>
            <Text style={styles.emptySubtext}>
              Check back later for more review items
            </Text>
            <CPButton
              title="Back to Today"
              onPress={() => router.back()}
              style={styles.backButton}
            />
          </CPCard>
        </View>
      </SafeAreaView>
    );
  }

  const currentItem = queue[currentIndex];
  const totalItems = queue.length;

  const handleAnswer = (result: "correct" | "incorrect") => {
    recordReviewResult(currentItem.id, result);
    if (result === "correct") {
      setCorrectCount((prev) => prev + 1);
    }

    if (currentIndex + 1 >= totalItems) {
      router.replace(
        `/study/result?total=${totalItems}&correct=${result === "correct" ? correctCount + 1 : correctCount}`,
      );
    } else {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const renderContent = () => {
    if (currentItem.type === "flashcard") {
      const flashcard = flashcards.find((f) => f.id === currentItem.refId);
      if (!flashcard) return null;

      return (
        <Pressable onPress={() => setShowAnswer(true)}>
          <CPCard style={styles.contentCard}>
            <Text style={styles.cardLabel}>Flashcard</Text>
            <Text style={styles.questionText}>{flashcard.front}</Text>
            {showAnswer && (
              <View style={styles.answerSection}>
                <View style={styles.divider} />
                <Text style={styles.answerText}>{flashcard.back}</Text>
              </View>
            )}
            {!showAnswer && (
              <Text style={styles.tapHint}>Tap to reveal answer</Text>
            )}
          </CPCard>
        </Pressable>
      );
    } else if (currentItem.type === "concept") {
      const concept = concepts.find((c) => c.id === currentItem.refId);
      if (!concept) return null;

      return (
        <CPCard style={styles.contentCard}>
          <Text style={styles.cardLabel}>Concept review</Text>
          <Text style={styles.conceptTitle}>{concept.title}</Text>
          {concept.bullets.map((bullet, i) => (
            <Text key={i} style={styles.bulletText}>
              • {bullet}
            </Text>
          ))}
        </CPCard>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CPHeader subtitle="Review session" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <CPProgressBar
          current={currentIndex + 1}
          total={totalItems}
          style={styles.progress}
        />

        {renderContent()}

        {(showAnswer || currentItem.type === "concept") && (
          <View style={styles.buttonRow}>
            <CPButton
              title="Incorrect"
              onPress={() => handleAnswer("incorrect")}
              style={[styles.button, styles.incorrectButton]}
            />
            <CPButton
              title="Correct"
              onPress={() => handleAnswer("correct")}
              style={[styles.button, styles.correctButton]}
            />
          </View>
        )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  emptyCard: {
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  backButton: {
    minWidth: 200,
  },
  progress: {
    marginBottom: theme.spacing.xl,
  },
  contentCard: {
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    minHeight: 200,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: theme.spacing.md,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    lineHeight: 26,
  },
  answerSection: {
    marginTop: theme.spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  answerText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  tapHint: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
    textAlign: "center",
    fontStyle: "italic",
  },
  conceptTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  bulletText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
  incorrectButton: {},
  correctButton: {},
});
