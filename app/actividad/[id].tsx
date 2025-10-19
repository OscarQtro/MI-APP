import { useLocalSearchParams, Stack } from "expo-router";
import { ACTIVIDADES } from "../../features/actividades"; // ajusta tu alias o ruta relativa
import { View, Text } from "react-native";

export default function ActividadScreen() {
  const { id } = useLocalSearchParams<{ id: keyof typeof ACTIVIDADES }>();
  const meta = id ? ACTIVIDADES[id] : undefined;

  if (!meta) {
    return (
      <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
        <Text>No se encontró la actividad.</Text>
      </View>
    );
  }

  const Componente = meta.componente;
  return (
    <>
      <Stack.Screen options={{ title: meta.titulo }} />
      <Componente />
    </>
  );
}

