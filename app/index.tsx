import { StatusBar } from "expo-status-bar";
import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import SceneDecorImages from "../components/SceneDecorImages";
import { homeStyles as s } from "../styles/home.styles";

export default function Index() {
  return (
    <SceneDecorImages>
      <StatusBar style="light" />
      <Pressable style={s.button} onPress={() => router.push("/inicio2")}>
        <Text style={s.buttonText}>INICIAR</Text>
      </Pressable>
    </SceneDecorImages>
  );
}



