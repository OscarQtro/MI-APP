// ==================== EJEMPLOS DE USO DEL BACKEND ====================
// Este archivo contiene ejemplos prácticos de cómo usar todas las funciones
// del backend en tu aplicación React Native/Expo

import { loginUser, logoutUser, getCurrentUser, onAuthStateChanged } from '../auth/login-backend';
import { registerUser, validateAllFields, getPasswordStrength } from '../auth/register-backend';
import { 
  saveActivityProgress, 
  getUserStats, 
  getUserActivityProgress, 
  isActivityCompleted,
  getRoles 
} from '../services/database';

// ==================== EJEMPLO 1: IMPLEMENTAR LOGIN ====================

/**
 * Ejemplo completo de implementación de login en un componente
 */
export const ejemploLogin = async () => {
  console.log('📱 EJEMPLO: Implementación de Login');
  
  // Datos del formulario (normalmente vienen del state)
  const email = 'usuario@ejemplo.com';
  const password = 'miPassword123';

  try {
    // Llamar a la función de login
    const resultado = await loginUser(email, password);

    if (resultado.success) {
      // ✅ LOGIN EXITOSO
      console.log('🎉 Login exitoso!');
      console.log('Usuario:', resultado.user);
      console.log('Token:', resultado.token);
      console.log('Mensaje:', resultado.message);

      // Aquí normalmente harías:
      // - Guardar el token en AsyncStorage
      // - Navegar a la pantalla principal
      // - Actualizar el estado global (Redux/Context)
      
      // Ejemplo con React Navigation:
      // navigation.navigate('Home');
      
      // Ejemplo con estado:
      // setUser(resultado.user);
      // setIsAuthenticated(true);

    } else {
      // ❌ ERROR EN LOGIN
      console.log('❌ Error en login');
      console.log('Tipo de error:', resultado.errorType);
      console.log('Mensaje:', resultado.errorMessage);
      console.log('Código:', resultado.errorCode);

      // Mostrar error al usuario
      // Alert.alert('Error', resultado.errorMessage);
      // setError(resultado.errorMessage);
    }

  } catch (error) {
    console.error('Error inesperado:', error);
  }
};

// ==================== EJEMPLO 2: IMPLEMENTAR REGISTRO ====================

/**
 * Ejemplo completo de implementación de registro
 */
export const ejemploRegistro = async () => {
  console.log('📱 EJEMPLO: Implementación de Registro');

  // Datos del formulario
  const formData = {
    name: 'Juan Carlos Pérez',
    email: 'juan@ejemplo.com',
    password: 'miPassword123',
    roleId: 'role_student', // o 'role_teacher'
    accessibilityPreferences: {
      fontSize: 'medium',
      highContrast: false,
      voiceAssistance: false
    }
  };

  // 1. VALIDAR CAMPOS ANTES DE ENVIAR
  const errores = validateAllFields(
    formData.name,
    formData.email,
    formData.password,
    formData.roleId
  );

  if (Object.keys(errores).length > 0) {
    console.log('❌ Errores de validación:', errores);
    // Mostrar errores específicos en el UI
    // setNameError(errores.name);
    // setEmailError(errores.email);
    // setPasswordError(errores.password);
    return;
  }

  // 2. VERIFICAR FORTALEZA DE CONTRASEÑA
  const fortaleza = getPasswordStrength(formData.password);
  console.log('🔒 Fortaleza de contraseña:', fortaleza + '%');

  try {
    // 3. REALIZAR REGISTRO
    const resultado = await registerUser(
      formData.name,
      formData.email,
      formData.password,
      formData.roleId,
      formData.accessibilityPreferences
    );

    if (resultado.success) {
      // ✅ REGISTRO EXITOSO
      console.log('🎉 Registro exitoso!');
      console.log('Nuevo usuario:', resultado.user);
      console.log('Mensaje:', resultado.message);

      // Navegar a la pantalla principal o mostrar bienvenida
      // navigation.navigate('Welcome');
      // Alert.alert('¡Bienvenido!', resultado.message);

    } else {
      // ❌ ERROR EN REGISTRO
      console.log('❌ Error en registro');
      console.log('Mensaje:', resultado.errorMessage);

      // Manejar errores específicos
      if (resultado.errorType === 'EMAIL_IN_USE') {
        // Sugerir ir a login
        // Alert.alert('Email en uso', 'Este correo ya está registrado. ¿Quieres iniciar sesión?');
      }
    }

  } catch (error) {
    console.error('Error inesperado:', error);
  }
};

// ==================== EJEMPLO 3: GUARDAR PROGRESO DE JUEGO ====================

/**
 * Ejemplo de cómo guardar progreso cuando el usuario completa una actividad
 */
export const ejemploGuardarProgreso = async () => {
  console.log('📱 EJEMPLO: Guardar Progreso de Actividad');

  // Obtener usuario actual
  const usuario = getCurrentUser();
  
  if (!usuario) {
    console.log('❌ No hay usuario autenticado');
    return;
  }

  // Datos de la actividad completada
  const actividadId = 'geosopa';
  const nombreActividad = 'Geo Sopa de Letras';
  const completada = true;
  const puntuacion = 95;

  try {
    // Guardar progreso
    await saveActivityProgress(
      usuario.uid,
      actividadId,
      nombreActividad,
      completada,
      puntuacion
    );

    console.log('✅ Progreso guardado exitosamente');
    
    // Mostrar felicitaciones al usuario
    // Alert.alert(
    //   '¡Felicitaciones!', 
    //   `Has completado ${nombreActividad} con ${puntuacion} puntos!`
    // );

    // Actualizar UI o navegar de regreso
    // navigation.goBack();

  } catch (error) {
    console.error('❌ Error guardando progreso:', error);
  }
};

// ==================== EJEMPLO 4: OBTENER ESTADÍSTICAS DEL USUARIO ====================

/**
 * Ejemplo de cómo obtener y mostrar estadísticas del usuario
 */
export const ejemploEstadisticas = async () => {
  console.log('📱 EJEMPLO: Obtener Estadísticas del Usuario');

  const usuario = getCurrentUser();
  if (!usuario) return;

  try {
    // Obtener estadísticas completas
    const stats = await getUserStats(usuario.uid);
    
    console.log('📊 Estadísticas del usuario:');
    console.log('- Progreso general:', stats.progress + '%');
    console.log('- Actividades completadas:', stats.completedActivities + '/' + stats.totalActivities);
    console.log('- Puntuación promedio:', stats.averageScore);
    console.log('- Última actividad:', stats.lastActivity);

    // Obtener progreso detallado por actividad
    const progresoDetallado = await getUserActivityProgress(usuario.uid);
    
    console.log('📝 Actividades completadas:');
    progresoDetallado.forEach(actividad => {
      console.log(`- ${actividad.activityName}: ${actividad.score} puntos (${actividad.attempts} intentos)`);
    });

    // Usar estos datos para actualizar el UI
    // setUserStats(stats);
    // setActivities(progresoDetallado);

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
  }
};

// ==================== EJEMPLO 5: VERIFICAR ACTIVIDADES COMPLETADAS ====================

/**
 * Ejemplo de cómo verificar qué actividades ha completado el usuario
 */
export const ejemploVerificarActividades = async () => {
  console.log('📱 EJEMPLO: Verificar Actividades Completadas');

  const usuario = getCurrentUser();
  if (!usuario) return;

  // Lista de todas las actividades disponibles
  const actividades = [
    'geosopa',
    'cazaletras', 
    'dilotu',
    'puntogo'
  ];

  try {
    // Verificar cada actividad
    for (const actividadId of actividades) {
      const completada = await isActivityCompleted(usuario.uid, actividadId);
      console.log(`${actividadId}: ${completada ? '✅ Completada' : '❌ Pendiente'}`);
    }

  } catch (error) {
    console.error('❌ Error verificando actividades:', error);
  }
};

// ==================== EJEMPLO 6: MANEJAR ESTADO DE AUTENTICACIÓN ====================

/**
 * Ejemplo de cómo escuchar cambios en el estado de autenticación
 */
export const ejemploEstadoAuth = () => {
  console.log('📱 EJEMPLO: Manejar Estado de Autenticación');

  // Escuchar cambios en la autenticación
  const unsubscribe = onAuthStateChanged((user) => {
    if (user) {
      // Usuario autenticado
      console.log('✅ Usuario autenticado:', user.email);
      console.log('UID:', user.uid);
      console.log('Nombre:', user.displayName);

      // Actualizar estado de la app
      // setUser(user);
      // setIsAuthenticated(true);
      // navigation.navigate('Home');

    } else {
      // Usuario no autenticado
      console.log('❌ Usuario no autenticado');

      // Limpiar estado y navegar a login
      // setUser(null);
      // setIsAuthenticated(false);
      // navigation.navigate('Login');
    }
  });

  // Importante: desuscribirse cuando el componente se desmonte
  // useEffect(() => {
  //   return unsubscribe;
  // }, []);

  return unsubscribe;
};

// ==================== EJEMPLO 7: LOGOUT COMPLETO ====================

/**
 * Ejemplo de implementación de logout
 */
export const ejemploLogout = async () => {
  console.log('📱 EJEMPLO: Implementar Logout');

  try {
    const resultado = await logoutUser();

    if (resultado.success) {
      console.log('✅ Logout exitoso:', resultado.message);
      
      // Limpiar datos locales
      // await AsyncStorage.clear();
      // setUser(null);
      // setIsAuthenticated(false);
      
      // Navegar a login
      // navigation.navigate('Login');
      
      // Mostrar mensaje
      // Alert.alert('Sesión cerrada', resultado.message);

    } else {
      console.log('❌ Error en logout:', resultado.message);
    }

  } catch (error) {
    console.error('Error inesperado:', error);
  }
};

// ==================== EJEMPLO 8: OBTENER ROLES DISPONIBLES ====================

/**
 * Ejemplo de cómo obtener y mostrar roles para el registro
 */
export const ejemploObtenerRoles = async () => {
  console.log('📱 EJEMPLO: Obtener Roles Disponibles');

  try {
    const roles = await getRoles();
    
    console.log('🎭 Roles disponibles:');
    roles.forEach(rol => {
      console.log(`- ${rol.nombre} (${rol.id}): ${rol.descripcion}`);
    });

    // Usar roles para llenar un picker/select
    // setAvailableRoles(roles);

    return roles;

  } catch (error) {
    console.error('❌ Error obteniendo roles:', error);
    return [];
  }
};

// ==================== EJEMPLO 9: COMPONENTE REACT COMPLETO ====================

/**
 * Ejemplo de cómo implementar todo en un componente React Native
 */
export const EjemploComponenteLogin = `
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { loginUser, onAuthStateChanged } from '../auth/login-backend';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Home');
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const resultado = await loginUser(email, password);

      if (resultado.success) {
        // El onAuthStateChanged manejará la navegación
        Alert.alert('¡Bienvenido!', resultado.message);
      } else {
        setError(resultado.errorMessage);
      }
    } catch (error) {
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Iniciar Sesión</Text>
      
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      
      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <Text>{loading ? 'Iniciando...' : 'Iniciar Sesión'}</Text>
      </TouchableOpacity>
    </View>
  );
};
`;

// ==================== EJEMPLO 10: TESTING Y DEPURACIÓN ====================

/**
 * Funciones útiles para testing y depuración
 */
export const ejemploTesting = {
  // Función para probar login rápidamente
  testLogin: async () => {
    console.log('🧪 Test de Login');
    return await loginUser('test@ejemplo.com', 'test123456');
  },

  // Función para probar registro rápidamente
  testRegister: async () => {
    console.log('🧪 Test de Registro');
    const timestamp = Date.now();
    return await registerUser(
      'Usuario Test',
      `test${timestamp}@ejemplo.com`,
      'test123456',
      'role_student'
    );
  },

  // Función para limpiar datos de testing
  clearTestData: async () => {
    console.log('🧹 Limpiando datos de testing...');
    await logoutUser();
  }
};

// ==================== LOGGING Y MONITOREO ====================

if (__DEV__) {
  console.log('📚 EJEMPLOS DE USO CARGADOS');
  console.log('Funciones disponibles:');
  console.log('- ejemploLogin()');
  console.log('- ejemploRegistro()');
  console.log('- ejemploGuardarProgreso()');
  console.log('- ejemploEstadisticas()');
  console.log('- ejemploVerificarActividades()');
  console.log('- ejemploEstadoAuth()');
  console.log('- ejemploLogout()');
  console.log('- ejemploObtenerRoles()');
  console.log('Para testing:');
  console.log('- ejemploTesting.testLogin()');
  console.log('- ejemploTesting.testRegister()');
}