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
import SceneDecorImages from "../components/SceneDecorImages-auth";
import { authStyles as a } from "../styles/auth.styles";

const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

export default function Ingreso() {
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

  return (
    <SceneDecorImages>
      <StatusBar style="light" />

      {/* Logo arriba */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={a.form}
      >
        <Text style={a.title}>INGRESAR</Text>

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
              textContentType="password"
            />
            <Pressable onPress={() => setShow(v => !v)} style={a.showBtn}>
              <Text style={a.showText}>{show ? "Ocultar" : "Mostrar"}</Text>
            </Pressable>
          </View>
        </View>

        {/* Botón principal */}
        <Pressable
          style={[a.primaryBtn, loading && a.disabled]}
          disabled={loading}
          onPress={onSubmit}
        >
          <Text style={a.primaryText}>{loading ? "Ingresando..." : "INGRESAR"}</Text>
        </Pressable>

        {/* Enlaces */}
        <Pressable style={a.linkBtn} onPress={() => router.back()}>
          <Text style={a.linkText}>← Volver</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SceneDecorImages>
  );
}

