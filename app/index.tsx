import { StatusBar } from "expo-status-bar";
import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import SceneDecorImages from "../components/SceneDecorImages";
import { homeStyles as s } from "../styles/home.styles";

export default function Index() {
  return (
    <SceneDecorImages>
      <StatusBar style="light" />
      {/* Botón directo al home de alumno (saltando login) */}
      <Pressable style={s.button} onPress={() => router.push("/alumno")}>
        <Text style={s.buttonText}>IR AL HOME (SIN LOGIN)</Text>
      </Pressable>
      
      {/* Botón para ir al login normal */}
      <Pressable style={[s.button, { marginTop: 20, backgroundColor: 'rgba(255,255,255,0.2)' }]} onPress={() => router.push("/inicio2")}>
        <Text style={s.buttonText}>IR AL LOGIN</Text>
      </Pressable>
    </SceneDecorImages>
  );
}



