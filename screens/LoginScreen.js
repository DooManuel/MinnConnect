import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import colors from "../theme/colors";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // ✅ FIX: use reset instead of replace
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      });
    } catch (err) {
      Alert.alert("Login error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/school-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>MinnConnect Login</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {/* LOGIN BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fafafa",
    width: "100%",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: colors.primary,
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
