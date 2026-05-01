// screens/TeacherAttendanceScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import colors from "../theme/colors";
import { auth, db } from "../config/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const STATUS = ["Present", "Absent", "Tardy"];
const SCHOOL_ID = "minnconnect";
const CLASS_ID = "primary3"; // change per teacher later

export default function TeacherAttendanceScreen() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // 🇳🇬 Nigeria date (YYYY-MM-DD)
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-CA", {
        timeZone: "Africa/Lagos",
      }),
    []
  );

  useEffect(() => {
    const loadStudents = async () => {
      const qStudents = query(
        collection(db, "schools", SCHOOL_ID, "students"),
        where("classId", "==", CLASS_ID)
      );

      const snap = await getDocs(qStudents);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStudents(list);
    };

    loadStudents();
  }, []);

  const markStatus = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    try {
      const teacherUid = auth.currentUser?.uid;
      if (!teacherUid) {
        Alert.alert("Not logged in", "Please login as a teacher first.");
        return;
      }

      // Write each student record under:
      // schools/minnconnect/attendance/{today}/records/{studentId}
      for (const s of students) {
        const status = attendance[s.id] || "Present";

        await setDoc(
          doc(db, "schools", SCHOOL_ID, "attendance", today, "records", s.id),
          {
            studentId: s.id,
            status,
            date: today,
            classId: s.classId || CLASS_ID,
            className: s.className || "Primary 3",
            markedBy: teacherUid,
            markedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      Alert.alert("Success", "Attendance saved successfully ✅");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Mark Attendance</Text>
      <Text style={styles.sub}>Class: {CLASS_ID} • Date: {today}</Text>

      {students.map((s) => (
        <View key={s.id} style={styles.card}>
          <Text style={styles.name}>{s.name}</Text>

          <View style={styles.row}>
            {STATUS.map((st) => (
              <TouchableOpacity
                key={st}
                style={[
                  styles.badge,
                  attendance[s.id] === st && styles.activeBadge,
                ]}
                onPress={() => markStatus(s.id, st)}
              >
                <Text
                  style={[
                    styles.badgeText,
                    attendance[s.id] === st && styles.activeText,
                  ]}
                >
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={saveAttendance}>
        <Text style={styles.saveText}>Save Attendance</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  header: { fontSize: 22, fontWeight: "900", color: colors.primary },
  sub: { color: "#666", marginBottom: 16, fontWeight: "700" },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  name: { fontSize: 16, fontWeight: "800", marginBottom: 8 },

  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 6,
  },
  badgeText: { fontWeight: "700", color: "#444" },

  activeBadge: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeText: { color: "#fff" },

  saveBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
