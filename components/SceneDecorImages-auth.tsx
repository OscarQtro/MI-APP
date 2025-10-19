import { View, StyleSheet, Keyboard } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { useThemedStyles } from "../hooks/useThemedStyles";

type Props = { children?: React.ReactNode };

export default function SceneDecorImages({ children }: Props) {
  const { theme, highContrast, colorBlindMode } = useThemedStyles();
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

  // Calcular opacidad base según el modo de accesibilidad y teclado
  const getImageOpacity = (baseOpacity: number) => {
    if (highContrast) return 0; // Ocultar completamente en alto contraste
    if (colorBlindMode) return baseOpacity * 0.6; // Reducir en modo daltónico
    return isKeyboardVisible ? baseOpacity * 0.3 : baseOpacity;
  };

  return (
    <View style={styles.container}>
      {/* Fondo degradado - se adapta al tema */}
      <LinearGradient
        colors={[theme.colors.gradTop, theme.colors.gradBottom]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Overlay semi-transparente para mejorar legibilidad en modos de accesibilidad */}
      {(highContrast || colorBlindMode) && (
        <View 
          style={[
            StyleSheet.absoluteFill, 
            { 
              backgroundColor: highContrast 
                ? 'rgba(255,255,255,0.15)' 
                : 'rgba(255,255,255,0.1)',
            }
          ]} 
        />
      )}

      {/* Nubes arriba - se ocultan en alto contraste */}
      {!highContrast && (
        <Image
          source={require("../assets/ui/CLOUDS.webp")}
          style={[styles.clouds, { opacity: getImageOpacity(1) }]}
          contentFit="contain"
          transition={120}
        />
      )}

      {/* Árboles abajo - se ocultan en alto contraste */}
      {!highContrast && (
        <Image
          source={require("../assets/ui/TREE.webp")}
          style={[styles.trees, { opacity: getImageOpacity(1) }]}
          contentFit="cover"
          transition={120}
        />
      )}

      {/* Logo centrado - siempre visible pero con opacidad ajustada */}
      <Image
        source={require("../assets/ui/LOGO.webp")}
        style={[
          styles.logo, 
          { 
            opacity: highContrast 
              ? (isKeyboardVisible ? 0.8 : 1) 
              : getImageOpacity(1) 
          }
        ]}
        contentFit="contain"
        transition={120}
      />

      {/* Contenido que se mueve con el teclado */}
      <View style={styles.movableContent}>
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
  logo: {
    position: "absolute",
    top: 200,
    left: 0,
    right: 0,
    height: 120, // ajusta según tu imagen
  },
  movableContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 150, // deja aire sobre el logo
    paddingHorizontal: 24,
    paddingBottom: 0, // deja aire sobre árboles
  },
});
