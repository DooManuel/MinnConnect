import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import colors from "../theme/colors";
import { MyKidsContext } from "../context/MyKidsContext";

export default function HomeworkScreen() {
  const { selectedChild } = useContext(MyKidsContext);

  const [homework, setHomework] = useState([
    {
      id: "hw1",
      subject: "Math",
      title: "Addition Worksheet",
      dueDate: "Dec 8",
      status: "SUBMITTED",
      teacherComment: "",
    },
    {
      id: "hw2",
      subject: "English",
      title: "Reading Practice",
      dueDate: "Dec 7",
      status: "NEEDS_REVISION",
      teacherComment: "Please re-read page 4 aloud.",
    },
  ]);

  const [uploadingFor, setUploadingFor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------- permissions ---------- */
  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  /* ---------- helpers ---------- */
  const statusColor = (status) => {
    if (status === "APPROVED") return "#2ecc71";
    if (status === "SUBMITTED") return "#f1c40f";
    if (status === "NEEDS_REVISION") return "#e74c3c";
    return "#aaa";
  };

  /* ---------- image picker ---------- */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  /* ---------- submit ---------- */
  const submitHomework = () => {
    if (!selectedImage) {
      Alert.alert("No image", "Please upload a photo of the homework.");
      return;
    }

    setHomework((prev) =>
      prev.map((hw) =>
        hw.id === uploadingFor
          ? { ...hw, status: "SUBMITTED", teacherComment: "" }
          : hw
      )
    );

    Alert.alert("Submitted", "Teacher will review shortly.");

    const hwId = uploadingFor;

    setSelectedImage(null);
    setUploadingFor(null);

    // simulate teacher review after upload
    setTimeout(() => simulateTeacherReview(hwId), 3000);
  };

  /* ---------- teacher review (used by upload + refresh) ---------- */
  const simulateTeacherReview = (specificId = null) => {
    setHomework((prev) =>
      prev.map((hw) => {
        if (
          (specificId && hw.id !== specificId) ||
          (!specificId && hw.status !== "SUBMITTED")
        )
          return hw;

        const approved = Math.random() > 0.4;

        return {
          ...hw,
          status: approved ? "APPROVED" : "NEEDS_REVISION",
          teacherComment: approved ? "" : "Please redo question 2 neatly.",
        };
      })
    );
  };

  /* ---------- pull to refresh ---------- */
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      simulateTeacherReview();
      setRefreshing(false);
    }, 1200);
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
        Homework — {selectedChild?.name}
      </Text>

      {homework.map((hw) => (
        <View key={hw.id} style={styles.card}>
          <Text style={styles.subject}>{hw.subject}</Text>
          <Text style={styles.title}>{hw.title}</Text>
          <Text style={styles.due}>Due: {hw.dueDate}</Text>

          <View
            style={[
              styles.badge,
              { backgroundColor: statusColor(hw.status) },
            ]}
          >
            <Text style={styles.badgeText}>{hw.status}</Text>
          </View>

          {hw.teacherComment !== "" && (
            <Text style={styles.comment}>💬 {hw.teacherComment}</Text>
          )}

          {hw.status !== "APPROVED" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setUploadingFor(hw.id)}
            >
              <Text style={styles.buttonText}>
                {hw.status === "NEEDS_REVISION"
                  ? "Re-upload Homework"
                  : "Upload Homework"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* ---------- UPLOAD MODAL ---------- */}
      <Modal visible={!!uploadingFor} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Upload Homework</Text>

            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.preview} />
            )}

            <TouchableOpacity style={styles.modalBtn} onPress={takePhoto}>
              <Text style={styles.modalBtnText}>📸 Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBtn} onPress={pickImage}>
              <Text style={styles.modalBtnText}>🖼️ Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={submitHomework}
            >
              <Text style={styles.submitText}>Submit Homework</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setUploadingFor(null);
                setSelectedImage(null);
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  subject: { fontSize: 14, color: "#666" },
  title: { fontSize: 16, fontWeight: "700", marginVertical: 4 },
  due: { fontSize: 13, color: "#666", marginBottom: 8 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  comment: { fontSize: 14, color: "#333", marginBottom: 10 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalBtn: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalBtnText: {
    textAlign: "center",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  cancel: {
    marginTop: 12,
    textAlign: "center",
    color: "#666",
  },
});
