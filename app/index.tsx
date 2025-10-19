import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    // Redirigir automáticamente a inicio2 cuando la app se carga
    router.replace("/inicio2");
  }, []);

  // No renderizar nada ya que redirigimos inmediatamente
  return null;
}



