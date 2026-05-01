import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import colors from "../theme/colors";

const THREADS_KEY = "CHAT_THREADS_V1";
const MESSAGES_KEY_PREFIX = "CHAT_MESSAGES_";

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export default function ChatRoomScreen({ route }) {
  const threadId = route.params?.threadId;
  const messagesKey = `${MESSAGES_KEY_PREFIX}${threadId}`;

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [teacherTyping, setTeacherTyping] = useState(false);
  const [viewerImage, setViewerImage] = useState(null);

  const listRef = useRef(null);

  /* ---------- LOAD ---------- */
  const loadMessages = async () => {
    const raw = await AsyncStorage.getItem(messagesKey);

    if (!raw) {
      const initial = [
        {
          id: "m1",
          from: "teacher",
          type: "text",
          text: "Hello! How can I help you today?",
          time: nowTime(),
          status: "read",
        },
      ];
      await AsyncStorage.setItem(messagesKey, JSON.stringify(initial));
      setMessages(initial);
      return;
    }

    setMessages(JSON.parse(raw));
  };

  useEffect(() => {
    loadMessages();
  }, [threadId]);

  const saveMessages = async (next) => {
    setMessages(next);
    await AsyncStorage.setItem(messagesKey, JSON.stringify(next));
    setTimeout(
      () => listRef.current?.scrollToOffset({ offset: 0, animated: true }),
      50
    );
  };

  /* ---------- SEND TEXT ---------- */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const myMsg = {
      id: `m_${Date.now()}`,
      from: "parent",
      type: "text",
      text: text.trim(),
      time: nowTime(),
      status: "sent",
    };

    setText("");
    await saveMessages([myMsg, ...messages]);

    // typing indicator
    setTeacherTyping(true);

    setTimeout(async () => {
      const reply = {
        id: `t_${Date.now()}`,
        from: "teacher",
        type: "text",
        text: "Thanks for the message — I’ll check and get back to you.",
        time: nowTime(),
        status: "read",
      };

      setTeacherTyping(false);
      await saveMessages([reply, ...messages.map(m =>
        m.from === "parent" ? { ...m, status: "read" } : m
      )]);
    }, 1500);
  };

  /* ---------- SEND IMAGE ---------- */
  const sendImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled) return;

    const myMsg = {
      id: `img_${Date.now()}`,
      from: "parent",
      type: "image",
      uri: result.assets[0].uri,
      time: nowTime(),
      status: "sent",
    };

    await saveMessages([myMsg, ...messages]);
  };

  /* ---------- RENDER MESSAGE ---------- */
  const renderItem = ({ item }) => {
    const isMe = item.from === "parent";

    return (
      <View
        style={[
          styles.msgRow,
          isMe ? styles.rowMe : styles.rowOther,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMe ? styles.bubbleMe : styles.bubbleOther,
          ]}
        >
          {item.type === "image" ? (
            <TouchableOpacity onPress={() => setViewerImage(item.uri)}>
              <Image source={{ uri: item.uri }} style={styles.imageMsg} />
            </TouchableOpacity>
          ) : (
            <Text
              style={[
                styles.msgText,
                isMe ? styles.textMe : styles.textOther,
              ]}
            >
              {item.text}
            </Text>
          )}

          <View style={styles.metaRow}>
            <Text style={styles.time}>{item.time}</Text>
            {isMe && (
              <Text style={styles.receipt}>
                {item.status === "read" ? "✓✓" : "✓"}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {/* FULL SCREEN IMAGE VIEWER */}
      <Modal visible={!!viewerImage} transparent>
        <Pressable
          style={styles.viewerOverlay}
          onPress={() => setViewerImage(null)}
        >
          <Image
            source={{ uri: viewerImage }}
            style={styles.viewerImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          inverted
          ListHeaderComponent={
            teacherTyping ? (
              <View style={styles.typingWrap}>
                <Text style={styles.typingText}>Teacher is typing…</Text>
              </View>
            ) : null
          }
        />

        <View style={styles.inputRow}>
          <TouchableOpacity onPress={sendImage} style={styles.imageBtn}>
            <Text style={{ fontSize: 18 }}>📷</Text>
          </TouchableOpacity>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message…"
            style={styles.input}
          />

          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  msgRow: { paddingHorizontal: 12, marginBottom: 10 },
  rowMe: { alignItems: "flex-end" },
  rowOther: { alignItems: "flex-start" },

  bubble: {
    maxWidth: "82%",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bubbleOther: {
    backgroundColor: "#fff",
    borderColor: colors.lightGray,
  },

  msgText: { fontSize: 14 },
  textMe: { color: "#fff", fontWeight: "600" },
  textOther: { color: colors.textDark, fontWeight: "600" },

  imageMsg: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },

  metaRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
  },
  time: { fontSize: 11, color: "rgba(255,255,255,0.85)" },
  receipt: { fontSize: 12, color: "#fff", fontWeight: "800" },

  typingWrap: {
    margin: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  typingText: { fontSize: 12, color: "#666" },

  inputRow: {
    flexDirection: "row",
    padding: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 999,
    paddingHorizontal: 14,
  },
  imageBtn: {
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    borderRadius: 999,
    justifyContent: "center",
  },
  sendText: { color: "#fff", fontWeight: "800" },

  viewerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  viewerImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
