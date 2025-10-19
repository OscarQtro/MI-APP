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
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

type Props = {
  title: string;
  items: Item[];
};

export default function SectionGrid({ title, items }: Props) {
  const { theme, fontSizes, colorBlindMode, screenReaderEnabled, speakText } = useThemedStyles();

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
      textShadowColor: colorBlindMode ? 'rgba(0,0,0,0.6)' : theme.colors.shadow,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: colorBlindMode ? 2 : 0,
      borderBottomWidth: colorBlindMode ? 2 : 0,
      borderBottomColor: colorBlindMode ? theme.colors.primary : 'transparent',
      paddingBottom: colorBlindMode ? 4 : 0,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
    },
  });

  return (
    <View 
      style={dynamicStyles.section}
      accessibilityRole="list"
      accessibilityLabel={`Sección ${title}`}
    >
      <Text 
        style={dynamicStyles.sectionTitle}
        accessibilityRole="header"
        accessibilityLabel={`Sección ${title}, ${items.length} actividades disponibles`}
      >
        {title}
      </Text>
      <View style={dynamicStyles.grid}>
        {items.map((item, index) => (
          <ActivityCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            onPress={item.onPress}
            accessibilityLabel={item.accessibilityLabel}
            accessibilityHint={item.accessibilityHint}
          />
        ))}
      </View>
    </View>
  );
}

// Estilos base eliminados - ahora se usan los dinámicos
