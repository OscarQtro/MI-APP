// ==================== INTEGRACIÓN RÁPIDA PARA MI-APP ====================
// Este archivo te ayuda a integrar el backend en tus pantallas existentes

import { router } from 'expo-router';
import { Alert } from 'react-native';
import { loginUser, registerUser, saveActivityProgress, getCurrentUser } from './backend-index';

// ==================== FUNCIONES LISTAS PARA USAR ====================

/**
 * Función lista para usar en tu pantalla de login (app/ingreso.tsx)
 */
export const manejarLogin = async (email: string, password: string) => {
  try {
    const resultado = await loginUser(email, password);
    
    if (resultado.success) {
      // Login exitoso - navegar a inicio
      console.log('✅ Usuario logueado:', resultado.user?.name);
      router.push('/inicio2'); // Cambia por tu ruta
      
      // Mostrar mensaje de bienvenida
      Alert.alert(
        '¡Bienvenido!', 
        resultado.message || '¡Has iniciado sesión correctamente!'
      );
      
      return { success: true, user: resultado.user };
    } else {
      // Error de login - mostrar mensaje
      Alert.alert('Error de Login', resultado.errorMessage);
      return { success: false, error: resultado.errorMessage };
    }
  } catch (error) {
    console.error('Error en login:', error);
    Alert.alert('Error', 'Ha ocurrido un error inesperado. Intenta nuevamente.');
    return { success: false, error: 'Error inesperado' };
  }
};

/**
 * Función lista para usar en tu pantalla de registro (app/registro.tsx)
 */
export const manejarRegistro = async (
  name: string, 
  email: string, 
  password: string,
  roleId: string = 'role_student'
) => {
  try {
    const resultado = await registerUser(name, email, password, roleId);
    
    if (resultado.success) {
      // Registro exitoso
      console.log('✅ Usuario registrado:', resultado.user?.name);
      router.push('/inicio2'); // Cambia por tu ruta
      
      Alert.alert(
        '¡Cuenta Creada!', 
        resultado.message || '¡Tu cuenta ha sido creada exitosamente!'
      );
      
      return { success: true, user: resultado.user };
    } else {
      // Error de registro
      Alert.alert('Error de Registro', resultado.errorMessage);
      return { success: false, error: resultado.errorMessage };
    }
  } catch (error) {
    console.error('Error en registro:', error);
    Alert.alert('Error', 'Ha ocurrido un error inesperado. Intenta nuevamente.');
    return { success: false, error: 'Error inesperado' };
  }
};

/**
 * Función para usar cuando el usuario complete una actividad
 */
export const manejarActividadCompletada = async (
  activityId: string,
  activityName: string,
  score: number = 100
) => {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar tu progreso.');
      return { success: false };
    }

    await saveActivityProgress(user.uid, activityId, activityName, true, score);
    
    // Mostrar felicitaciones
    Alert.alert(
      '¡Felicitaciones!',
      `Has completado "${activityName}" con ${score} puntos!`,
      [
        {
          text: 'Continuar',
          onPress: () => router.back() // Regresa al menú principal
        }
      ]
    );
    
    console.log(`✅ Actividad completada: ${activityName} - ${score} puntos`);
    return { success: true };
    
  } catch (error) {
    console.error('Error guardando progreso:', error);
    Alert.alert('Error', 'No se pudo guardar tu progreso. Intenta nuevamente.');
    return { success: false };
  }
};

// ==================== EJEMPLOS DE INTEGRACIÓN POR PANTALLA ====================

/**
 * EJEMPLO 1: Para tu pantalla de login (app/ingreso.tsx)
 */
export const ejemploIntegracionLogin = `
// En tu componente de login, reemplaza tu función actual por:

import { manejarLogin } from '../integracion-rapida';

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);

const onLoginPress = async () => {
  setLoading(true);
  
  const resultado = await manejarLogin(email, password);
  
  if (resultado.success) {
    // El usuario ya fue navegado automáticamente
    console.log('Usuario logueado:', resultado.user);
  }
  
  setLoading(false);
};
`;

/**
 * EJEMPLO 2: Para tu pantalla de registro (app/registro.tsx)
 */
export const ejemploIntegracionRegistro = `
// En tu componente de registro:

import { manejarRegistro } from '../integracion-rapida';

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);

const onRegisterPress = async () => {
  setLoading(true);
  
  const resultado = await manejarRegistro(name, email, password);
  
  if (resultado.success) {
    // Usuario registrado y navegado automáticamente
    console.log('Usuario registrado:', resultado.user);
  }
  
  setLoading(false);
};
`;

/**
 * EJEMPLO 3: Para tus actividades
 */
export const ejemploIntegracionActividad = `
// En cada actividad (GeoSopa, CazaLetras, etc.):

import { manejarActividadCompletada } from '../integracion-rapida';

// Cuando el juego termine exitosamente:
const onGameComplete = async (finalScore: number) => {
  await manejarActividadCompletada(
    'geosopa',                    // ID único de la actividad
    'Geo Sopa de Letras',         // Nombre amigable
    finalScore                    // Puntuación obtenida
  );
  
  // La función ya maneja la navegación de regreso
};
`;

// ==================== MAPEO DE ACTIVIDADES ====================

/**
 * IDs de las actividades para uso consistente
 */
export const ACTIVITY_IDS = {
  GEOSOPA: 'geosopa',
  CAZALETRAS: 'cazaletras', 
  DILOTU: 'dilotu',
  PUNTOGO: 'puntogo'
} as const;

/**
 * Nombres amigables de las actividades
 */
export const ACTIVITY_NAMES = {
  [ACTIVITY_IDS.GEOSOPA]: 'Geo Sopa de Letras',
  [ACTIVITY_IDS.CAZALETRAS]: 'Caza Letras',
  [ACTIVITY_IDS.DILOTU]: 'Dilo Tú',
  [ACTIVITY_IDS.PUNTOGO]: 'Punto Go'
} as const;

/**
 * Función helper para obtener el nombre de una actividad
 */
export const obtenerNombreActividad = (activityId: string): string => {
  return ACTIVITY_NAMES[activityId as keyof typeof ACTIVITY_NAMES] || activityId;
};

// ==================== FUNCIONES DE UTILIDAD ADICIONALES ====================

/**
 * Verificar si el usuario está autenticado
 */
export const verificarAutenticacion = (): boolean => {
  const user = getCurrentUser();
  
  if (!user) {
    Alert.alert(
      'Sesión Requerida',
      'Debes iniciar sesión para acceder a esta función.',
      [
        {
          text: 'Iniciar Sesión',
          onPress: () => router.push('/ingreso')
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
    return false;
  }
  
  return true;
};

/**
 * Función para cerrar sesión
 */
export const manejarCerrarSesion = async () => {
  Alert.alert(
    'Cerrar Sesión',
    '¿Estás seguro de que quieres cerrar sesión?',
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          const { logoutUser } = await import('./auth/login-backend');
          const resultado = await logoutUser();
          
          if (resultado.success) {
            router.push('/ingreso');
            Alert.alert('Sesión Cerrada', resultado.message);
          }
        }
      }
    ]
  );
};

// ==================== LOGGING PARA DESARROLLO ====================

if (__DEV__) {
  console.log('🔗 INTEGRACIÓN RÁPIDA CARGADA');
  console.log('Funciones disponibles:');
  console.log('- manejarLogin(email, password)');
  console.log('- manejarRegistro(name, email, password)');
  console.log('- manejarActividadCompletada(id, name, score)');
  console.log('- verificarAutenticacion()');
  console.log('- manejarCerrarSesion()');
}