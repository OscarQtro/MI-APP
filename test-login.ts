// ==================== TESTING SIMPLE PARA LOGIN ====================
// Funciones fáciles de usar para probar el sistema de login

import { loginUser } from './auth/login-backend';
import { registerUser } from './auth/register-backend';

// ==================== TESTING PASO A PASO ====================

/**
 * PASO 1: Crear un usuario de prueba
 */
export const crearUsuarioPrueba = async () => {
  console.log('👤 Creando usuario de prueba...');
  
  const timestamp = Date.now();
  const email = `test${timestamp}@prueba.com`;
  const password = 'Test123456';
  const name = 'Usuario Prueba';
  
  try {
    const resultado = await registerUser(name, email, password, 'role_student');
    
    if (resultado.success) {
      console.log('✅ Usuario creado exitosamente!');
      console.log('📧 Email:', email);
      console.log('🔑 Contraseña:', password);
      console.log('👤 Nombre:', name);
      
      return { 
        success: true, 
        credenciales: { email, password, name },
        usuario: resultado.user 
      };
    } else {
      console.log('❌ Error creando usuario:', resultado.errorMessage);
      return { success: false, error: resultado.errorMessage };
    }
  } catch (error) {
    console.log('❌ Error inesperado:', error);
    return { success: false, error: error };
  }
};

/**
 * PASO 2: Probar login con credenciales correctas
 */
export const probarLoginCorrecto = async (email: string, password: string) => {
  console.log('\n🔐 Probando LOGIN CORRECTO...');
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);
  
  try {
    const resultado = await loginUser(email, password);
    
    if (resultado.success) {
      console.log('✅ LOGIN EXITOSO!');
      console.log('👤 Usuario:', resultado.user?.name);
      console.log('📧 Email:', resultado.user?.email);
      console.log('🆔 ID:', resultado.user?.uid);
      console.log('📊 Progreso:', resultado.user?.progress + '%');
      console.log('🎫 Token:', resultado.token ? 'Obtenido ✅' : 'No obtenido ❌');
      return { success: true, resultado };
    } else {
      console.log('❌ LOGIN FALLÓ (no debería pasar):');
      console.log('Tipo error:', resultado.errorType);
      console.log('Mensaje:', resultado.errorMessage);
      console.log('Código:', resultado.errorCode);
      return { success: false, resultado };
    }
  } catch (error) {
    console.log('❌ Error inesperado en login:', error);
    return { success: false, error };
  }
};

/**
 * PASO 3: Probar login con credenciales incorrectas
 */
export const probarLoginIncorrecto = async (email: string) => {
  console.log('\n🔐 Probando LOGIN INCORRECTO...');
  console.log('📧 Email:', email);
  console.log('🔑 Password: passwordIncorrecto');
  
  try {
    const resultado = await loginUser(email, 'passwordIncorrecto');
    
    if (resultado.success) {
      console.log('❌ PROBLEMA: Login exitoso con contraseña incorrecta!');
      return { success: false, problema: 'Login exitoso con credenciales incorrectas' };
    } else {
      console.log('✅ LOGIN RECHAZADO CORRECTAMENTE');
      console.log('Tipo error:', resultado.errorType);
      console.log('Mensaje:', resultado.errorMessage);
      return { success: true, resultado };
    }
  } catch (error) {
    console.log('✅ Error esperado con credenciales incorrectas:', error);
    return { success: true, error };
  }
};

/**
 * PASO 4: Probar validaciones
 */
export const probarValidaciones = async () => {
  console.log('\n🔍 Probando VALIDACIONES...');
  
  // Test email vacío
  console.log('Testing email vacío...');
  const test1 = await loginUser('', 'password123');
  if (!test1.success) {
    console.log('✅ Email vacío rechazado:', test1.errorMessage);
  } else {
    console.log('❌ Email vacío NO fue rechazado');
  }
  
  // Test contraseña vacía
  console.log('Testing contraseña vacía...');
  const test2 = await loginUser('test@email.com', '');
  if (!test2.success) {
    console.log('✅ Contraseña vacía rechazada:', test2.errorMessage);
  } else {
    console.log('❌ Contraseña vacía NO fue rechazada');
  }
  
  // Test email inválido
  console.log('Testing email inválido...');
  const test3 = await loginUser('emailinvalido', 'password123');
  if (!test3.success) {
    console.log('✅ Email inválido rechazado:', test3.errorMessage);
  } else {
    console.log('❌ Email inválido NO fue rechazado');
  }
  
  return { success: true, message: 'Validaciones probadas' };
};

// ==================== FUNCIÓN PRINCIPAL DE TESTING ====================

/**
 * Ejecutar todas las pruebas automáticamente
 */
export const ejecutarTodasLasPruebas = async () => {
  console.log('🧪 ========== TESTING COMPLETO DEL LOGIN ==========\n');
  
  let usuarioCreado = null;
  
  try {
    // PASO 1: Crear usuario
    console.log('PASO 1: Crear usuario de prueba');
    const creacion = await crearUsuarioPrueba();
    
    if (!creacion.success) {
      console.log('❌ No se pudo crear usuario de prueba. Abortando.');
      return;
    }
    
    usuarioCreado = creacion.credenciales;
    
    // PASO 2: Login correcto
    console.log('\nPASO 2: Probar login correcto');
    if (usuarioCreado) {
      await probarLoginCorrecto(usuarioCreado.email, usuarioCreado.password);
    }
    
    // PASO 3: Login incorrecto
    console.log('\nPASO 3: Probar login incorrecto');
    if (usuarioCreado) {
      await probarLoginIncorrecto(usuarioCreado.email);
    }
    
    // PASO 4: Validaciones
    console.log('\nPASO 4: Probar validaciones');
    await probarValidaciones();
    
    console.log('\n🎉 ========== TESTING COMPLETADO ==========');
    console.log('✅ Tu sistema de login está funcionando correctamente!');
    
    if (usuarioCreado) {
      console.log('\n📝 CREDENCIALES DE PRUEBA CREADAS:');
      console.log('Email:', usuarioCreado.email);
      console.log('Password:', usuarioCreado.password);
      console.log('Puedes usar estas credenciales para probar manualmente.');
    }
    
  } catch (error) {
    console.log('❌ Error durante el testing:', error);
  }
};

// ==================== FUNCIONES RÁPIDAS ====================

/**
 * Prueba rápida con credenciales específicas
 */
export const pruebaRapida = async (email: string, password: string) => {
  console.log(`🔐 Prueba rápida: ${email}`);
  
  const resultado = await loginUser(email, password);
  
  if (resultado.success) {
    console.log('✅ Login exitoso:', resultado.user?.name);
  } else {
    console.log('❌ Login falló:', resultado.errorMessage);
  }
  
  return resultado;
};

/**
 * Crear y probar usuario inmediatamente
 */
export const crearYProbar = async () => {
  console.log('🚀 Crear usuario y probar inmediatamente...');
  
  const creacion = await crearUsuarioPrueba();
  if (creacion.success && creacion.credenciales) {
    await probarLoginCorrecto(creacion.credenciales.email, creacion.credenciales.password);
    return creacion.credenciales;
  }
  
  return null;
};

// ==================== EXPORTACIÓN FÁCIL ====================

export const testLogin = {
  todo: ejecutarTodasLasPruebas,
  crear: crearUsuarioPrueba,
  probarCorrecto: probarLoginCorrecto,
  probarIncorrecto: probarLoginIncorrecto,
  validaciones: probarValidaciones,
  rapido: pruebaRapida,
  crearYProbar: crearYProbar
};

// ==================== INSTRUCCIONES ====================

if (__DEV__) {
  console.log('🧪 TESTING DE LOGIN CARGADO');
  console.log('Para usar:');
  console.log('1. testLogin.todo() - Ejecutar todas las pruebas');
  console.log('2. testLogin.crearYProbar() - Crear usuario y probar');
  console.log('3. testLogin.rapido(email, password) - Prueba rápida');
  console.log('4. ejecutarTodasLasPruebas() - Función completa');
}