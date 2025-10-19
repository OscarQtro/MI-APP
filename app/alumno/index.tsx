import React, { useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import SectionGrid from "../../components/ui/SectionGrid";
import Header from "../../components/ui/header";
import { useThemedStyles } from "../../hooks/useThemedStyles";

export default function AlumnoHome() {
  const router = useRouter();
  const { theme, fontSizes, colorBlindMode, screenReaderEnabled, speakNavigation, speakText } = useThemedStyles();

  // En la vida real, viene de tu store/auth  
  const userName = "Oscar";

  // Anunciar la pantalla cuando se carga
  useEffect(() => {
    if (screenReaderEnabled) {
      speakNavigation("Inicio del Alumno", `Bienvenido ${userName}. Tienes dos secciones de actividades disponibles: Lenguas y Saberes y Pensamiento Científico.`);
    }
  }, [screenReaderEnabled, userName, speakNavigation]);

  const lenguas = [
    {
      id: "cazaletras",
      title: "CazaLetras",
      subtitle: "Lengua",
      image: require("../../assets/actividades/cazaletras.png"),
      accessibilityLabel: "Actividad CazaLetras de Lengua",
      accessibilityHint: "Juego para encontrar y cazar letras. Toca para iniciar la actividad.",
      onPress: () => {
        if (screenReaderEnabled) {
          speakNavigation("CazaLetras", "Iniciando juego de caza de letras");
        }
        router.push({ pathname: "/actividad/[id]", params: { id: "cazaletras" } });
      },
    },
    {
      id: "dilo-tu",
      title: "¡DiloTú!",
      subtitle: "Lengua",
      image: require("../../assets/actividades/dilotu.png"),
      accessibilityLabel: "Actividad DiloTú de Lengua",
      accessibilityHint: "Juego de expresión oral y vocabulario. Toca para iniciar la actividad.",
      onPress: () => {
        if (screenReaderEnabled) {
          speakNavigation("DiloTú", "Iniciando actividad de expresión oral");
        }
        router.push({ pathname: "/actividad/[id]", params: { id: "dilo-tu" } });
      },
    },
  ];

  const ciencia = [
    {
      id: "geosopa",
      title: "GeoSopa",
      subtitle: "P. Matemático",
      image: require("../../assets/actividades/geosopa.png"),
      accessibilityLabel: "Actividad GeoSopa de Pensamiento Matemático",
      accessibilityHint: "Juego de geometría y formas. Toca para iniciar la actividad.",
      onPress: () => {
        if (screenReaderEnabled) {
          speakNavigation("GeoSopa", "Iniciando juego de geometría y formas");
        }
        router.push({ pathname: "/actividad/[id]", params: { id: "geosopa" } });
      },
    },
    {
      id: "puntogo",
      title: "PuntoGo",
      subtitle: "P. Matemático", 
      image: require("../../assets/actividades/puntogo.png"),
      accessibilityLabel: "Actividad PuntoGo de Pensamiento Matemático",
      accessibilityHint: "Juego de ubicación espacial y puntos. Toca para iniciar la actividad.",
      onPress: () => {
        if (screenReaderEnabled) {
          speakNavigation("PuntoGo", "Iniciando juego de ubicación espacial");
        }
        router.push({ pathname: "/actividad/[id]", params: { id: "puntogo" } });
      },
    },
  ];

  const dynamicStyles = StyleSheet.create({
    header: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    greeting: { 
      fontSize: fontSizes.title, 
      color: theme.colors.textSecondary,
      fontWeight: '400',
    },
    userName: { 
      fontSize: fontSizes.title * 1.4, 
      fontWeight: "900", 
      color: theme.colors.textPrimary,
    },
  });

  return (
    <LinearGradient
      colors={[theme.colors.gradTop, theme.colors.gradBottom]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Component */}
        <Header title="KIDIQUO" />
        
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {/* User Greeting */}
          <View style={dynamicStyles.header}>
            <View>
              <Text style={dynamicStyles.greeting}>Hola,</Text>
              <Text style={dynamicStyles.userName}>{userName}</Text>
            </View>
          </View>

          {/* Sección Lenguas */}
          <SectionGrid title="Lenguas" items={lenguas} />

          {/* Sección Saberes y Pensamiento Científico */}
          <SectionGrid title="Saberes y Pensamiento Científico" items={ciencia} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Estilos estáticos (se mantienen pero los dinámicos los sobrescriben)
const styles = StyleSheet.create({
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#7fff7fff" },
});
