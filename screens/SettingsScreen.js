import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Customize your MinnConnect experience.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,   // FIXED
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textDark,
  },
});

