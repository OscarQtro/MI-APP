import React from "react";
import { Pressable, View, Image, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  image?: any;          // require('…') o { uri: '…' }
  onPress?: () => void;
};

export default function ActivityCard({ title, subtitle, image, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]} onPress={onPress}>
      <View style={styles.posterWrap}>
        {image ? (
          <Image source={image} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={styles.posterFallback} />
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#ffcfdd",
    borderRadius: 16,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  posterWrap: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 140,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  poster: { width: "100%", height: "100%" },
  posterFallback: { width: "70%", height: "70%", backgroundColor: "#e6e6e6", borderRadius: 8 },
  title: { fontWeight: "900", fontSize: 22, color: "#2b2b2b" },
  subtitle: { marginTop: 2, fontWeight: "700", color: "#493b2a" },
});
