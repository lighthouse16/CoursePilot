import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

interface GradientTextProps {
  children: string;
  style?: StyleProp<TextStyle>;
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export function GradientText({
  children,
  style,
  colors = ["#4338CA", "#7C3AED", "#EC4899"],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: "transparent" }]}>
          {children}
        </Text>
      }
    >
      <LinearGradient colors={colors} start={start} end={end}>
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}
