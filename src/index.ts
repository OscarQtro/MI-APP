// 📱 KIDIQUO - Punto de entrada principal
import "expo-router/entry";

// 🔥 Firebase y configuración
import './config/firebase';

// 📚 Servicios principales
import './services/database';

// 🎮 Actividades y funcionalidades
import './features/actividades';

// 🎨 Contextos globales
import './contexts/AccessibilityContext';

// 🛠️ Configuración de desarrollo
if (__DEV__) {
  console.log('🚀 KIDIQUO iniciado correctamente');
  console.log('📱 Modo desarrollo activo');
  console.log('🔥 Firebase configurado');
  console.log('🎮 4 actividades cargadas');
}