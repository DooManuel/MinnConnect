import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MinnConnect 🎉</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
