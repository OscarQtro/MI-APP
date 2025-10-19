import React from "react";
import { Pressable, View, Image, Text, StyleSheet } from "react-native";
import { useThemedStyles } from "../../hooks/useThemedStyles";

type Props = {
  title: string;
  subtitle?: string;
  image?: any;          // require('…') o { uri: '…' }
  onPress?: () => void;
};

export default function ActivityCard({ title, subtitle, image, onPress }: Props) {
  const { theme, fontSizes, highContrast } = useThemedStyles();

  const dynamicStyles = StyleSheet.create({
    card: {
      width: "48%",
      backgroundColor: highContrast ? theme.colors.background : "#ffcfdd",
      borderRadius: 16,
      padding: 12,
      elevation: 3,
      shadowColor: theme.colors.shadow,
      shadowOpacity: highContrast ? 0.8 : 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      borderWidth: highContrast ? 2 : 0,
      borderColor: theme.colors.border,
    },
    posterWrap: {
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: theme.colors.surface,
      height: 140,
      marginBottom: 8,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: highContrast ? 1 : 0,
      borderColor: theme.colors.border,
    },
    poster: { 
      width: "100%", 
      height: "100%",
      opacity: highContrast ? 0.9 : 1,
    },
    posterFallback: { 
      width: "70%", 
      height: "70%", 
      backgroundColor: theme.colors.border, 
      borderRadius: 8,
    },
    title: { 
      fontWeight: "900", 
      fontSize: fontSizes.title * 0.9, 
      color: theme.colors.textPrimary,
    },
    subtitle: { 
      marginTop: 2, 
      fontWeight: "700", 
      fontSize: fontSizes.subtitle,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <Pressable 
      style={({ pressed }) => [
        dynamicStyles.card, 
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
      ]} 
      onPress={onPress}
    >
      <View style={dynamicStyles.posterWrap}>
        {image ? (
          <Image source={image} style={dynamicStyles.poster} resizeMode="cover" />
        ) : (
          <View style={dynamicStyles.posterFallback} />
        )}
      </View>
      <Text style={dynamicStyles.title} numberOfLines={1}>{title}</Text>
      {subtitle ? <Text style={dynamicStyles.subtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

// Estilos base eliminados - ahora se usan los dinámicos
