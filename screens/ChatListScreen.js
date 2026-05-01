import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../theme/colors";

const THREADS_KEY = "CHAT_THREADS_V1";
const MESSAGES_KEY_PREFIX = "CHAT_MESSAGES_"; // + threadId

const defaultThreads = [
  { id: "t_class_teacher", title: "Class Teacher", subtitle: "Primary 3A", lastMessage: "Good afternoon!", unread: 1 },
  { id: "t_math_teacher", title: "Math Teacher", subtitle: "Homework & quizzes", lastMessage: "Please revise addition.", unread: 0 },
  { id: "t_admin", title: "School Admin", subtitle: "Announcements", lastMessage: "PTA meeting Friday.", unread: 2 },
];

export default function ChatListScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadThreads = async () => {
    const raw = await AsyncStorage.getItem(THREADS_KEY);
    if (!raw) {
      await AsyncStorage.setItem(THREADS_KEY, JSON.stringify(defaultThreads));
      setThreads(defaultThreads);
      return;
    }
    setThreads(JSON.parse(raw));
  };

  useEffect(() => {
    loadThreads();
    const unsubscribe = navigation.addListener("focus", loadThreads);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    await loadThreads();
    setRefreshing(false);
  };

  const openThread = (t) => {
    navigation.navigate("ChatRoom", { threadId: t.id, title: t.title });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.row} onPress={() => openThread(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.sub}>{item.subtitle}</Text>
        <Text style={styles.last} numberOfLines={1}>{item.lastMessage}</Text>
      </View>

      {item.unread > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unread}</Text>
        </View>
      ) : (
        <Text style={styles.readLabel}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <Text style={styles.headerText}>
            Tap a teacher to chat. Unread messages show on the right.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  headerText: { color: "#666", marginBottom: 12 },

  row: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 16, fontWeight: "800", color: colors.textDark },
  sub: { marginTop: 2, color: "#666", fontSize: 13 },
  last: { marginTop: 6, color: "#333", fontSize: 13 },

  badge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  readLabel: { color: "#999", fontWeight: "700" },
});
