import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  // In real app, fetch user details from backend or context
  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <Text>Name: John Doe</Text>
      <Text>Email: john@example.com</Text>
      <Text>Age: 30</Text>
      {/* Add more user details and profile editing as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 }
});