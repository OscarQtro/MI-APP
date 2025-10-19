import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import SceneDecorImages from "../components/SceneDecorImages2";
import { useThemedStyles } from "../hooks/useThemedStyles";

export default function Inicio2() {
  const { theme, fontSizes, screenReaderEnabled, speakNavigation, speakAction } = useThemedStyles();

  // Anunciar la pantalla cuando se carga
  useEffect(() => {
    if (screenReaderEnabled) {
      speakNavigation("Pantalla de Inicio", "Bienvenido a KIDIQUO. Puedes ingresar con tu cuenta existente o registrarte como nuevo usuario.");
    }
  }, [screenReaderEnabled, speakNavigation]);

  const handleIngresar = () => {
    if (screenReaderEnabled) {
      speakAction("Navegando a pantalla de ingreso");
    }
    router.push("/ingreso");
  };

  const handleRegistrarse = () => {
    if (screenReaderEnabled) {
      speakAction("Navegando a pantalla de registro");
    }
    router.push("/registro");
  };

  const dynamicStyles = StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 36,
      borderRadius: 999,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      marginTop: 20,
      borderWidth: theme.colors.primary === theme.colors.textPrimary ? 2 : 0,
      borderColor: theme.colors.border,
    },
    buttonText: { 
      color: theme.colors.textLight,
      fontWeight: "800",
      fontSize: fontSizes.title,
      letterSpacing: 0.5,
    },
  });

  return (
    <SceneDecorImages>
      <StatusBar style="light" />
      
      {/* Botón 1 → pantalla de ingreso */}
      <Pressable 
        style={dynamicStyles.button} 
        onPress={handleIngresar}
        accessibilityLabel="Botón Ingresar"
        accessibilityHint="Navega a la pantalla de inicio de sesión para usuarios existentes"
        accessibilityRole="button"
      >
        <Text style={dynamicStyles.buttonText}>INGRESAR</Text>
      </Pressable>

      {/* Botón 2 → pantalla de registro */}
      <Pressable 
        style={dynamicStyles.button} 
        onPress={handleRegistrarse}
        accessibilityLabel="Botón Registrarse"
        accessibilityHint="Navega a la pantalla de registro para crear una nueva cuenta"
        accessibilityRole="button"
      >
        <Text style={dynamicStyles.buttonText}>REGISTRARSE</Text>
      </Pressable>
    </SceneDecorImages>
  );
}




