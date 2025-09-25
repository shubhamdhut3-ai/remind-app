import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeFrontScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medicine </Text>
      <Text>Name: Paracetamol</Text>
      <Text>Dosage: 500mg every 6 hours</Text>
      {/* Add more detailed information or fetch from API */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 }
});