// ==================== LOGIN ULTRA-ESPECÍFICO QUE SÍ VALIDA ====================
// Esta versión realmente valida credenciales y rechaza incorrectas

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  AuthError 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { Alert } from 'react-native';

// ==================== INTERFACES ====================

export interface LoginResult {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
  errorMessage?: string;
  errorCode?: string;
  errorDetails?: any;
}

// ==================== FUNCIÓN DE LOGIN CON VALIDACIÓN REAL ====================

export const loginConValidacion = async (email: string, password: string): Promise<LoginResult> => {
  console.log('🔐 ========== INICIANDO LOGIN CON VALIDACIÓN ==========');
  console.log('📧 Email recibido:', email);
  console.log('🔑 Password recibido:', password ? '***OCULTO***' : 'VACÍO');
  console.log('🔥 Estado de auth:', auth ? 'Configurado' : 'NO configurado');

  // VALIDACIONES PRELIMINARES ESTRICTAS
  if (!email) {
    console.log('❌ VALIDACIÓN FALLÓ: Email vacío');
    return {
      success: false,
      errorMessage: 'El email no puede estar vacío',
      errorCode: 'validation/empty-email'
    };
  }

  if (!password) {
    console.log('❌ VALIDACIÓN FALLÓ: Password vacío');
    return {
      success: false,
      errorMessage: 'La contraseña no puede estar vacía',
      errorCode: 'validation/empty-password'
    };
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    console.log('❌ VALIDACIÓN FALLÓ: Email inválido');
    return {
      success: false,
      errorMessage: 'Formato de email inválido',
      errorCode: 'validation/invalid-email'
    };
  }

  console.log('✅ Validaciones preliminares pasadas');

  try {
    console.log('🔥 Intentando autenticación con Firebase...');
    console.log('📧 Email procesado:', email.trim().toLowerCase());
    
    // INTENTAR AUTENTICACIÓN - AQUÍ ES DONDE DEBE FALLAR CON CREDENCIALES INCORRECTAS
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email.trim().toLowerCase(), 
      password
    );

    console.log('✅ Firebase Auth SUCCESS - Credenciales CORRECTAS');
    console.log('👤 Usuario autenticado:', userCredential.user.uid);
    console.log('📧 Email verificado:', userCredential.user.email);

    // Si llegamos aquí, las credenciales SON CORRECTAS
    const firebaseUser = userCredential.user;
    const token = await firebaseUser.getIdToken();

    // Intentar obtener datos adicionales
    let userData = null;
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        userData = userDoc.data();
        console.log('💾 Datos adicionales obtenidos:', userData?.name);
      }
    } catch (firestoreError) {
      console.warn('⚠️ Sin datos adicionales en Firestore');
    }

    const resultado = {
      success: true,
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData?.name || firebaseUser.displayName || 'Usuario',
        progress: userData?.progress || 0,
        roleId: userData?.roleId || 'role_student'
      },
      token: token,
      message: `¡Bienvenido de vuelta!`
    };

    console.log('🎉 LOGIN EXITOSO COMPLETO');
    return resultado;

  } catch (error: any) {
    // AQUÍ ES DONDE DEBEN CAER LAS CREDENCIALES INCORRECTAS
    console.log('❌ ========== ERROR DE FIREBASE AUTH ==========');
    console.log('❌ Error tipo:', typeof error);
    console.log('❌ Error code:', error?.code);
    console.log('❌ Error message:', error?.message);
    console.log('❌ Error completo:', error);

    // Verificar si es un error específico de Firebase
    if (error && error.code) {
      console.log('🔥 Es un error de Firebase Auth');
      
      let errorMessage = 'Error de autenticación';
      
      switch (error.code) {
        case 'auth/invalid-credential':
          console.log('❌ CREDENCIALES INVÁLIDAS');
          errorMessage = 'Email o contraseña incorrectos';
          break;
        case 'auth/wrong-password':
          console.log('❌ CONTRASEÑA INCORRECTA');
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/user-not-found':
          console.log('❌ USUARIO NO ENCONTRADO');
          errorMessage = 'No existe un usuario con ese email';
          break;
        case 'auth/invalid-email':
          console.log('❌ EMAIL INVÁLIDO');
          errorMessage = 'Formato de email inválido';
          break;
        case 'auth/user-disabled':
          console.log('❌ USUARIO DESHABILITADO');
          errorMessage = 'Esta cuenta ha sido deshabilitada';
          break;
        case 'auth/too-many-requests':
          console.log('❌ DEMASIADOS INTENTOS');
          errorMessage = 'Demasiados intentos fallidos. Espera un momento';
          break;
        case 'auth/network-request-failed':
          console.log('❌ ERROR DE RED');
          errorMessage = 'Error de conexión a internet';
          break;
        default:
          console.log('❌ ERROR DESCONOCIDO:', error.code);
          errorMessage = `Error de Firebase: ${error.message}`;
      }

      console.log('❌ Mensaje final:', errorMessage);
      
      return {
        success: false,
        errorMessage: errorMessage,
        errorCode: error.code,
        errorDetails: error
      };
    } else {
      // Error no relacionado con Firebase
      console.log('❌ ERROR NO ES DE FIREBASE');
      console.log('❌ Error genérico:', error);
      
      return {
        success: false,
        errorMessage: `Error inesperado: ${error?.message || 'Error desconocido'}`,
        errorCode: 'unknown/error',
        errorDetails: error
      };
    }
  }
};

// ==================== FUNCIÓN DE TESTING ESPECÍFICA ====================

export const probarCredencialesEspecificas = async () => {
  console.log('🧪 ========== PROBANDO CREDENCIALES ESPECÍFICAS ==========');

  // Test 1: Credenciales obviamente incorrectas
  console.log('\n🧪 TEST 1: Credenciales incorrectas');
  const test1 = await loginConValidacion('noexiste@ejemplo.com', 'passwordIncorrecto');
  console.log('Resultado Test 1:', test1.success ? '❌ INCORRECTO (debería fallar)' : '✅ CORRECTO (falló como esperado)');
  console.log('Mensaje:', test1.errorMessage);

  // Test 2: Email vacío
  console.log('\n🧪 TEST 2: Email vacío');
  const test2 = await loginConValidacion('', 'password');
  console.log('Resultado Test 2:', test2.success ? '❌ INCORRECTO' : '✅ CORRECTO');
  console.log('Mensaje:', test2.errorMessage);

  // Test 3: Password vacío
  console.log('\n🧪 TEST 3: Password vacío');
  const test3 = await loginConValidacion('test@email.com', '');
  console.log('Resultado Test 3:', test3.success ? '❌ INCORRECTO' : '✅ CORRECTO');
  console.log('Mensaje:', test3.errorMessage);

  // Test 4: Email mal formateado
  console.log('\n🧪 TEST 4: Email mal formateado');
  const test4 = await loginConValidacion('emailinvalido', 'password');
  console.log('Resultado Test 4:', test4.success ? '❌ INCORRECTO' : '✅ CORRECTO');
  console.log('Mensaje:', test4.errorMessage);

  console.log('\n🧪 ========== TESTING COMPLETADO ==========');
  
  // Mostrar resumen
  const resultados = [test1, test2, test3, test4];
  const exitosos = resultados.filter(r => r.success).length;
  const fallidos = resultados.filter(r => !r.success).length;
  
  console.log(`📊 RESUMEN: ${fallidos} tests fallaron correctamente, ${exitosos} tests pasaron incorrectamente`);
  
  if (exitosos > 0) {
    console.log('❌ PROBLEMA: Algunos tests que deberían fallar están pasando');
    Alert.alert(
      '❌ Problema Detectado', 
      `${exitosos} tests están pasando cuando deberían fallar. Tu login no está validando correctamente.`
    );
  } else {
    console.log('✅ PERFECTO: Todos los tests fallaron como esperado');
    Alert.alert(
      '✅ Validación Correcta', 
      'Las validaciones están funcionando correctamente. El sistema rechaza credenciales incorrectas.'
    );
  }

  return { exitosos, fallidos };
};

// ==================== FUNCIÓN PARA CREAR USUARIO Y PROBAR ====================

export const crearUsuarioYProbar = async () => {
  console.log('🧪 ========== CREAR USUARIO Y PROBAR LOGIN ==========');

  // Crear usuario único
  const timestamp = Date.now();
  const email = `test${timestamp}@prueba.com`;
  const password = 'Test123456';
  const name = 'Usuario Test';

  console.log(`📧 Creando usuario: ${email}`);
  
  try {
    // Registrar usuario
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    console.log('✅ Usuario creado exitosamente');
    
    // Probar login con credenciales correctas
    console.log('\n🔐 Probando login con credenciales CORRECTAS...');
    const loginCorrecto = await loginConValidacion(email, password);
    
    if (loginCorrecto.success) {
      console.log('✅ Login con credenciales correctas: EXITOSO');
    } else {
      console.log('❌ Login con credenciales correctas: FALLÓ (esto es un problema)');
    }
    
    // Probar login con contraseña incorrecta
    console.log('\n🔐 Probando login con contraseña INCORRECTA...');
    const loginIncorrecto = await loginConValidacion(email, 'passwordIncorrecto');
    
    if (!loginIncorrecto.success) {
      console.log('✅ Login con credenciales incorrectas: RECHAZADO (correcto)');
    } else {
      console.log('❌ Login con credenciales incorrectas: ACEPTADO (esto es un problema)');
    }

    Alert.alert(
      'Test Completado',
      `Usuario creado: ${email}\n\nLogin correcto: ${loginCorrecto.success ? 'OK' : 'FALLÓ'}\nLogin incorrecto: ${!loginIncorrecto.success ? 'RECHAZADO (OK)' : 'ACEPTADO (PROBLEMA)'}`
    );

    return {
      usuarioCreado: { email, password },
      loginCorrecto: loginCorrecto.success,
      loginIncorrecto: !loginIncorrecto.success
    };

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    Alert.alert('Error', `No se pudo crear usuario: ${error}`);
    return null;
  }
};

// ==================== LOGGING ====================

if (__DEV__) {
  console.log('🔧 LOGIN CON VALIDACIÓN ESTRICTA CARGADO');
  console.log('Funciones disponibles:');
  console.log('- loginConValidacion(email, password)');
  console.log('- probarCredencialesEspecificas()');
  console.log('- crearUsuarioYProbar()');
}