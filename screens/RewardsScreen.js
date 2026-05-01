import React, { useContext, useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import colors from "../theme/colors";
import { MyKidsContext } from "../context/MyKidsContext";

export default function RewardsScreen() {
  const { selectedChild } = useContext(MyKidsContext);
  const [refreshing, setRefreshing] = useState(false);

  const rewards = useMemo(() => {
    return selectedChild?.rewards || [];
  }, [selectedChild]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // mock refresh (Firestore later)
    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={styles.header}>
        Rewards & Badges — {selectedChild?.name}
      </Text>

      <Text style={styles.sub}>
        Earn badges for attendance, effort, kindness, and academics.
      </Text>

      {rewards.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No badges yet</Text>
          <Text style={styles.emptyText}>
            Badges will appear here when teachers award them.
          </Text>
        </View>
      ) : (
        rewards
          .slice()
          .sort((a, b) => (a.date < b.date ? 1 : -1))
          .map((r) => (
            <View key={r.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.icon}>{r.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{r.title}</Text>
                  <Text style={styles.desc}>{r.description}</Text>
                </View>
                <Text style={styles.date}>{r.date}</Text>
              </View>

              <View style={styles.tagRow}>
                <Text style={styles.tag}>{r.type.toUpperCase()}</Text>
              </View>
            </View>
          ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 6,
  },
  sub: { color: "#666", marginBottom: 14, fontSize: 14 },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { fontSize: 28, width: 34, textAlign: "center" },
  title: { fontSize: 16, fontWeight: "800", color: colors.textDark },
  desc: { fontSize: 13, color: "#555", marginTop: 2 },
  date: { fontSize: 12, color: "#777", marginLeft: 10 },

  tagRow: { marginTop: 10, flexDirection: "row" },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eef2ff",
    color: "#1a4fc3",
    fontWeight: "800",
    fontSize: 12,
    overflow: "hidden",
  },

  emptyBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: colors.textDark },
  emptyText: { marginTop: 6, color: "#666" },
});
