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
import SceneDecorImages from "../components/SceneDecorImages-auth2"; // mismo decorado que usas en ingreso
import { authStyles as a } from "../styles/auth.styles";
import { useThemedStyles } from "../hooks/useThemedStyles";

const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);
const ROLES = ["Alumno", "Profesor"] as const;
type Rol = typeof ROLES[number];

export default function Registro() {
  const { theme, fontSizes, highContrast } = useThemedStyles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [rol, setRol] = useState<Rol>("Alumno");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (name.trim().length < 3) return Alert.alert("Nombre inválido", "Escribe tu nombre completo.");
    if (!isEmail(email)) return Alert.alert("Correo inválido", "Revisa el formato del correo.");
    if (pass.length < 6) return Alert.alert("Contraseña corta", "Mínimo 6 caracteres.");

    try {
      setLoading(true);
      // TODO: llamada real a tu backend /auth/register  { name, email, pass, rol }
      Alert.alert("Registro correcto", "Ahora inicia sesión.");
      router.replace("/ingreso"); // ← ir a Ingresar
    } catch {
      Alert.alert("Error", "No se pudo registrar.");
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
    chip: {
      ...a.chip,
      backgroundColor: highContrast ? theme.colors.background : a.chip.backgroundColor,
      borderWidth: highContrast ? 2 : a.chip.borderWidth,
      borderColor: highContrast ? theme.colors.textPrimary : a.chip.borderColor,
    },
    chipActive: {
      ...a.chipActive,
      backgroundColor: highContrast ? theme.colors.primary : a.chipActive.backgroundColor,
      borderWidth: highContrast ? 3 : 1,
      borderColor: highContrast ? theme.colors.textPrimary : a.chipActive.borderColor,
    },
    chipText: {
      ...a.chipText,
      color: highContrast ? theme.colors.textPrimary : a.chipText.color,
      fontSize: fontSizes.base,
      fontWeight: highContrast ? '700' : a.chipText.fontWeight || '700',
    },
    chipTextActive: {
      ...a.chipTextActive,
      color: highContrast ? theme.colors.textLight : a.chipTextActive.color,
      fontSize: fontSizes.base,
      fontWeight: '800',
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

        <View style={a.form}>
          <Text style={a.title}>REGISTRO</Text>

        {/* Nombre */}
        <View style={a.group}>
          <Text style={a.label}>NOMBRE COMPLETO</Text>
          <TextInput
            style={a.inputPill}
            placeholder="Tu nombre"
            placeholderTextColor="rgba(255,255,255,0.9)"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            textContentType="name"
          />
        </View>

        {/* Correo */}
        <View style={a.group}>
          <Text style={a.label}>CORREO</Text>
          <TextInput
            style={a.inputPill}
            placeholder="Correo Electrónico"
            placeholderTextColor="rgba(255,255,255,0.9)"
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
          <Text style={a.label}>CONTRASEÑA</Text>
          <View style={a.passwordRow}>
            <TextInput
              style={[a.inputPill, { flex: 1 }]}
              placeholder="Contraseña"
              placeholderTextColor="rgba(255,255,255,0.9)"
              secureTextEntry={!show}
              value={pass}
              onChangeText={setPass}
              autoCapitalize="none"
              textContentType="newPassword"
            />
            <Pressable onPress={() => setShow(v => !v)} style={a.showBtn}>
              <Text style={a.showText}>{show ? "Ocultar" : "Mostrar"}</Text>
            </Pressable>
          </View>
        </View>

        {/* Rol */}
        <View style={a.group}>
          <Text style={a.label}>SELECCIONAR ROL</Text>
          <View style={a.chipsRow}>
            {ROLES.map((r) => {
              const active = rol === r;
              return (
                <Pressable
                  key={r}
                  style={[a.chip, active && a.chipActive]}
                  onPress={() => setRol(r)}
                >
                  <Text style={[a.chipText, active && a.chipTextActive]}>{r}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Botón principal */}
        <Pressable
          style={[a.primaryBtn, loading && a.disabled]}
          disabled={loading}
          onPress={onRegister}
        >
          <Text style={a.primaryText}>{loading ? "Registrando..." : "CREAR CUENTA"}</Text>
        </Pressable>

        <Pressable style={a.linkBtn} onPress={() => router.back()}>
          <Text style={a.linkText}>← Volver</Text>
        </Pressable>
        </View>
      </SceneDecorImages>
    </KeyboardAvoidingView>
  );
}
