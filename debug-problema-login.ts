// ==================== PRUEBA INMEDIATA DEL PROBLEMA ====================
// Úsala para probar si el login realmente valida o acepta todo

import { loginConValidacion, probarCredencialesEspecificas, crearUsuarioYProbar } from './login-validacion-estricta';
import { Alert } from 'react-native';

// ==================== FUNCIÓN PARA PROBAR INMEDIATAMENTE ====================

export const probarProblemaLogin = async () => {
  console.log('🚨 ========== PROBANDO EL PROBLEMA DEL LOGIN ==========');
  
  Alert.alert(
    '🧪 Iniciando Prueba',
    'Vamos a probar si tu login acepta credenciales incorrectas. Revisa la consola.',
    [{ text: 'OK' }]
  );

  // PRUEBA 1: Credenciales obviamente falsas
  console.log('\n🧪 PRUEBA 1: Credenciales obviamente falsas');
  console.log('Email: fake@noexiste.com');
  console.log('Password: passwordFalso123');
  
  const resultadoFalso = await loginConValidacion('fake@noexiste.com', 'passwordFalso123');
  
  console.log('🔍 RESULTADO PRUEBA 1:');
  console.log('Success:', resultadoFalso.success);
  console.log('Error:', resultadoFalso.errorMessage);
  console.log('Code:', resultadoFalso.errorCode);

  if (resultadoFalso.success) {
    console.log('❌ PROBLEMA CONFIRMADO: Login acepta credenciales falsas');
    Alert.alert(
      '❌ Problema Confirmado',
      'Tu login está aceptando credenciales falsas. Esto confirma el problema.',
      [{ text: 'Entendido' }]
    );
    return 'PROBLEMA_CONFIRMADO';
  } else {
    console.log('✅ Login rechaza credenciales falsas correctamente');
  }

  // PRUEBA 2: Email vacío
  console.log('\n🧪 PRUEBA 2: Email vacío');
  const resultadoVacio = await loginConValidacion('', 'password');
  
  if (resultadoVacio.success) {
    console.log('❌ PROBLEMA: Acepta email vacío');
  } else {
    console.log('✅ Rechaza email vacío correctamente');
  }

  // PRUEBA 3: Ejecutar todas las pruebas
  console.log('\n🧪 PRUEBA 3: Pruebas completas');
  await probarCredencialesEspecificas();

  console.log('\n🧪 ========== PRUEBAS COMPLETADAS ==========');
};

// ==================== FUNCIÓN PARA PROBAR CON USUARIO REAL ====================

export const probarConUsuarioReal = async () => {
  console.log('👤 ========== CREAR USUARIO REAL Y PROBAR ==========');
  
  Alert.alert(
    '👤 Creando Usuario Real',
    'Vamos a crear un usuario real y probar el login con él.',
    [{ text: 'OK' }]
  );

  const resultado = await crearUsuarioYProbar();
  
  if (resultado) {
    console.log('📊 RESULTADOS:');
    console.log('Usuario creado:', resultado.usuarioCreado);
    console.log('Login correcto funcionó:', resultado.loginCorrecto);
    console.log('Login incorrecto fue rechazado:', resultado.loginIncorrecto);
    
    if (resultado.loginCorrecto && resultado.loginIncorrecto) {
      Alert.alert(
        '✅ Login Funciona Correctamente',
        `Usuario: ${resultado.usuarioCreado.email}\n\n✅ Login correcto: OK\n✅ Login incorrecto: Rechazado`,
        [{ text: 'Perfecto!' }]
      );
    } else {
      Alert.alert(
        '❌ Hay Problemas',
        `Login correcto: ${resultado.loginCorrecto ? 'OK' : 'FALLÓ'}\nLogin incorrecto: ${resultado.loginIncorrecto ? 'Rechazado' : 'ACEPTADO (malo)'}`,
        [{ text: 'Revisar' }]
      );
    }
  }
};

// ==================== FUNCIÓN SIMPLE PARA AÑADIR A UNA PANTALLA ====================

export const ejecutarPruebasLogin = async () => {
  console.log('🚨 EJECUTANDO TODAS LAS PRUEBAS DEL LOGIN...');
  
  // Primero probar el problema
  await probarProblemaLogin();
  
  // Esperar un momento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Luego probar con usuario real
  await probarConUsuarioReal();
  
  console.log('✅ TODAS LAS PRUEBAS COMPLETADAS');
};

// ==================== EXPORTACIONES FÁCILES ====================

export const debugLogin = {
  problema: probarProblemaLogin,
  conUsuario: probarConUsuarioReal,
  todasLasPruebas: ejecutarPruebasLogin,
  login: loginConValidacion
};

// ==================== INSTRUCCIONES ====================

if (__DEV__) {
  console.log('🚨 DEBUG LOGIN CARGADO');
  console.log('');
  console.log('📋 INSTRUCCIONES DE USO:');
  console.log('1. import { debugLogin } from "./debug-problema-login";');
  console.log('2. debugLogin.problema() - Probar si acepta credenciales falsas');
  console.log('3. debugLogin.conUsuario() - Crear usuario real y probar');
  console.log('4. debugLogin.todasLasPruebas() - Ejecutar todas las pruebas');
  console.log('');
  console.log('🎯 PARA PROBAR TU PROBLEMA INMEDIATAMENTE:');
  console.log('debugLogin.problema()');
}