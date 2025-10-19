import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ActivityCard from "./ActivityCard";

type Item = {
  id: string;
  title: string;
  subtitle?: string;
  image?: any;
  onPress: () => void;
};

type Props = {
  title: string;
  items: Item[];
};

export default function SectionGrid({ title, items }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <ActivityCard
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            onPress={item.onPress}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: "#1b1b1b", marginBottom: 12 },
});
