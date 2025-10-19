import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemedStyles } from "../../../hooks/useThemedStyles";

interface ActivityLayoutProps {
  title: string;
  subtitle?: string;
  progress?: number;
  children: React.ReactNode;
}

export default function ActivityLayout({
  title,
  subtitle,
  progress = 0,
  children,
}: ActivityLayoutProps) {
  const { theme, fontSizes, screenReaderEnabled, speakText } = useThemedStyles();

  const handleTitlePress = () => {
    if (screenReaderEnabled) {
      speakText(`Actividad: ${title}${subtitle ? `. ${subtitle}` : ''}`);
    }
  };

  const handleProgressPress = () => {
    if (progress > 0 && screenReaderEnabled) {
      speakText(`Progreso: ${Math.round(progress * 100)} porciento completado`);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      showsVerticalScrollIndicator={false}
      accessible={true}
      accessibilityLabel={`Actividad ${title}`}
    >
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGrad}
        >
          <Text 
            style={[
              styles.title, 
              { 
                color: theme.colors.textLight,
                fontSize: fontSizes.title
              }
            ]}
            onPress={handleTitlePress}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel={`Título de actividad: ${title}`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              style={[
                styles.subtitle, 
                { 
                  color: theme.colors.textLight,
                  fontSize: fontSizes.subtitle
                }
              ]}
              accessible={true}
              accessibilityLabel={`Descripción: ${subtitle}`}
            >
              {subtitle}
            </Text>
          )}
        </LinearGradient>
      </View>

      {/* Progress Bar */}
      {progress > 0 && (
        <View 
          style={styles.progressContainer}
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
          onTouchEnd={handleProgressPress}
        >
          <View style={[styles.progressBg, { backgroundColor: theme.colors.surface }]}>
            <LinearGradient
              colors={[theme.colors.success, theme.colors.info]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <Text 
            style={[
              styles.progressText, 
              { 
                color: theme.colors.textPrimary,
                fontSize: fontSizes.caption
              }
            ]}
            accessible={true}
            accessibilityLabel={`Progreso: ${Math.round(progress * 100)} porciento`}
          >
            {Math.round(progress * 100)}%
          </Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginBottom: 16 },
  headerGrad: { padding: 16, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "900", color: "#fff", textAlign: "center" },
  subtitle: { fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.9)", textAlign: "center", marginTop: 4 },
  progressContainer: { marginHorizontal: 16, marginBottom: 16 },
  progressBg: { height: 8, backgroundColor: "#e5e5e5", borderRadius: 8 },
  progressFill: { height: 8, borderRadius: 8 },
  progressText: { textAlign: "center", marginTop: 8, fontWeight: "700" },
  content: { flex: 1, paddingHorizontal: 16 },
});
