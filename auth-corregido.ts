// ==================== SISTEMA DE LOGIN/REGISTRO CORREGIDO ====================
// Versión simplificada que asegura que funcione con Firebase

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

// ==================== INTERFACES ====================

export interface AuthResult {
  success: boolean;
  user?: {
    uid: string;
    email: string;
    name?: string;
    progress?: number;
    roleId?: string;
  };
  token?: string;
  message?: string;
  errorMessage?: string;
  errorCode?: string;
}

// ==================== FUNCIÓN DE LOGIN CORREGIDA ====================

export const loginUsuario = async (email: string, password: string): Promise<AuthResult> => {
  console.log('🔐 Iniciando login para:', email);

  try {
    // 1. Validaciones básicas
    if (!email || !password) {
      return {
        success: false,
        errorMessage: 'Email y contraseña son obligatorios',
        errorCode: 'validation/missing-fields'
      };
    }

    // 2. Autenticación con Firebase Auth
    console.log('🔥 Autenticando con Firebase...');
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const firebaseUser = userCredential.user;
    
    console.log('✅ Autenticación exitosa:', firebaseUser.uid);

    // 3. Intentar obtener datos adicionales de Firestore
    let userData = null;
    try {
      console.log('💾 Obteniendo datos de Firestore...');
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        userData = userDoc.data();
        console.log('✅ Datos de Firestore obtenidos:', userData);
      } else {
        console.log('⚠️ No hay datos adicionales en Firestore');
      }
    } catch (firestoreError) {
      console.warn('⚠️ Error obteniendo datos de Firestore (continuando sin ellos):', firestoreError);
    }

    // 4. Obtener token
    const token = await firebaseUser.getIdToken();

    // 5. Preparar respuesta
    const userResponse = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || email,
      name: userData?.name || firebaseUser.displayName || 'Usuario',
      progress: userData?.progress || 0,
      roleId: userData?.roleId || 'role_student'
    };

    console.log('🎉 Login completado exitosamente');
    return {
      success: true,
      user: userResponse,
      token: token,
      message: `¡Bienvenido ${userResponse.name}!`
    };

  } catch (error) {
    console.error('❌ Error en login:', error);
    
    // Manejo de errores específicos
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as AuthError;
      let errorMessage = 'Error de autenticación';
      
      switch (firebaseError.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          errorMessage = 'Correo o contraseña incorrectos';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Formato de correo inválido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Cuenta deshabilitada';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Espera un momento';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión';
          break;
        default:
          errorMessage = `Error: ${firebaseError.message}`;
      }

      return {
        success: false,
        errorMessage: errorMessage,
        errorCode: firebaseError.code
      };
    }

    return {
      success: false,
      errorMessage: 'Error inesperado durante el login',
      errorCode: 'unknown/error'
    };
  }
};

// ==================== FUNCIÓN DE REGISTRO CORREGIDA ====================

export const registrarUsuario = async (
  name: string, 
  email: string, 
  password: string, 
  roleId: string = 'role_student'
): Promise<AuthResult> => {
  console.log('📝 Iniciando registro para:', email);

  try {
    // 1. Validaciones básicas
    if (!name || !email || !password) {
      return {
        success: false,
        errorMessage: 'Todos los campos son obligatorios',
        errorCode: 'validation/missing-fields'
      };
    }

    if (name.length < 3) {
      return {
        success: false,
        errorMessage: 'El nombre debe tener al menos 3 caracteres',
        errorCode: 'validation/invalid-name'
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        errorMessage: 'La contraseña debe tener al menos 6 caracteres',
        errorCode: 'validation/weak-password'
      };
    }

    // 2. Crear usuario en Firebase Auth
    console.log('🔥 Creando usuario en Firebase Auth...');
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const firebaseUser = userCredential.user;
    
    console.log('✅ Usuario creado en Auth:', firebaseUser.uid);

    // 3. Actualizar perfil con nombre
    console.log('👤 Actualizando perfil...');
    await updateProfile(firebaseUser, {
      displayName: name.trim()
    });

    // 4. Crear documento en Firestore
    console.log('💾 Guardando datos en Firestore...');
    try {
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        progress: 0,
        completedActivities: 0,
        totalActivities: 12,
        roleId: roleId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      console.log('✅ Datos guardados en Firestore exitosamente');
      
    } catch (firestoreError) {
      console.warn('⚠️ Error guardando en Firestore (usuario creado en Auth):', firestoreError);
      // Continúa aunque Firestore falle, el usuario ya está creado en Auth
    }

    // 5. Obtener token
    const token = await firebaseUser.getIdToken();

    // 6. Preparar respuesta
    const userResponse = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || email,
      name: name.trim(),
      progress: 0,
      roleId: roleId
    };

    console.log('🎉 Registro completado exitosamente');
    return {
      success: true,
      user: userResponse,
      token: token,
      message: `¡Bienvenido ${name.trim()}! Tu cuenta ha sido creada.`
    };

  } catch (error) {
    console.error('❌ Error en registro:', error);
    
    // Manejo de errores específicos
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as AuthError;
      let errorMessage = 'Error en el registro';
      
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo ya está registrado';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Formato de correo inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Registro no permitido';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión';
          break;
        default:
          errorMessage = `Error: ${firebaseError.message}`;
      }

      return {
        success: false,
        errorMessage: errorMessage,
        errorCode: firebaseError.code
      };
    }

    return {
      success: false,
      errorMessage: 'Error inesperado durante el registro',
      errorCode: 'unknown/error'
    };
  }
};

// ==================== FUNCIÓN DE LOGOUT ====================

export const cerrarSesion = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    await auth.signOut();
    console.log('👋 Sesión cerrada exitosamente');
    return {
      success: true,
      message: 'Sesión cerrada correctamente'
    };
  } catch (error) {
    console.error('❌ Error cerrando sesión:', error);
    return {
      success: false,
      message: 'Error al cerrar sesión'
    };
  }
};

// ==================== FUNCIÓN PARA OBTENER USUARIO ACTUAL ====================

export const obtenerUsuarioActual = () => {
  return auth.currentUser;
};

// ==================== FUNCIÓN DE DIAGNÓSTICO ====================

export const diagnosticarFirebase = async () => {
  console.log('🔍 ========== DIAGNÓSTICO DE FIREBASE ==========');
  
  try {
    // 1. Verificar configuración
    console.log('📋 Verificando configuración...');
    console.log('Auth:', auth ? '✅ Configurado' : '❌ No configurado');
    console.log('Firestore:', db ? '✅ Configurado' : '❌ No configurado');
    
    // 2. Verificar usuario actual
    const currentUser = auth.currentUser;
    console.log('👤 Usuario actual:', currentUser ? currentUser.email : 'Ninguno');
    
    // 3. Probar escritura en Firestore
    console.log('💾 Probando escritura en Firestore...');
    try {
      const testDoc = doc(db, 'test', 'connection');
      await setDoc(testDoc, {
        timestamp: serverTimestamp(),
        test: true
      });
      console.log('✅ Firestore: Escritura exitosa');
    } catch (firestoreError) {
      console.log('❌ Firestore: Error de escritura:', firestoreError);
    }
    
    // 4. Probar lectura de Firestore
    console.log('📖 Probando lectura de Firestore...');
    try {
      const testDoc = doc(db, 'test', 'connection');
      const docSnap = await getDoc(testDoc);
      if (docSnap.exists()) {
        console.log('✅ Firestore: Lectura exitosa');
      } else {
        console.log('⚠️ Firestore: Documento no existe');
      }
    } catch (firestoreError) {
      console.log('❌ Firestore: Error de lectura:', firestoreError);
    }
    
    console.log('🔍 ========== DIAGNÓSTICO COMPLETADO ==========');
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  }
};

// ==================== LOGGING ====================

if (__DEV__) {
  console.log('🔧 Sistema de Auth corregido cargado');
  console.log('Funciones disponibles:');
  console.log('- loginUsuario(email, password)');
  console.log('- registrarUsuario(name, email, password, roleId)');
  console.log('- cerrarSesion()');
  console.log('- obtenerUsuarioActual()');
  console.log('- diagnosticarFirebase()');
}