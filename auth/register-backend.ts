import { createUserWithEmailAndPassword, updateProfile, AuthError } from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUser, createDefaultRoles } from '../services/database';

// ==================== INTERFACES ====================

export interface RegisterResponse {
  success: boolean;
  user?: {
    uid: string;
    email: string;
    displayName?: string;
    name?: string;
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

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  roleId: string;
  accessibilityPreferences?: object;
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
 * Validar nombre completo
 */
const validateName = (name: string): string | null => {
  const trimmedName = name.trim();

  // Mínimo 3 caracteres
  if (trimmedName.length < 3) {
    return 'El nombre debe tener al menos 3 caracteres';
  }

  // Máximo 50 caracteres
  if (trimmedName.length > 50) {
    return 'El nombre no puede exceder 50 caracteres';
  }

  // Al menos 2 palabras (nombre y apellido)
  const words = trimmedName.split(/\s+/);
  if (words.length < 2) {
    return 'Por favor ingresa tu nombre y apellido';
  }

  // Solo letras, espacios y acentos
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    return 'El nombre solo puede contener letras y espacios';
  }

  return null; // Válido
};

/**
 * Validar fortaleza de contraseña
 */
const validatePassword = (password: string): string | null => {
  // Mínimo 6 caracteres
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }

  // Máximo 50 caracteres
  if (password.length > 50) {
    return 'La contraseña no puede exceder 50 caracteres';
  }

  // Al menos una letra
  if (!/[a-zA-Z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra';
  }

  // Al menos un número
  if (!/\d/.test(password)) {
    return 'La contraseña debe contener al menos un número';
  }

  // Sin espacios
  if (/\s/.test(password)) {
    return 'La contraseña no puede contener espacios';
  }

  return null; // Válida
};

/**
 * Validar rol seleccionado
 */
const validateRole = (roleId: string): string | null => {
  if (!roleId || roleId.trim().length === 0) {
    return 'Debes seleccionar un rol';
  }

  // Roles válidos
  const validRoles = ['role_student', 'role_teacher'];
  if (!validRoles.includes(roleId)) {
    return 'El rol seleccionado no es válido';
  }

  return null; // Válido
};

/**
 * Validar todos los campos de registro
 */
const validateRegisterFields = (
  name: string,
  email: string,
  password: string,
  roleId: string
): string | null => {
  // Validar nombre
  const nameError = validateName(name);
  if (nameError) return nameError;

  // Validar email
  if (!email || email.trim().length === 0) {
    return 'El correo electrónico es obligatorio';
  }

  if (!validateEmail(email)) {
    return 'Por favor ingresa un correo electrónico válido';
  }

  // Validar contraseña
  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;

  // Validar rol
  const roleError = validateRole(roleId);
  if (roleError) return roleError;

  return null; // Todo válido
};

// ==================== MANEJO DE ERRORES ====================

/**
 * Mapear errores de Firebase a mensajes amigables
 */
const mapFirebaseError = (error: AuthError): { errorType: string; errorMessage: string } => {
  console.error('🔥 Error de Firebase:', error.code, error.message);

  switch (error.code) {
    case 'auth/email-already-in-use':
      return {
        errorType: 'EMAIL_IN_USE',
        errorMessage: 'Este correo electrónico ya está registrado. ¿Ya tienes una cuenta?'
      };

    case 'auth/invalid-email':
      return {
        errorType: 'INVALID_EMAIL',
        errorMessage: 'El formato del correo electrónico no es válido.'
      };

    case 'auth/operation-not-allowed':
      return {
        errorType: 'OPERATION_NOT_ALLOWED',
        errorMessage: 'El registro con correo y contraseña no está habilitado.'
      };

    case 'auth/weak-password':
      return {
        errorType: 'WEAK_PASSWORD',
        errorMessage: 'La contraseña es muy débil. Por favor elige una más segura.'
      };

    case 'auth/network-request-failed':
      return {
        errorType: 'NETWORK_ERROR',
        errorMessage: 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.'
      };

    case 'auth/too-many-requests':
      return {
        errorType: 'TOO_MANY_REQUESTS',
        errorMessage: 'Demasiados intentos. Espera unos minutos antes de intentar nuevamente.'
      };

    case 'auth/app-deleted':
    case 'auth/invalid-api-key':
      return {
        errorType: 'AUTH_NOT_CONFIGURED',
        errorMessage: 'Error de configuración. Contacta al equipo de soporte.'
      };

    default:
      return {
        errorType: 'UNKNOWN_ERROR',
        errorMessage: 'Ha ocurrido un error inesperado durante el registro. Por favor intenta nuevamente.'
      };
  }
};

// ==================== FUNCIÓN PRINCIPAL DE REGISTRO ====================

/**
 * Función principal para registrar nuevo usuario
 * @param name - Nombre completo del usuario
 * @param email - Correo electrónico
 * @param password - Contraseña
 * @param roleId - ID del rol seleccionado
 * @param accessibilityPreferences - Preferencias de accesibilidad (opcional)
 * @returns Promise con el resultado del registro
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  roleId: string,
  accessibilityPreferences?: object
): Promise<RegisterResponse> => {
  console.log('📝 Iniciando proceso de registro para:', email);

  try {
    // 1. VALIDACIONES DE ENTRADA
    const validationError = validateRegisterFields(name, email, password, roleId);
    if (validationError) {
      console.log('❌ Error de validación:', validationError);
      return {
        success: false,
        errorType: 'VALIDATION_ERROR',
        errorMessage: validationError,
        errorCode: 'validation/invalid-input'
      };
    }

    // 2. CREAR USUARIO EN FIREBASE AUTH
    console.log('🔥 Creando usuario en Firebase Auth...');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );

    const firebaseUser = userCredential.user;
    console.log('✅ Usuario creado en Auth:', firebaseUser.uid);

    // 3. ACTUALIZAR PERFIL CON NOMBRE
    console.log('👤 Actualizando perfil del usuario...');
    await updateProfile(firebaseUser, {
      displayName: name.trim()
    });

    // 4. OBTENER TOKEN DE ACCESO
    const token = await firebaseUser.getIdToken();
    console.log('🎫 Token de acceso obtenido');

    // 5. CREAR DOCUMENTO EN FIRESTORE
    console.log('💾 Creando documento en Firestore...');
    
    // Asegurar que existan los roles por defecto
    try {
      await createDefaultRoles();
    } catch (roleError) {
      console.warn('⚠️ Advertencia al crear roles por defecto:', roleError);
    }

    // Crear datos del usuario para Firestore
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      progress: 0,
      completedActivities: 0,
      totalActivities: 12,
      roleId: roleId,
      accessibilityPreferences: accessibilityPreferences || {},
      createdAt: new Date(),
    };

    await createUser(firebaseUser.uid, userData);
    console.log('✅ Documento de usuario creado en Firestore');

    // 6. CONSTRUIR RESPUESTA EXITOSA
    const userResponse = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || email,
      displayName: firebaseUser.displayName || name,
      name: name.trim(),
      progress: 0,
      roleId: roleId,
      completedActivities: 0,
      totalActivities: 12,
    };

    console.log('🎉 Registro completado exitosamente');
    return {
      success: true,
      user: userResponse,
      token: token,
      message: `¡Bienvenido ${name.trim().split(' ')[0]}! Tu cuenta ha sido creada exitosamente.`
    };

  } catch (error) {
    // 7. MANEJO DE ERRORES
    console.error('❌ Error durante el registro:', error);

    // Si el usuario fue creado en Auth pero falló Firestore, debería limpiarse
    // pero por simplicidad, el usuario puede intentar iniciar sesión
    
    if (error && typeof error === 'object' && 'code' in error) {
      // Error de Firebase Auth
      const { errorType, errorMessage } = mapFirebaseError(error as AuthError);
      return {
        success: false,
        errorType,
        errorMessage,
        errorCode: (error as AuthError).code
      };
    } else {
      // Error genérico
      return {
        success: false,
        errorType: 'UNKNOWN_ERROR',
        errorMessage: 'Ha ocurrido un error inesperado durante el registro. Por favor intenta nuevamente.',
        errorCode: 'unknown/error'
      };
    }
  }
};

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Función para validar solo nombre (para uso en componentes)
 */
export const isValidName = (name: string): boolean => {
  return validateName(name) === null;
};

/**
 * Función para validar solo email (para uso en componentes)
 */
export const isValidEmail = (email: string): boolean => {
  return validateEmail(email);
};

/**
 * Función para validar solo contraseña (para uso en componentes)
 */
export const isValidPassword = (password: string): boolean => {
  return validatePassword(password) === null;
};

/**
 * Función para validar solo rol (para uso en componentes)
 */
export const isValidRole = (roleId: string): boolean => {
  return validateRole(roleId) === null;
};

/**
 * Obtener fortaleza de contraseña (0-100)
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= 6) strength += 20;
  if (password.length >= 8) strength += 10;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 15;
  if (/[^a-zA-Z\d]/.test(password)) strength += 25;
  
  return Math.min(strength, 100);
};

/**
 * Obtener mensaje de fortaleza de contraseña
 */
export const getPasswordStrengthMessage = (password: string): string => {
  const strength = getPasswordStrength(password);
  
  if (strength < 30) return 'Muy débil';
  if (strength < 50) return 'Débil';
  if (strength < 70) return 'Regular';
  if (strength < 90) return 'Fuerte';
  return 'Muy fuerte';
};

/**
 * Validar todos los campos y retornar errores específicos
 */
export const validateAllFields = (
  name: string,
  email: string,
  password: string,
  roleId: string
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  if (!email.trim()) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!validateEmail(email)) {
    errors.email = 'Formato de correo electrónico inválido';
  }

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const roleError = validateRole(roleId);
  if (roleError) errors.role = roleError;

  return errors;
};

// Logging para desarrollo
if (__DEV__) {
  console.log('📝 Sistema de registro cargado');
  console.log('✅ Validaciones implementadas:');
  console.log('  - Nombre: 3-50 chars, 2+ palabras, solo letras');
  console.log('  - Email: formato válido');
  console.log('  - Contraseña: 6+ chars, letra + número, sin espacios');
  console.log('  - Rol: selección obligatoria');
}