import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { auth } from "../config/firebase";

export default function CustomDrawer(props) {
  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            await signOut(auth);

            // 🔥 IMPORTANT FIX
            props.navigation.replace("Login");
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../assets/school-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>MinnConnect</Text>
        <Text style={styles.subtitle}>Student Portal</Text>
      </View>

      {/* MENU ITEMS */}
      <DrawerItemList {...props} />

      {/* LOGOUT BUTTON */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textLight,
  },
  subtitle: {
    color: colors.textLight,
    fontSize: 13,
    marginTop: 2,
  },

  logoutContainer: {
    marginTop: "auto",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
  },
});
