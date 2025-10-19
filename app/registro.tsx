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
} from "react-native";
import { router } from "expo-router";
import SceneDecorImages from "../components/SceneDecorImages-auth2"; // mismo decorado que usas en ingreso
import { authStyles as a } from "../styles/auth.styles";

const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);
const ROLES = ["Alumno", "Profesor"] as const;
type Rol = typeof ROLES[number];

export default function Registro() {
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

  return (
    <SceneDecorImages>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={a.form}
      >
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
      </KeyboardAvoidingView>
    </SceneDecorImages>
  );
}
