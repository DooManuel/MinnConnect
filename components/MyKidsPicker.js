import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import colors from "../theme/colors";
import { MyKidsContext } from "../context/MyKidsContext";

export default function MyKidsPicker() {
  const { kids, selectedChild, setSelectedChild } = useContext(MyKidsContext);

  if (!kids || kids.length === 0) return null;

  return (
    <View style={styles.container}>
      {kids.map(k => (
        <TouchableOpacity
          key={k.id}
          onPress={() => setSelectedChild(k)}
          style={[
            styles.kidBtn,
            selectedChild?.id === k.id && styles.kidBtnActive,
          ]}
        >
          <Text
            style={[
              styles.kidText,
              selectedChild?.id === k.id && styles.kidTextActive,
            ]}
          >
            {k.name.split(" ")[0]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 6 },
  kidBtn: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 8 : 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "transparent",
  },
  kidBtnActive: {
    backgroundColor: colors.primary,
  },
  kidText: {
    color: colors.textDark,
    fontWeight: "600",
  },
  kidTextActive: {
    color: colors.textLight,
  },
});
