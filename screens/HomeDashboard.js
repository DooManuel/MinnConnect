import React, { useContext, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import colors from "../theme/colors";
import MyKidsPicker from "../components/MyKidsPicker";
import { MyKidsContext } from "../context/MyKidsContext";

/* ---------- Reusable ---------- */
function SummaryCard({ title, value }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function TimelineItem({ time, title, desc }) {
  return (
    <View style={styles.timelineItem}>
      <Text style={styles.timelineTime}>{time}</Text>
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{title}</Text>
        {!!desc && <Text style={styles.timelineDesc}>{desc}</Text>}
      </View>
    </View>
  );
}

function QuickAction({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- Activity ---------- */
function ActivityItem({ item }) {
  return (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityIcon}>{item.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
      </View>

      <Text style={styles.activityDesc}>{item.desc}</Text>

      <View style={styles.reactionRow}>
        <Text style={styles.reaction}>❤️ {item.likes}</Text>
        <Text style={styles.reaction}>👏 {item.claps}</Text>
        <Text style={styles.reaction}>⭐ {item.stars}</Text>
      </View>
    </View>
  );
}

/* ---------- DAILY SCHOOL FEED (NEW) ---------- */
function FeedPost({ post }) {
  return (
    <View style={styles.feedCard}>
      <View style={styles.feedImage}>
        <Text style={styles.feedImageText}>📸 Photo</Text>
      </View>

      <View style={styles.feedContent}>
        <Text style={styles.feedCaption}>{post.caption}</Text>
        <Text style={styles.feedTime}>{post.time}</Text>

        <View style={styles.feedActions}>
          <Text style={styles.feedReaction}>❤️ {post.likes}</Text>
          <Text style={styles.feedReaction}>💬 {post.comments}</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeDashboard({ navigation }) {
  const { selectedChild } = useContext(MyKidsContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    const attendance = Object.values(selectedChild?.attendance || {});
    const present = attendance.filter((v) => v === "Present").length;
    const total = attendance.length || 0;

    return {
      attendancePct: total ? Math.round((present / total) * 100) : 0,
      homeworkDue: selectedChild?.id === "kid2" ? 1 : 2,
      grades: selectedChild?.grades?.length || 0,
      rewards: selectedChild?.rewards?.length || 0,
      messages: selectedChild?.id === "kid2" ? 0 : 1,
    };
  }, [selectedChild]);

  /* ---------- Activity Feed ---------- */
  const activityFeed = useMemo(() => {
    if (!selectedChild) return [];
    return [
      {
        id: "a1",
        icon: "🧪",
        title: "Science Lab",
        desc: "Completed the experiment successfully.",
        time: "Today • 11:30 AM",
        likes: 5,
        claps: 4,
        stars: 2,
      },
    ];
  }, [selectedChild]);

  /* ---------- DAILY SCHOOL FEED DATA ---------- */
  const dailyFeed = useMemo(() => {
    return [
      {
        id: "p1",
        caption: "Students enjoying science experiments today 🧪",
        time: "Today • 11:45 AM",
        likes: 12,
        comments: 3,
      },
      {
        id: "p2",
        caption: "Morning assembly & announcements 🎤",
        time: "Today • 8:15 AM",
        likes: 8,
        comments: 1,
      },
    ];
  }, []);

  /* ---------- Timeline ---------- */
  const todayTimeline = useMemo(() => {
    if (!selectedChild) return [];
    return [
      { time: "8:00 AM", title: "Present", desc: "Attendance marked" },
      { time: "9:00 AM", title: "Mathematics", desc: "Fractions lesson" },
      { time: "11:30 AM", title: "Science Lab" },
    ];
  }, [selectedChild]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <MyKidsPicker />

      <Text style={styles.welcome}>Welcome — {selectedChild?.name}</Text>
      <Text style={styles.subWelcome}>{selectedChild?.className} • Today</Text>

      {/* Summary */}
      <View style={styles.grid}>
        <SummaryCard title="Homework" value={`${stats.homeworkDue} due`} />
        <SummaryCard title="Attendance" value={`${stats.attendancePct}%`} />
        <SummaryCard title="Grades" value={stats.grades} />
        <SummaryCard title="Rewards" value={stats.rewards} />
        <SummaryCard title="Messages" value={stats.messages} />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <QuickAction icon="📘" label="Homework" onPress={() => navigation.navigate("Homework")} />
        <QuickAction icon="🗓️" label="Attendance" onPress={() => navigation.navigate("Attendance")} />
        <QuickAction icon="🎓" label="Grades" onPress={() => navigation.navigate("Grades")} />
        <QuickAction icon="⭐" label="Rewards" onPress={() => navigation.navigate("Rewards")} />
      </View>

      {/* Daily Feed */}
      <Text style={styles.sectionTitle}>Daily School Feed</Text>
      {dailyFeed.map((p) => (
        <FeedPost key={p.id} post={p} />
      ))}

      {/* Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {activityFeed.map((a) => (
        <ActivityItem key={a.id} item={a} />
      ))}

      {/* Timeline */}
      <Text style={styles.sectionTitle}>Today at School</Text>
      <View style={styles.timelineBox}>
        {todayTimeline.map((t, i) => (
          <TimelineItem key={i} {...t} />
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },

  welcome: { fontSize: 22, fontWeight: "900", color: colors.primary },
  subWelcome: { color: "#666", marginBottom: 16, fontWeight: "600" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  summaryTitle: { color: "#666", fontWeight: "800" },
  summaryValue: { fontSize: 22, fontWeight: "900" },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "900",
  },

  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  actionBtn: {
    width: "48%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  actionIcon: { fontSize: 26 },
  actionText: { fontWeight: "800" },

  /* Activity */
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 12,
  },
  activityHeader: { flexDirection: "row", gap: 10 },
  activityIcon: { fontSize: 26 },
  activityTitle: { fontWeight: "800" },
  activityTime: { fontSize: 12, color: "#777" },
  activityDesc: { marginTop: 8, color: "#555" },
  reactionRow: { flexDirection: "row", gap: 14, marginTop: 10 },
  reaction: { fontWeight: "700", color: "#444" },

  /* Feed */
  feedCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 16,
    overflow: "hidden",
  },
  feedImage: {
    height: 180,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  feedImageText: { fontSize: 32, opacity: 0.6 },
  feedContent: { padding: 14 },
  feedCaption: { fontWeight: "600" },
  feedTime: { fontSize: 12, color: "#777", marginTop: 4 },
  feedActions: { flexDirection: "row", gap: 16, marginTop: 10 },
  feedReaction: { fontWeight: "700" },

  timelineBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  timelineItem: { flexDirection: "row", marginBottom: 10 },
  timelineTime: { width: 70, fontWeight: "800", color: colors.primary },
  timelineTitle: { fontWeight: "800" },
  timelineDesc: { fontSize: 13, color: "#666" },
});
