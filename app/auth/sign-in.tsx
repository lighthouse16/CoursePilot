import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { CPLogoMark } from "../../src/ui/components/CPLogoMark";
import { GradientText } from "../../src/ui/components/GradientText";

export default function SignInScreen() {
  const router = useRouter();
  const signIn = useAppStore((state) => state.signIn);
  const signInWithFirebase = useAppStore((state) => state.signInWithFirebase);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address first");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      const { auth } = await import("../../src/config/firebase");
      await sendPasswordResetEmail(auth, email.trim());
      setError(""); // Clear any errors
      alert("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else {
        setError("Failed to send reset email. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (isSignUp && !name.trim()) {
      setError("Name is required for sign up");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (email.trim() && password.trim()) {
        // Firebase auth - pass isSignUp flag
        await signInWithFirebase(
          email.trim(),
          password.trim(),
          name.trim() || "User",
          isSignUp,
        );
      } else {
        // Local sign in (fallback)
        await signIn({
          name: name.trim() || "User",
          email: email.trim() || undefined,
        });
      }

      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Auth error:", err);

      // Handle Firebase auth errors
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Check your internet connection.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <CPLogoMark size={64} />
              <GradientText style={styles.title}>CoursePilot</GradientText>
              <Text style={styles.subtitle}>
                {isSignUp
                  ? "Start your learning journey"
                  : "Continue your journey"}
              </Text>
            </View>

            <View style={styles.form}>
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.colors.textSecondary}
                    autoCapitalize="words"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="off"
                  textContentType="none"
                  autoFocus
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    ref={passwordRef}
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="off"
                    textContentType="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {!isSignUp && (
                <Pressable
                  style={styles.forgotButton}
                  onPress={handleForgotPassword}
                  disabled={loading}
                >
                  <Text style={styles.forgotButtonText}>Forgot password?</Text>
                </Pressable>
              )}

              <Pressable
                style={[
                  styles.button,
                  (!email.trim() || !password.trim() || loading) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!email.trim() || !password.trim() || loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.switchButton}
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
              >
                <Text style={styles.switchButtonText}>
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </Text>
              </Pressable>

              {isSignUp && (
                <Text style={styles.termsText}>
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy
                </Text>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl * 2,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  eyeButton: {
    padding: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: theme.spacing.md + 2,
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  note: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.lg,
    lineHeight: 18,
  },
  switchButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  switchButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  forgotButtonText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  termsText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
    lineHeight: 16,
  },
});
