// ==================== TESTING Y DEPURACIÓN DEL LOGIN ====================
// Funciones para probar y debugear el sistema de login

import { loginUser, getCurrentUser, logoutUser } from './auth/login-backend';
import { registerUser } from './auth/register-backend';
import { createDefaultRoles } from './services/database';

// ==================== FUNCIÓN DE TESTING COMPLETA ====================

export const testearLogin = async () => {
  console.log('🧪 ========== INICIANDO PRUEBAS DE LOGIN ==========');
  
  // 1. Crear roles por defecto primero
  try {
    console.log('📋 Creando roles por defecto...');
    await createDefaultRoles();
    console.log('✅ Roles creados exitosamente');
  } catch (error) {
    console.log('⚠️ Error creando roles (puede que ya existan):', error);
  }

  // 2. Crear usuario de prueba
  console.log('\n👤 Creando usuario de prueba...');
  const testEmail = `test${Date.now()}@testing.com`;
  const testPassword = 'Testing123';
  const testName = 'Usuario Prueba';

  try {
    const registroResult = await registerUser(testName, testEmail, testPassword, 'role_student');
    
    if (registroResult.success) {
      console.log('✅ Usuario de prueba creado:', testEmail);
      console.log('📧 Email:', testEmail);
      console.log('🔑 Contraseña:', testPassword);
    } else {
      console.log('❌ Error creando usuario de prueba:', registroResult.errorMessage);
      return;
    }
  } catch (error) {
    console.log('❌ Error en registro de prueba:', error);
    return;
  }

  // 3. Probar login con credenciales correctas
  console.log('\n🔐 Probando login con credenciales CORRECTAS...');
  try {
    const loginResult = await loginUser(testEmail, testPassword);
    
    if (loginResult.success) {
      console.log('✅ LOGIN CORRECTO - Todo funciona!');
      console.log('👤 Usuario:', loginResult.user);
      console.log('🎫 Token obtenido:', loginResult.token ? 'SÍ' : 'NO');
    } else {
      console.log('❌ LOGIN FALLÓ con credenciales correctas:');
      console.log('Tipo de error:', loginResult.errorType);
      console.log('Mensaje:', loginResult.errorMessage);
      console.log('Código:', loginResult.errorCode);
    }
  } catch (error) {
    console.log('❌ Error inesperado en login correcto:', error);
  }

  // 4. Probar login con credenciales incorrectas
  console.log('\n🔐 Probando login con credenciales INCORRECTAS...');
  try {
    const loginIncorrecto = await loginUser(testEmail, 'passwordIncorrecto');
    
    if (loginIncorrecto.success) {
      console.log('❌ PROBLEMA: Login exitoso con contraseña incorrecta!');
    } else {
      console.log('✅ LOGIN RECHAZADO correctamente con contraseña incorrecta');
      console.log('Tipo de error:', loginIncorrecto.errorType);
      console.log('Mensaje:', loginIncorrecto.errorMessage);
    }
  } catch (error) {
    console.log('Error esperado con credenciales incorrectas:', error);
  }

  // 5. Probar con email inexistente
  console.log('\n📧 Probando login con email INEXISTENTE...');
  try {
    const loginInexistente = await loginUser('noexiste@testing.com', 'cualquierPassword');
    
    if (loginInexistente.success) {
      console.log('❌ PROBLEMA: Login exitoso con email inexistente!');
    } else {
      console.log('✅ LOGIN RECHAZADO correctamente con email inexistente');
      console.log('Tipo de error:', loginInexistente.errorType);
      console.log('Mensaje:', loginInexistente.errorMessage);
    }
  } catch (error) {
    console.log('Error esperado con email inexistente:', error);
  }

  // 6. Probar validaciones de campo vacío
  console.log('\n🔍 Probando validaciones de campos vacíos...');
  
  const testVacio1 = await loginUser('', testPassword);
  if (!testVacio1.success) {
    console.log('✅ Validación email vacío funcionando:', testVacio1.errorMessage);
  } else {
    console.log('❌ Validación email vacío NO funciona');
  }

  const testVacio2 = await loginUser(testEmail, '');
  if (!testVacio2.success) {
    console.log('✅ Validación contraseña vacía funcionando:', testVacio2.errorMessage);
  } else {
    console.log('❌ Validación contraseña vacía NO funciona');
  }

  console.log('\n🧪 ========== PRUEBAS COMPLETADAS ==========');
};

// ==================== FUNCIÓN SIMPLE PARA PROBAR LOGIN RÁPIDO ====================

export const probarLoginRapido = async (email: string, password: string) => {
  console.log(`🔐 Probando login para: ${email}`);
  
  try {
    const resultado = await loginUser(email, password);
    
    if (resultado.success) {
      console.log('✅ Login exitoso!');
      console.log('Usuario:', resultado.user?.name || resultado.user?.email);
      console.log('UID:', resultado.user?.uid);
      console.log('Progreso:', resultado.user?.progress + '%');
      return resultado;
    } else {
      console.log('❌ Login falló:');
      console.log('Error:', resultado.errorMessage);
      console.log('Tipo:', resultado.errorType);
      console.log('Código:', resultado.errorCode);
      return resultado;
    }
  } catch (error) {
    console.log('❌ Error inesperado:', error);
    return { success: false, error: 'Error inesperado' };
  }
};

// ==================== FUNCIÓN PARA VERIFICAR ESTADO ACTUAL ====================

export const verificarEstadoAuth = () => {
  console.log('🔍 Verificando estado de autenticación...');
  
  const user = getCurrentUser();
  
  if (user) {
    console.log('✅ Usuario autenticado:');
    console.log('- UID:', user.uid);
    console.log('- Email:', user.email);
    console.log('- Nombre:', user.displayName);
    console.log('- Verificado:', user.emailVerified);
    return true;
  } else {
    console.log('❌ No hay usuario autenticado');
    return false;
  }
};

// ==================== FUNCIÓN PARA LIMPIAR TESTING ====================

export const limpiarTesting = async () => {
  console.log('🧹 Limpiando datos de testing...');
  
  try {
    await logoutUser();
    console.log('✅ Sesión cerrada');
  } catch (error) {
    console.log('Error cerrando sesión:', error);
  }
};

// ==================== EXPORTAR PARA USO FÁCIL ====================

export const debugLogin = {
  test: testearLogin,
  quick: probarLoginRapido,
  status: verificarEstadoAuth,
  clean: limpiarTesting
};

// ==================== LOGGING PARA DESARROLLO ====================

if (__DEV__) {
  console.log('🧪 TESTING DE LOGIN CARGADO');
  console.log('Funciones disponibles:');
  console.log('- testearLogin() - Prueba completa del sistema');
  console.log('- probarLoginRapido(email, password) - Prueba rápida');
  console.log('- verificarEstadoAuth() - Ver estado actual');
  console.log('- limpiarTesting() - Limpiar datos de prueba');
  console.log('- debugLogin.* - Acceso rápido a todas las funciones');
}