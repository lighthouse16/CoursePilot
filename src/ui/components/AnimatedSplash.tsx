import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { theme } from "../../../constants/theme";
import { CPLogoMark } from "./CPLogoMark";
import { GradientText } from "./GradientText";

interface AnimatedSplashProps {
  onComplete: () => void;
}

export function AnimatedSplash({ onComplete }: AnimatedSplashProps) {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo animation sequence
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 600, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) }),
    );

    logoOpacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });

    logoRotate.value = withSequence(
      withTiming(360, { duration: 800, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(360, { duration: 0 }),
    );

    // Text animation (delayed)
    textOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
    );

    textTranslateY.value = withDelay(
      400,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );

    // Fade out entire screen
    backgroundOpacity.value = withDelay(
      2000,
      withTiming(
        0,
        { duration: 400, easing: Easing.inOut(Easing.ease) },
        (finished) => {
          if (finished) {
            runOnJS(onComplete)();
          }
        },
      ),
    );
  }, [
    backgroundOpacity,
    logoOpacity,
    logoRotate,
    logoScale,
    onComplete,
    textOpacity,
    textTranslateY,
  ]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <CPLogoMark size={120} />
        </Animated.View>

        <Animated.View style={textAnimatedStyle}>
          <GradientText style={styles.appName}>CoursePilot</GradientText>
        </Animated.View>

        <Animated.Text style={[styles.tagline, textAnimatedStyle]}>
          Your AI Study Companion
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  content: {
    alignItems: "center",
    gap: theme.spacing.lg,
  },
  logoContainer: {
    marginBottom: theme.spacing.md,
  },
  appName: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.subtext,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
