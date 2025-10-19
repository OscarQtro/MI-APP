import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useThemedStyles } from "../hooks/useThemedStyles";

type Props = { children?: React.ReactNode };

export default function SceneDecorImages({ children }: Props) {
  const { theme, highContrast, colorBlindMode } = useThemedStyles();

  return (
    <View style={styles.container}>
      {/* Fondo degradado - se adapta al tema */}
      <LinearGradient
        colors={[theme.colors.gradTop, theme.colors.gradBottom]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Nubes arriba - se ocultan en modo alto contraste */}
      {!highContrast && (
        <Image
          source={require("../assets/ui/CLOUDS.webp")}
          style={[
            styles.clouds,
            colorBlindMode && { opacity: 0.7 }
          ]}
          contentFit="contain"
          transition={120}
        />
      )}

      {/* Logo centrado */}
      <Image
        source={require("../assets/ui/LOGO.webp")}
        style={[
          styles.logo,
          highContrast && { opacity: 1 },
          colorBlindMode && { opacity: 0.9 }
        ]}
        contentFit="contain"
        transition={120}
      />

      {/* Árboles abajo - se ocultan en modo alto contraste */}
      {!highContrast && (
        <Image
          source={require("../assets/ui/TREE.webp")}
          style={[
            styles.trees,
            colorBlindMode && { opacity: 0.7 }
          ]}
          contentFit="cover"
          transition={120}
        />
      )}

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
