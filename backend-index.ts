// ==================== BACKEND INDEX - PUNTO DE ENTRADA PRINCIPAL ====================
// Este archivo exporta todas las funciones del backend para fácil importación

// ==================== CONFIGURACIÓN ====================
export { db, auth, storage } from './config/firebase';

// ==================== AUTENTICACIÓN ====================
export {
  loginUser,
  logoutUser,
  getCurrentUser,
  isUserAuthenticated,
  isValidEmail,
  getCurrentUserToken,
  onAuthStateChanged,
  type LoginResponse,
  type LoginCredentials
} from './auth/login-backend';

export {
  registerUser,
  isValidName,
  isValidPassword,
  isValidRole,
  getPasswordStrength,
  getPasswordStrengthMessage,
  validateAllFields,
  type RegisterResponse,
  type RegisterData
} from './auth/register-backend';

// ==================== BASE DE DATOS ====================
export {
  getUser,
  createUser,
  updateUser,
  getRoles,
  createDefaultRoles,
  saveActivityProgress,
  updateUserStats,
  getUserStats,
  getUserActivityProgress,
  isActivityCompleted,
  getActivityScore,
  type User,
  type Role,
  type ActivityProgress,
  type UserStats
} from './services/database';

// ==================== INTEGRACIÓN RÁPIDA ====================
export {
  manejarLogin,
  manejarRegistro,
  manejarActividadCompletada,
  verificarAutenticacion,
  manejarCerrarSesion,
  ACTIVITY_IDS,
  ACTIVITY_NAMES,
  obtenerNombreActividad
} from './integracion-rapida';

// ==================== DEBUGGING ====================
export {
  testearLogin,
  probarLoginRapido,
  verificarEstadoAuth,
  limpiarTesting,
  debugLogin
} from './debug-login';

// ==================== FUNCIONES DE INICIALIZACIÓN ====================

/**
 * Inicializar el backend con configuración por defecto
 * Llama esta función una vez al inicio de tu app
 */
export const inicializarBackend = async () => {
  try {
    console.log('🚀 Inicializando backend MI-APP...');
    
    // Crear roles por defecto si no existen
    const { createDefaultRoles } = await import('./services/database');
    await createDefaultRoles();
    
    console.log('✅ Backend inicializado correctamente');
    console.log('🔥 Firebase: CONECTADO');
    console.log('🔐 Auth: LISTO');
    console.log('💾 Database: LISTO'); 
    console.log('📊 Progreso: ACTIVO');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error inicializando backend:', error);
    return { success: false, error };
  }
};

// ==================== CONSTANTES ÚTILES ====================

export const CONFIG = {
  TOTAL_ACTIVITIES: 12,
  DEFAULT_ROLE: 'role_student',
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 50,
  MAX_PASSWORD_LENGTH: 50
} as const;

export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_IN_USE: 'EMAIL_IN_USE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  USER_DISABLED: 'USER_DISABLED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

// ==================== LOGGING ====================

if (__DEV__) {
  console.log('📦 BACKEND MI-APP CARGADO EXITOSAMENTE');
  console.log('🔧 Servicios disponibles:');
  console.log('  - 🔐 Autenticación: Login/Registro');
  console.log('  - 💾 Base de datos: Firestore');
  console.log('  - 📊 Progreso: Seguimiento automático');
  console.log('  - 🚀 Integración: Funciones listas para usar');
  console.log('📚 Usa: import { loginUser, registerUser } from "./backend-index"');
}