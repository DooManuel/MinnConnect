import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import colors from "../theme/colors";

const sampleAnnouncements = [
  { id: "1", title: "School Closed Monday", message: "Due to weather conditions." },
  { id: "2", title: "Parent-Teacher Conferences", message: "Scheduled for next week." },
  { id: "3", title: "New Cafeteria Menu", message: "Updated lunch options available." },
];

export default function AnnouncementsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // Later replace with Firestore fetch
    await new Promise(resolve => setTimeout(resolve, 1200));

    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Announcements</Text>

      <FlatList
        data={sampleAnnouncements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}    // Android spinner
            tintColor={colors.primary}   // iOS spinner
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    marginTop: 5,
    fontSize: 16,
  },
});
