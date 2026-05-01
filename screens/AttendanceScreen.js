// screens/AttendanceScreen.js
import React, { useContext, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import colors from "../theme/colors";
import { MyKidsContext } from "../context/MyKidsContext";
import { db } from "../config/firebase";
import {
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export default function AttendanceScreen() {
  const { selectedChild } = useContext(MyKidsContext);
  const [attendanceData, setAttendanceData] = useState({}); // { "YYYY-MM-DD": "Present" }

  useEffect(() => {
    if (!selectedChild?.id) return;

    // Read records across all dates:
    // schools/minnconnect/attendance/{date}/records/{studentId}
    const q = query(
      collectionGroup(db, "records"),
      where("studentId", "==", selectedChild.id),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = {};
      snap.forEach((d) => {
        const row = d.data();
        if (row?.date) data[row.date] = row.status;
      });
      setAttendanceData(data);
    });

    return () => unsub();
  }, [selectedChild?.id]);

  const stats = useMemo(() => {
    let present = 0,
      absent = 0,
      tardy = 0;

    Object.values(attendanceData).forEach((s) => {
      if (s === "Present") present++;
      if (s === "Absent") absent++;
      if (s === "Tardy") tardy++;
    });

    const total = present + absent + tardy;
    const rate = total ? Math.round((present / total) * 100) : 0;

    return { present, absent, tardy, rate };
  }, [attendanceData]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Attendance — {selectedChild?.name}</Text>
      <Text style={styles.sub}>Live sync (teacher marked)</Text>

      <View style={styles.summaryRow}>
        <Stat label="Present" value={stats.present} color="#2ecc71" />
        <Stat label="Tardy" value={stats.tardy} color="#f39c12" />
        <Stat label="Absent" value={stats.absent} color="#e74c3c" />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.rate}>Attendance Rate: {stats.rate}%</Text>
      </View>

      <View style={styles.listCard}>
        <Text style={styles.listTitle}>Recent Days</Text>
        {Object.keys(attendanceData).length === 0 ? (
          <Text style={styles.empty}>No attendance records yet.</Text>
        ) : (
          Object.entries(attendanceData)
            .slice(0, 14)
            .map(([date, status]) => (
              <View key={date} style={styles.row}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.status}>{status}</Text>
              </View>
            ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Stat({ label, value, color }) {
  return (
    <View style={[styles.statBox, { borderColor: color }]}>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  heading: { fontSize: 22, fontWeight: "800", color: colors.primary },
  sub: { color: "#666", marginTop: 4 },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },

  statBox: {
    width: "31%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  statNumber: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 13, color: "#555" },

  infoCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 12,
  },
  rate: { fontSize: 16, fontWeight: "800" },

  listCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  listTitle: { fontWeight: "900", marginBottom: 10 },
  empty: { color: "#666" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  date: { fontWeight: "800", color: colors.textDark },
  status: { fontWeight: "800", color: "#444" },
});
