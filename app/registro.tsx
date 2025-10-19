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
import SceneDecorImages from "../components/SceneDecorImages-auth2"; // mismo decorado que usas en ingreso
import { authStyles as a } from "../styles/auth.styles";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUser } from '../services/database';

const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);
const ROLES = ["Alumno", "Profesor"] as const;
type Rol = typeof ROLES[number];

export default function Registro() {
  const { theme, fontSizes, highContrast, colorBlindMode, screenReaderEnabled, speakNavigation, speakAction } = useThemedStyles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [rol, setRol] = useState<Rol>("Alumno");
  const [loading, setLoading] = useState(false);

  // Anunciar la pantalla cuando se carga
  React.useEffect(() => {
    if (screenReaderEnabled) {
      speakNavigation("Pantalla de Registro", "Completa todos los campos para crear tu nueva cuenta.");
    }
  }, [screenReaderEnabled, speakNavigation]);

  const onRegister = async () => {
    if (name.trim().length < 3) {
      if (screenReaderEnabled) {
        speakAction("Error de validación", "Nombre inválido. Escribe tu nombre completo.");
      }
      return Alert.alert("Nombre inválido", "Escribe tu nombre completo.");
    }
    if (!isEmail(email)) {
      if (screenReaderEnabled) {
        speakAction("Error de validación", "Correo inválido. Revisa el formato del correo.");
      }
      return Alert.alert("Correo inválido", "Revisa el formato del correo.");
    }
    if (pass.length < 6) {
      if (screenReaderEnabled) {
        speakAction("Error de validación", "Contraseña corta. Debe tener mínimo 6 caracteres.");
      }
      return Alert.alert("Contraseña corta", "Mínimo 6 caracteres.");
    }

    try {
      setLoading(true);
      if (screenReaderEnabled) {
        speakAction("Creando cuenta", "Registrando nueva cuenta, por favor espera.");
      }
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      
      // Crear perfil del usuario en Firestore
      await createUser(user.uid, {
        email: email,
        name: name,
        createdAt: new Date(),
        progress: 0,
        completedActivities: 0,
        totalActivities: 4
      });
      
      if (screenReaderEnabled) {
        speakAction("Registro exitoso", "Cuenta creada correctamente. Dirigiendo a la pantalla de ingreso.");
      }
      Alert.alert("Registro correcto", "Ahora inicia sesión.", [
        {
          text: "OK",
          onPress: () => router.replace("/ingreso")
        }
      ]);
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      let errorMessage = "El usuario no se pudo crear";
      
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este correo ya está registrado";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña es muy débil";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "El formato del correo es inválido";
      }
      
      if (screenReaderEnabled) {
        speakAction("Error de registro", errorMessage);
      }
      Alert.alert("Error de registro", errorMessage);
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

        <View style={a.form}>
          <Text style={dynamicStyles.title}>REGISTRO</Text>

        {/* Nombre */}
        <View style={a.group}>
          <Text style={dynamicStyles.label}>NOMBRE COMPLETO</Text>
          <TextInput
            style={dynamicStyles.inputPill}
            placeholder="Tu nombre"
            placeholderTextColor={
              highContrast 
                ? theme.colors.textMuted 
                : colorBlindMode 
                  ? theme.colors.textMuted
                  : "rgba(255,255,255,0.9)"
            }
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            textContentType="name"
            accessibilityLabel="Campo de nombre completo"
            accessibilityHint="Ingresa tu nombre completo"
            accessible={true}
          />
        </View>

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
              textContentType="newPassword"
              accessibilityLabel="Campo de contraseña"
              accessibilityHint="Ingresa tu contraseña, debe tener al menos 6 caracteres"
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

        {/* Rol */}
        <View style={a.group}>
          <Text style={dynamicStyles.label}>SELECCIONAR ROL</Text>
          <View style={a.chipsRow}>
            {ROLES.map((r) => {
              const active = rol === r;
              return (
                <Pressable
                  key={r}
                  style={[
                    dynamicStyles.chip, 
                    active && dynamicStyles.chipActive
                  ]}
                  onPress={() => {
                    setRol(r);
                    if (screenReaderEnabled) {
                      speakAction("Rol seleccionado", `Rol ${r} seleccionado`);
                    }
                  }}
                  accessibilityLabel={`Rol ${r}`}
                  accessibilityHint={`Seleccionar rol como ${r}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[
                    dynamicStyles.chipText, 
                    active && dynamicStyles.chipTextActive
                  ]}>{r}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Botón principal */}
        <Pressable
          style={[dynamicStyles.primaryBtn, loading && a.disabled]}
          disabled={loading}
          onPress={onRegister}
          accessibilityLabel="Botón crear cuenta"
          accessibilityHint="Toca para crear tu nueva cuenta con los datos ingresados"
          accessibilityRole="button"
          accessibilityState={{ disabled: loading }}
        >
          <Text style={dynamicStyles.primaryText}>{loading ? "Registrando..." : "CREAR CUENTA"}</Text>
        </Pressable>

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
