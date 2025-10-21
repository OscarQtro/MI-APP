import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import SceneDecorImages from "../components/SceneDecorImages-auth";
import { authStyles as a } from "../styles/auth.styles";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { loginConValidacion } from "../src/auth/login-validacion-estricta";

const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

export default function Ingreso() {
  const { theme, fontSizes, highContrast, colorBlindMode, screenReaderEnabled, speakNavigation, speakAction } = useThemedStyles();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Anunciar la pantalla cuando se carga
  React.useEffect(() => {
    if (screenReaderEnabled) {
      speakNavigation("Pantalla de Ingreso", "Completa tu correo electrónico y contraseña para ingresar.");
    }
  }, [screenReaderEnabled, speakNavigation]);

  const onSubmit = async () => {
    if (!isEmail(email)) {
      if (screenReaderEnabled) {
        speakAction("Error de validación", "Correo electrónico inválido. Por favor revisa el formato.");
      }
      return Alert.alert("Correo inválido", "Revisa tu correo.");
    }
    if (pass.length < 6) {
      if (screenReaderEnabled) {
        speakAction("Error de validación", "La contraseña debe tener al menos 6 caracteres.");
      }
      return Alert.alert("Contraseña corta", "Mínimo 6 caracteres.");
    }
    try {
      setLoading(true);
      if (screenReaderEnabled) {
        speakAction("Iniciando sesión", "Validando credenciales, por favor espera.");
      }
      
      // Llamada real a Firebase para validar credenciales
      const resultado = await loginConValidacion(email, pass);
      
      if (resultado.success) {
        if (screenReaderEnabled) {
          speakAction("Ingreso exitoso", "Bienvenido a la aplicación.");
        }
        Alert.alert("Ingreso correcto", "¡Bienvenido!", [
          {
            text: "OK",
            onPress: () => router.replace("/alumno")
          }
        ]);
      } else {
        // Login falló - mostrar mensaje específico
        if (screenReaderEnabled) {
          speakAction("Error de credenciales", "Usuario o contraseña incorrectas");
        }
        Alert.alert(
          "Error de ingreso", 
          "Usuario o contraseña incorrectas"
        );
      }
    } catch (error) {
      console.error('Error en login:', error);
      if (screenReaderEnabled) {
        speakAction("Error de conexión", "No se pudo conectar con el servidor. Intenta nuevamente.");
      }
      Alert.alert("Error de conexión", "No se pudo conectar con el servidor. Verifica tu conexión a internet.");
    } finally {
      setLoading(false);
    }
  };

  // Estilos dinámicos para accesibilidad
  const dynamicStyles = StyleSheet.create({
    title: {
      ...a.title,
      color: highContrast 
        ? theme.colors.textPrimary 
        : colorBlindMode 
          ? theme.colors.textPrimary
          : a.title.color,
      fontSize: fontSizes.title * 1.2,
      textShadowColor: (highContrast || colorBlindMode) ? 'rgba(0,0,0,0.8)' : 'transparent',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      borderBottomWidth: (highContrast || colorBlindMode) ? 2 : 0,
      borderBottomColor: colorBlindMode ? theme.colors.primary : theme.colors.textPrimary,
      paddingBottom: (highContrast || colorBlindMode) ? 8 : 0,
    },
    label: {
      ...a.label,
      color: highContrast 
        ? theme.colors.textPrimary 
        : colorBlindMode 
          ? theme.colors.textPrimary
          : a.label.color,
      fontSize: fontSizes.base,
      fontWeight: (highContrast || colorBlindMode) ? '800' : a.label.fontWeight || '600',
    },
    inputPill: {
      ...a.inputPill,
      backgroundColor: highContrast 
        ? theme.colors.background 
        : colorBlindMode 
          ? theme.colors.surface
          : a.inputPill.backgroundColor,
      borderWidth: (highContrast || colorBlindMode) ? 2 : 1,
      borderColor: highContrast 
        ? theme.colors.textPrimary 
        : colorBlindMode 
          ? theme.colors.primary
          : 'rgba(255,255,255,0.3)',
      color: (highContrast || colorBlindMode) ? theme.colors.textPrimary : a.inputPill.color,
      fontSize: fontSizes.base,
    },
    primaryBtn: {
      ...a.primaryBtn,
      backgroundColor: (highContrast || colorBlindMode) ? theme.colors.primary : a.primaryBtn.backgroundColor,
      borderWidth: (highContrast || colorBlindMode) ? 3 : 0,
      borderColor: (highContrast || colorBlindMode) ? theme.colors.textPrimary : 'transparent',
    },
    primaryText: {
      ...a.primaryText,
      color: (highContrast || colorBlindMode) ? theme.colors.textLight : a.primaryText.color,
      fontSize: fontSizes.base,
      fontWeight: '800',
    },
    linkText: {
      ...a.linkText,
      color: highContrast 
        ? theme.colors.textPrimary 
        : colorBlindMode 
          ? theme.colors.primary
          : a.linkText.color,
      fontSize: fontSizes.base,
      fontWeight: (highContrast || colorBlindMode) ? '700' : a.linkText.fontWeight || '500',
      textShadowColor: (highContrast || colorBlindMode) ? 'rgba(0,0,0,0.5)' : 'transparent',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    showText: {
      ...a.showText,
      color: highContrast 
        ? theme.colors.textPrimary 
        : colorBlindMode 
          ? theme.colors.primary
          : a.showText.color,
      fontSize: fontSizes.caption,
      fontWeight: (highContrast || colorBlindMode) ? '700' : a.showText.fontWeight || '500',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
    >
      <SceneDecorImages>
        <StatusBar style="light" />

        {/* Logo arriba */}

        <View style={a.form}>
          <Text style={dynamicStyles.title}>INGRESAR</Text>

          {/* Correo */}
          <View style={a.group}>
            <Text style={dynamicStyles.label}>CORREO</Text>
            <TextInput
              style={dynamicStyles.inputPill}
              placeholder="Correo Electrónico"
              placeholderTextColor={
                highContrast 
                  ? theme.colors.textMuted 
                  : colorBlindMode 
                    ? theme.colors.textMuted
                    : "rgba(255,255,255,0.9)"
              }
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              textContentType="emailAddress"
              accessibilityLabel="Campo de correo electrónico"
              accessibilityHint="Ingresa tu dirección de correo electrónico"
              accessible={true}
            />
          </View>

          {/* Contraseña */}
          <View style={a.group}>
            <Text style={dynamicStyles.label}>CONTRASEÑA</Text>
            <View style={a.passwordRow}>
              <TextInput
                style={[dynamicStyles.inputPill, { flex: 1 }]}
                placeholder="Contraseña"
                placeholderTextColor={
                  highContrast 
                    ? theme.colors.textMuted 
                    : colorBlindMode 
                      ? theme.colors.textMuted
                      : "rgba(255,255,255,0.9)"
                }
                secureTextEntry={!show}
                value={pass}
                onChangeText={setPass}
                autoCapitalize="none"
                textContentType="password"
                accessibilityLabel="Campo de contraseña"
                accessibilityHint="Ingresa tu contraseña"
                accessible={true}
              />
              <Pressable 
                onPress={() => {
                  setShow(v => !v);
                  if (screenReaderEnabled) {
                    speakAction(show ? "Ocultar contraseña" : "Mostrar contraseña", "");
                  }
                }} 
                style={a.showBtn}
                accessibilityLabel={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                accessibilityHint="Toca para cambiar la visibilidad de la contraseña"
                accessibilityRole="button"
              >
                <Text style={dynamicStyles.showText}>{show ? "Ocultar" : "Mostrar"}</Text>
              </Pressable>
            </View>
          </View>

          {/* Botón principal */}
          <Pressable
            style={[dynamicStyles.primaryBtn, loading && a.disabled]}
            disabled={loading}
            onPress={onSubmit}
            accessibilityLabel="Botón de ingresar"
            accessibilityHint="Toca para iniciar sesión con las credenciales ingresadas"
            accessibilityRole="button"
            accessibilityState={{ disabled: loading }}
          >
            <Text style={dynamicStyles.primaryText}>{loading ? "Ingresando..." : "INGRESAR"}</Text>
          </Pressable>

          {/* Enlaces */}
          <Pressable 
            style={a.linkBtn} 
            onPress={() => {
              if (screenReaderEnabled) {
                speakNavigation("Volver", "Regresando a la pantalla anterior");
              }
              router.back();
            }}
            accessibilityLabel="Volver"
            accessibilityHint="Toca para regresar a la pantalla anterior"
            accessibilityRole="button"
          >
            <Text style={dynamicStyles.linkText}>← Volver</Text>
          </Pressable>
        </View>
      </SceneDecorImages>
    </KeyboardAvoidingView>
  );
}

