import { useState } from "react";
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

const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

export default function Ingreso() {
  const { theme, fontSizes, highContrast } = useThemedStyles();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!isEmail(email)) return Alert.alert("Correo inválido", "Revisa tu correo.");
    if (pass.length < 6) return Alert.alert("Contraseña corta", "Mínimo 6 caracteres.");
    try {
      setLoading(true);
      // TODO: llamada real a tu backend /auth/login
      Alert.alert("Ingreso correcto", "¡Bienvenido!");
      // router.replace("/inicio2");
    } catch {
      Alert.alert("Error", "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  // Estilos dinámicos para accesibilidad
  const dynamicStyles = StyleSheet.create({
    title: {
      ...a.title,
      color: highContrast ? theme.colors.textPrimary : a.title.color,
      fontSize: fontSizes.title * 1.2,
      textShadowColor: highContrast ? 'rgba(0,0,0,0.8)' : 'transparent',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      borderBottomWidth: highContrast ? 2 : 0,
      borderBottomColor: theme.colors.textPrimary,
      paddingBottom: highContrast ? 8 : 0,
    },
    label: {
      ...a.label,
      color: highContrast ? theme.colors.textPrimary : a.label.color,
      fontSize: fontSizes.base,
      fontWeight: highContrast ? '800' : a.label.fontWeight || '600',
    },
    inputPill: {
      ...a.inputPill,
      backgroundColor: highContrast ? theme.colors.background : a.inputPill.backgroundColor,
      borderWidth: highContrast ? 2 : 1,
      borderColor: highContrast ? theme.colors.textPrimary : 'rgba(255,255,255,0.3)',
      color: highContrast ? theme.colors.textPrimary : a.inputPill.color,
      fontSize: fontSizes.base,
    },
    primaryBtn: {
      ...a.primaryBtn,
      backgroundColor: highContrast ? theme.colors.primary : a.primaryBtn.backgroundColor,
      borderWidth: highContrast ? 3 : 0,
      borderColor: highContrast ? theme.colors.textPrimary : 'transparent',
    },
    primaryText: {
      ...a.primaryText,
      color: highContrast ? theme.colors.textLight : a.primaryText.color,
      fontSize: fontSizes.base,
      fontWeight: '800',
    },
    linkText: {
      ...a.linkText,
      color: highContrast ? theme.colors.textPrimary : a.linkText.color,
      fontSize: fontSizes.base,
      fontWeight: highContrast ? '700' : a.linkText.fontWeight || '500',
      textShadowColor: highContrast ? 'rgba(0,0,0,0.5)' : 'transparent',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    showText: {
      ...a.showText,
      color: highContrast ? theme.colors.textPrimary : a.showText.color,
      fontSize: fontSizes.caption,
      fontWeight: highContrast ? '700' : a.showText.fontWeight || '500',
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
              placeholderTextColor={highContrast ? theme.colors.textMuted : "rgba(255,255,255,0.9)"}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              textContentType="emailAddress"
            />
          </View>

          {/* Contraseña */}
          <View style={a.group}>
            <Text style={dynamicStyles.label}>CONTRASEÑA</Text>
            <View style={a.passwordRow}>
              <TextInput
                style={[dynamicStyles.inputPill, { flex: 1 }]}
                placeholder="Contraseña"
                placeholderTextColor={highContrast ? theme.colors.textMuted : "rgba(255,255,255,0.9)"}
                secureTextEntry={!show}
                value={pass}
                onChangeText={setPass}
                autoCapitalize="none"
                textContentType="password"
              />
              <Pressable onPress={() => setShow(v => !v)} style={a.showBtn}>
                <Text style={dynamicStyles.showText}>{show ? "Ocultar" : "Mostrar"}</Text>
              </Pressable>
            </View>
          </View>

          {/* Botón principal */}
          <Pressable
            style={[dynamicStyles.primaryBtn, loading && a.disabled]}
            disabled={loading}
            onPress={onSubmit}
          >
            <Text style={dynamicStyles.primaryText}>{loading ? "Ingresando..." : "INGRESAR"}</Text>
          </Pressable>

          {/* Enlaces */}
          <Pressable style={a.linkBtn} onPress={() => router.back()}>
            <Text style={dynamicStyles.linkText}>← Volver</Text>
          </Pressable>
        </View>
      </SceneDecorImages>
    </KeyboardAvoidingView>
  );
}

