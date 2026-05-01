// screens/GradesScreen.js
import React, { useContext, useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import * as Progress from "react-native-progress";
import colors from "../theme/colors";
import { MyKidsContext } from "../context/MyKidsContext";

/* ---------- helpers ---------- */
const getGradeInfo = (score) => {
  if (score >= 90) return { letter: "A", color: "#2ecc71" };
  if (score >= 80) return { letter: "B", color: "#3498db" };
  if (score >= 70) return { letter: "C", color: "#f1c40f" };
  return { letter: "D", color: "#e74c3c" };
};

export default function GradesScreen() {
  const { selectedChild } = useContext(MyKidsContext);
  const [refreshing, setRefreshing] = useState(false);

  // grades come from selected child
  const grades = selectedChild?.grades || [];

  /* ---------- overall average ---------- */
  const averageScore = useMemo(() => {
    if (grades.length === 0) return 0;
    return Math.round(
      grades.reduce((sum, g) => sum + g.score, 0) / grades.length
    );
  }, [grades]);

  const avgGrade = getGradeInfo(averageScore);

  /* ---------- refresh ---------- */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
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
        Grades — {selectedChild?.name}
      </Text>

      {/* ---------- SUMMARY CARD ---------- */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Overall Performance</Text>
        <Text style={[styles.averageScore, { color: avgGrade.color }]}>
          {averageScore}%
        </Text>
        <Text style={styles.averageLetter}>
          Grade: {avgGrade.letter}
        </Text>
      </View>

      {/* ---------- SUBJECT GRADES ---------- */}
      {grades.map((item) => {
        const grade = getGradeInfo(item.score);

        return (
          <View key={item.subject} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.subject}>{item.subject}</Text>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: grade.color },
                ]}
              >
                <Text style={styles.badgeText}>{grade.letter}</Text>
              </View>
            </View>

            <Text style={styles.scoreText}>{item.score}%</Text>

            <Progress.Bar
              progress={item.score / 100}
              width={null}
              height={10}
              borderRadius={6}
              color={grade.color}
              unfilledColor="#eee"
              borderWidth={0}
              style={{ marginVertical: 10 }}
            />

            {item.comment && (
              <Text style={styles.comment}>💬 {item.comment}</Text>
            )}
          </View>
        );
      })}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },

  header: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 16,
  },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.lightGray,
    alignItems: "center",
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 6,
  },

  averageScore: {
    fontSize: 36,
    fontWeight: "900",
  },

  averageLetter: {
    fontSize: 16,
    fontWeight: "700",
    color: "#555",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subject: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textDark,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  scoreText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },

  comment: {
    marginTop: 6,
    fontSize: 14,
    color: "#333",
  },
});
