import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

type Props = { children?: React.ReactNode };

export default function SceneDecorImages({ children }: Props) {
  return (
    <View style={styles.container}>
      {/* Fondo degradado */}
      <LinearGradient
        colors={["#00B4D8", "#FFEB85"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Nubes arriba (franja) */}
      <Image
        source={require("../assets/ui/CLOUDS.webp")}
        style={styles.clouds}
        contentFit="contain"
        transition={120}
      />

      {/* Logo centrado (franja) */}
      <Image
        source={require("../assets/ui/LOGO.webp")}
        style={styles.logo}
        contentFit="contain"
        transition={120}
      />

      {/* Árboles abajo (franja) */}
      <Image
        source={require("../assets/ui/TREE.webp")}
        style={styles.trees}
        contentFit="cover"
        transition={120}
      />

      {/* Zona central para logo + botones */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  clouds: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    height: 220, // ajusta según tu imagen
  },
    logo: {
    position: "absolute",
    top: 290,
    left: 0,
    right: 0,
    height: 120, // ajusta según tu imagen
  },
  trees: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 210, // ajusta según tu imagen
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 170, // deja aire sobre el logo
    paddingHorizontal: 24,
    paddingBottom: 0, // deja aire sobre árboles
  },
});
