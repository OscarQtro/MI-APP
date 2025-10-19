import { StatusBar } from "expo-status-bar";
import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import SceneDecorImages from "../components/SceneDecorImages2";
import { homeStyles as s } from "../styles/inicio2.styles";

export default function Inicio2() {
  return (
    <SceneDecorImages>
      <StatusBar style="light" />
      

      {/* Botón 1 → pantalla de ingreso */}
      <Pressable style={s.button} onPress={() => router.push("/ingreso")}>
        <Text style={s.buttonText}>INGRESAR</Text>
      </Pressable>

      {/* Botón 2 → pantalla de registro */}
      <Pressable style={s.button} onPress={() => router.push("/registro")}>
        <Text style={s.buttonText}>REGISTRARSE</Text>
      </Pressable>
    </SceneDecorImages>
  );
}




