
import axios from "axios";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

const REMINDER_TIMES = [
  { hour: 8, minute: 0 },
  { hour: 13, minute: 0 },
  { hour: 20, minute: 0 }
];

export default function RemindScreen() {
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    // Listen for notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = {
        id: response.notification.request.identifier,
        action: response.actionIdentifier,
        time: new Date().toISOString(),
      };
      setResponses((prev:any) => [...prev, data]);
      // Save to backend
      axios.post("https://your-backend.com/api/notification-response", data);
    });
    return () => subscription.remove();
  }, []);

  async function scheduleReminders() {
    await Notifications.requestPermissionsAsync();
    for (let i = 0; i < REMINDER_TIMES.length; i++) {
      const { hour, minute } = REMINDER_TIMES[i];
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Medicine Reminder",
          body: `Time to take your medicine! (${hour}:${minute < 10 ? "0" : ""}${minute})`,
          data: { reminderTime: `${hour}:${minute}` }
        },
        trigger: {type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute}
      });
    }
    Alert.alert("Reminders set!");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medicine Reminders</Text>
      <Button title="Set Daily Reminders" onPress={scheduleReminders} />
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Responses:</Text>
      {responses.map((r, idx) => (
        <Text key={idx}>{`${r.time} - ${r.action}`}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 }
});