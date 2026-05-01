// screens/CalendarScreen.js
import React, { useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, RefreshControl, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import colors from "../theme/colors";
import { MyKidsContext } from "../context/MyKidsContext";

/*
  Mock school-term events
  Later → Firestore (school admin updates)
*/
const mockEvents = {
  "2025-12-02": { title: "Mid-term Exams", type: "exam" },
  "2025-12-05": { title: "PTA Meeting", type: "meeting" },
  "2025-12-10": { title: "End of Term", type: "holiday" },
  "2025-12-15": { title: "Christmas Break Begins", type: "holiday" },
};

export default function CalendarScreen() {
  const { selectedChild } = useContext(MyKidsContext);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState(mockEvents);
  const [selectedDate, setSelectedDate] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulate refresh (Firestore later)
    setTimeout(() => {
      setEvents({ ...mockEvents });
      setRefreshing(false);
    }, 1000);
  }, []);

  // Build marked dates object
  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor:
        events[date].type === "exam"
          ? "#e74c3c"
          : events[date].type === "meeting"
          ? "#f39c12"
          : colors.primary,
    };
    return acc;
  }, {});

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: colors.primary,
    };
  }

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
        School Calendar — {selectedChild?.name}
      </Text>

      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
          selectedDayTextColor: "#fff",
        }}
      />

      <View style={styles.eventsBox}>
        <Text style={styles.subHeader}>
          {selectedDate ? "Event Details" : "Upcoming Events"}
        </Text>

        {selectedDate && events[selectedDate] ? (
          <View style={styles.eventRow}>
            <Text style={styles.eventDate}>{selectedDate}</Text>
            <Text style={styles.eventTitle}>
              {events[selectedDate].title}
            </Text>
          </View>
        ) : selectedDate ? (
          <Text style={styles.noEvent}>No events on this day</Text>
        ) : (
          Object.entries(events).map(([date, event]) => (
            <View key={date} style={styles.eventRow}>
              <Text style={styles.eventDate}>{date}</Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

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
    marginBottom: 12,
  },
  eventsBox: {
    marginTop: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.textDark,
  },
  eventRow: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  eventDate: {
    fontSize: 12,
    color: "#777",
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  noEvent: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
  },
});
