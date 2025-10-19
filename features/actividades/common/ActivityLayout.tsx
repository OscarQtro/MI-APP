import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function ActivityLayout({
  title, subtitle, progress = 0, children, onExit,
}: {
  title: string; subtitle?: string; progress?: number; children: React.ReactNode; onExit?: () => void;
}) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Pressable onPress={onExit ?? (() => router.back())} style={styles.exitBtn}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>Salir</Text>
        </Pressable>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${Math.min(100, progress*100)}%` }]} />
      </View>

      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "900" },
  subtitle: { color: "#444", fontWeight: "700" },
  exitBtn: { backgroundColor: "#f45b69", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  progressTrack: { height: 8, backgroundColor: "#e5e5e5", borderRadius: 8, marginTop: 12 },
  progressBar: { height: 8, backgroundColor: "#4CAF50", borderRadius: 8 },
  body: { flex: 1, marginTop: 16 },
});
