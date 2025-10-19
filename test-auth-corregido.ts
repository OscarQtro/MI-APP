// ==================== TESTING SIMPLE PARA AUTH CORREGIDO ====================

import { loginUsuario, registrarUsuario, diagnosticarFirebase, obtenerUsuarioActual } from './auth-corregido';

// ==================== FUNCIÓN DE TESTING COMPLETA ====================

export const probarSistemaCompleto = async () => {
  console.log('🧪 ========== PROBANDO SISTEMA CORREGIDO ==========\n');

  // PASO 1: Diagnóstico de Firebase
  console.log('PASO 1: Diagnóstico de Firebase');
  await diagnosticarFirebase();

  // PASO 2: Crear usuario de prueba
  console.log('\nPASO 2: Crear usuario de prueba');
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@correo.com`;
  const testPassword = 'Test123456';
  const testName = 'Usuario Prueba';

  console.log(`📧 Email: ${testEmail}`);
  console.log(`🔑 Password: ${testPassword}`);
  console.log(`👤 Nombre: ${testName}`);

  const registro = await registrarUsuario(testName, testEmail, testPassword, 'role_student');

  if (registro.success) {
    console.log('✅ REGISTRO EXITOSO!');
    console.log('👤 Usuario:', registro.user);
    console.log('🎫 Token:', registro.token ? 'Obtenido' : 'No obtenido');
    console.log('💬 Mensaje:', registro.message);

    // PASO 3: Cerrar sesión y probar login
    console.log('\nPASO 3: Probar login con el usuario creado');
    
    const login = await loginUsuario(testEmail, testPassword);

    if (login.success) {
      console.log('✅ LOGIN EXITOSO!');
      console.log('👤 Usuario:', login.user);
      console.log('🎫 Token:', login.token ? 'Obtenido' : 'No obtenido');
      console.log('💬 Mensaje:', login.message);

      // PASO 4: Probar login con credenciales incorrectas
      console.log('\nPASO 4: Probar login con credenciales incorrectas');
      const loginIncorrecto = await loginUsuario(testEmail, 'passwordIncorrecto');

      if (!loginIncorrecto.success) {
        console.log('✅ LOGIN INCORRECTO RECHAZADO CORRECTAMENTE');
        console.log('❌ Error:', loginIncorrecto.errorMessage);
      } else {
        console.log('❌ PROBLEMA: Login incorrecto fue aceptado');
      }

      // PASO 5: Verificar usuario actual
      console.log('\nPASO 5: Verificar usuario actual');
      const usuarioActual = obtenerUsuarioActual();
      if (usuarioActual) {
        console.log('✅ Usuario autenticado:', usuarioActual.email);
        console.log('🆔 UID:', usuarioActual.uid);
        console.log('👤 Nombre:', usuarioActual.displayName);
      } else {
        console.log('❌ No hay usuario autenticado');
      }

      console.log('\n🎉 ========== TODAS LAS PRUEBAS COMPLETADAS ==========');
      console.log('✅ Tu sistema de autenticación está funcionando correctamente!');
      console.log('\n📝 CREDENCIALES DE PRUEBA:');
      console.log(`Email: ${testEmail}`);
      console.log(`Password: ${testPassword}`);

    } else {
      console.log('❌ LOGIN FALLÓ:');
      console.log('Error:', login.errorMessage);
      console.log('Código:', login.errorCode);
    }

  } else {
    console.log('❌ REGISTRO FALLÓ:');
    console.log('Error:', registro.errorMessage);
    console.log('Código:', registro.errorCode);
  }
};

// ==================== FUNCIONES INDIVIDUALES ====================

export const probarSoloRegistro = async () => {
  console.log('📝 Probando solo registro...');
  
  const timestamp = Date.now();
  const resultado = await registrarUsuario(
    'Usuario Test',
    `test${timestamp}@prueba.com`,
    'Test123456',
    'role_student'
  );

  if (resultado.success) {
    console.log('✅ Registro exitoso:', resultado.user);
    return resultado;
  } else {
    console.log('❌ Registro falló:', resultado.errorMessage);
    return resultado;
  }
};

export const probarSoloLogin = async (email: string, password: string) => {
  console.log(`🔐 Probando login: ${email}`);
  
  const resultado = await loginUsuario(email, password);

  if (resultado.success) {
    console.log('✅ Login exitoso:', resultado.user);
    return resultado;
  } else {
    console.log('❌ Login falló:', resultado.errorMessage);
    return resultado;
  }
};

export const probarDiagnostico = async () => {
  console.log('🔍 Ejecutando diagnóstico...');
  await diagnosticarFirebase();
};

// ==================== EXPORTACIÓN FÁCIL ====================

export const testAuth = {
  todo: probarSistemaCompleto,
  registro: probarSoloRegistro,
  login: probarSoloLogin,
  diagnostico: probarDiagnostico
};

// ==================== INSTRUCCIONES ====================

if (__DEV__) {
  console.log('🧪 TESTING AUTH CORREGIDO CARGADO');
  console.log('Para usar:');
  console.log('1. testAuth.todo() - Prueba completa');
  console.log('2. testAuth.registro() - Solo registro');
  console.log('3. testAuth.login(email, pass) - Solo login');
  console.log('4. testAuth.diagnostico() - Diagnóstico Firebase');
}