import { View, StyleSheet, Keyboard } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useState, useEffect } from "react";

type Props = { children?: React.ReactNode };

export default function SceneDecorImages({ children }: Props) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Fondo degradado */}
      <LinearGradient
        colors={["#00B4D8", "#FFEB85"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Nubes arriba (franja) - fijas con opacidad cuando hay teclado */}
      <Image
        source={require("../assets/ui/CLOUDS.webp")}
        style={[styles.clouds, { opacity: isKeyboardVisible ? 0.3 : 1 }]}
        contentFit="contain"
        transition={120}
      />

      {/* Árboles abajo (franja) - fijos con opacidad cuando hay teclado */}
      <Image
        source={require("../assets/ui/TREE.webp")}
        style={[styles.trees, { opacity: isKeyboardVisible ? 0.3 : 1 }]}
        contentFit="cover"
        transition={120}
      />

      {/* Contenido que se mueve con el teclado */}
      <View style={styles.movableContent}>
        {/* Logo centrado - se mueve con el teclado */}
        <Image
          source={require("../assets/ui/LOGO.webp")}
          style={styles.logo}
          contentFit="contain"
          transition={120}
        />

        {/* Zona central para logo + botones */}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  clouds: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    height: 220, // ajusta según tu imagen
  },
  trees: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 210, // ajusta según tu imagen
  },
  movableContent: {
    flex: 1,
    paddingTop: 200, // Espacio para que no se superponga con las nubes
  },
  logo: {
    width: '100%',
    height: 120, // ajusta según tu imagen
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 220, // Espacio para que no se superponga con los árboles
  },
});
