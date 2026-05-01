import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.subtitle}>Welcome to your profile page!</Text>
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
