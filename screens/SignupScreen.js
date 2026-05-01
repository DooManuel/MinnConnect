import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import colors from "../theme/colors";


export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("User created!");
      navigation.replace("MainApp");
    })
    .catch(error => {
      setError(error.message);
    });
};


  return (
    <View style={styles.container}>
      <Image
    source={require("../assets/school-logo.png")}
    style={styles.logo}
    resizeMode="contain"
  />
      <Text style={styles.title}>Create Your Account</Text>
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

      {/* SIGN UP BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
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

