import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUser } from '../services/database';

// ==================== INTERFACES ====================

export interface LoginResponse {
  success: boolean;
  user?: {
    uid: string;
    email: string;
    displayName?: string;
    name?: string | null;
    progress?: number;
    roleId?: string;
    completedActivities?: number;
    totalActivities?: number;
  };
  token?: string;
  message?: string;
  errorType?: string;
  errorMessage?: string;
  errorCode?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ==================== VALIDACIONES ====================

/**
 * Validar formato de email
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validar campos requeridos para login
 */
const validateLoginFields = (email: string, password: string): string | null => {
  // Verificar que el email no esté vacío
  if (!email || email.trim().length === 0) {
    return 'El correo electrónico es obligatorio';
  }

  // Verificar formato de email
  if (!validateEmail(email)) {
    return 'Por favor ingresa un correo electrónico válido';
  }

  // Verificar que la contraseña no esté vacía
  if (!password || password.trim().length === 0) {
    return 'La contraseña es obligatoria';
  }

  return null; // Todo válido
};

// ==================== MANEJO DE ERRORES ====================

/**
 * Mapear errores de Firebase a mensajes amigables
 */
const mapFirebaseError = (error: AuthError): { errorType: string; errorMessage: string } => {
  console.error('🔥 Error de Firebase:', error.code, error.message);
  console.error('🔥 Error completo:', error);

  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return {
        errorType: 'INVALID_CREDENTIALS',
        errorMessage: 'Correo o contraseña incorrectos. Por favor verifica tus datos.'
      };

    case 'auth/invalid-email':
      return {
        errorType: 'INVALID_EMAIL',
        errorMessage: 'El formato del correo electrónico no es válido.'
      };

    case 'auth/user-disabled':
      return {
        errorType: 'USER_DISABLED',
        errorMessage: 'Esta cuenta ha sido deshabilitada. Contacta al administrador.'
      };

    case 'auth/too-many-requests':
      return {
        errorType: 'TOO_MANY_REQUESTS',
        errorMessage: 'Demasiados intentos fallidos. Espera unos minutos antes de intentar nuevamente.'
      };

    case 'auth/network-request-failed':
      return {
        errorType: 'NETWORK_ERROR',
        errorMessage: 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.'
      };

    case 'auth/app-deleted':
    case 'auth/invalid-api-key':
      return {
        errorType: 'AUTH_NOT_CONFIGURED',
        errorMessage: 'Error de configuración. Contacta al equipo de soporte.'
      };

    case 'auth/expired-action-code':
    case 'auth/invalid-action-code':
      return {
        errorType: 'INVALID_ACTION',
        errorMessage: 'El código de verificación ha expirado o no es válido.'
      };

    default:
      return {
        errorType: 'UNKNOWN_ERROR',
        errorMessage: `Error de autenticación: ${error.message || 'Error desconocido'}`
      };
  }
};

// ==================== FUNCIÓN PRINCIPAL DE LOGIN ====================

/**
 * Función principal para autenticar usuario
 * @param email - Correo electrónico del usuario
 * @param password - Contraseña del usuario
 * @returns Promise con el resultado del login
 */
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  console.log('🔐 Iniciando proceso de login para:', email);

  try {
    // 1. VALIDACIONES DE ENTRADA
    const validationError = validateLoginFields(email, password);
    if (validationError) {
      console.log('❌ Error de validación:', validationError);
      return {
        success: false,
        errorType: 'VALIDATION_ERROR',
        errorMessage: validationError,
        errorCode: 'validation/invalid-input'
      };
    }

    // 2. AUTENTICACIÓN CON FIREBASE AUTH
    console.log('🔥 Autenticando con Firebase Auth...');
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email.trim().toLowerCase(), 
      password
    );

    const firebaseUser = userCredential.user;
    console.log('✅ Autenticación exitosa:', firebaseUser.uid);

    // 3. OBTENER TOKEN DE ACCESO
    const token = await firebaseUser.getIdToken();
    console.log('🎫 Token de acceso obtenido');

    // 4. OBTENER DATOS ADICIONALES DE FIRESTORE
    console.log('💾 Obteniendo datos del usuario desde Firestore...');
    let userData = null;
    
    try {
      userData = await getUser(firebaseUser.uid);
    } catch (firestoreError) {
      console.warn('⚠️ Error obteniendo datos de Firestore:', firestoreError);
      // Continuar sin datos adicionales
    }

    // 5. CONSTRUIR RESPUESTA EXITOSA
    const userResponse = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || email,
      displayName: firebaseUser.displayName || userData?.name,
      name: userData?.name || firebaseUser.displayName,
      progress: userData?.progress || 0,
      roleId: userData?.roleId || 'role_student',
      completedActivities: userData?.completedActivities || 0,
      totalActivities: userData?.totalActivities || 12,
    };

    console.log('🎉 Login completado exitosamente');
    return {
      success: true,
      user: userResponse,
      token: token,
      message: `¡Bienvenido de vuelta${userResponse.name ? ', ' + userResponse.name : ''}!`
    };

  } catch (error) {
    // 6. MANEJO DE ERRORES
    console.error('❌ Error durante el login:', error);
    console.error('❌ Tipo de error:', typeof error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack available');

    if (error && typeof error === 'object' && 'code' in error) {
      // Error de Firebase Auth
      console.log('🔥 Es un error de Firebase Auth:', (error as AuthError).code);
      const { errorType, errorMessage } = mapFirebaseError(error as AuthError);
      return {
        success: false,
        errorType,
        errorMessage,
        errorCode: (error as AuthError).code
      };
    } else {
      // Error genérico
      console.error('❌ Error no es de Firebase:', error);
      return {
        success: false,
        errorType: 'UNKNOWN_ERROR',
        errorMessage: `Ha ocurrido un error inesperado durante el login: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        errorCode: 'unknown/error'
      };
    }
  }
};

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Función para logout del usuario
 */
export const logoutUser = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    await auth.signOut();
    console.log('👋 Usuario desconectado exitosamente');
    
    return {
      success: true,
      message: '¡Hasta luego! Has cerrado sesión correctamente.'
    };
  } catch (error) {
    console.error('❌ Error durante logout:', error);
    return {
      success: false,
      message: 'Error al cerrar sesión. Por favor intenta nuevamente.'
    };
  }
};

/**
 * Obtener usuario actual autenticado
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Verificar si hay un usuario autenticado
 */
export const isUserAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

/**
 * Función para validar solo email (para uso en componentes)
 */
export const isValidEmail = (email: string): boolean => {
  return validateEmail(email);
};

/**
 * Obtener token del usuario actual
 */
export const getCurrentUserToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    return null;
  }
};

// ==================== LISTENER DE ESTADO DE AUTENTICACIÓN ====================

/**
 * Escuchar cambios en el estado de autenticación
 * @param callback - Función que se ejecuta cuando cambia el estado
 */
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth.onAuthStateChanged(callback);
};

// Logging para desarrollo
if (__DEV__) {
  console.log('🔐 Sistema de login cargado');
  console.log('📧 Validaciones: Email, contraseña');
  console.log('🛡️ Errores manejados: 8 tipos diferentes');
}