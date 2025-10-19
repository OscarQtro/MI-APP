import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import SectionGrid from "../../components/ui/SectionGrid";

export default function AlumnoHome() {
  const router = useRouter();

  // En la vida real, viene de tu store/auth
  const userName = "Oscar";

  const lenguas = [
    {
      id: "cazaletras",
      title: "CazaLetras",
      subtitle: "Lengua",
      image: require("../../assets/actividades/cazaletras.png"),
      onPress: () => router.push({ pathname: "/actividad/[id]", params: { id: "cazaletras" } }),
    },
    {
      id: "dilo-tu",
      title: "¡DiloTú!",
      subtitle: "Lengua",
      image: require("../../assets/actividades/dilotu.png"),
      onPress: () => router.push({ pathname: "/actividad/[id]", params: { id: "dilo-tu" } }),
    },
  ];

  const ciencia = [
    {
      id: "geosopa",
      title: "GeoSopa",
      subtitle: "P. Matemático",
      image: require("../../assets/actividades/geosopa.png"),
      onPress: () => router.push({ pathname: "/actividad/[id]", params: { id: "geosopa" } }),
    },
    {
      id: "puntogo",
      title: "PuntoGo",
      subtitle: "P. Matemático",
      image: require("../../assets/actividades/puntogo.png"),
      onPress: () => router.push({ pathname: "/actividad/[id]", params: { id: "puntogo" } }),
    },
  ];

  return (
    <LinearGradient
      // degradado tipo tu mock: celeste arriba -> verdoso abajo
      colors={["#00B4D8", "#FFEB85"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hola,</Text>
              <Text style={styles.userName}>{userName}</Text>
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

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: { fontSize: 28, color: "#2b2b2b" },
  userName: { fontSize: 38, fontWeight: "900", color: "#1b1b1b" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#7fff7fff" },
});
