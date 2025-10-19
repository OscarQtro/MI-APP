import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ActivityCard from "./ActivityCard";
import { useThemedStyles } from "../../hooks/useThemedStyles";

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
  const { theme, fontSizes } = useThemedStyles();

  const dynamicStyles = StyleSheet.create({
    section: { 
      marginTop: 24, 
      paddingHorizontal: 16,
    },
    sectionTitle: { 
      fontSize: fontSizes.title, 
      fontWeight: "900", 
      color: theme.colors.textPrimary, 
      marginBottom: 12,
      textShadowColor: theme.colors.shadow,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: theme.colors === theme.colors ? 0 : 2,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
    },
  });

  return (
    <View style={dynamicStyles.section}>
      <Text style={dynamicStyles.sectionTitle}>{title}</Text>
      <View style={dynamicStyles.grid}>
        {items.map((item) => (
          <ActivityCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            onPress={item.onPress}
          />
        ))}
      </View>
    </View>
  );
}

// Estilos base eliminados - ahora se usan los dinámicos
