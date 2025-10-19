// ==================== PRUEBA SIMPLE EJECUTABLE ====================
// Este archivo puedes importarlo en cualquier pantalla de tu app

import { Alert } from 'react-native';
import { loginUsuario, registrarUsuario, diagnosticarFirebase } from './auth-corregido';

// ==================== FUNCIÓN SIMPLE DE TESTING ====================

export const ejecutarPruebaSimple = async () => {
  console.log('🧪 ========== INICIANDO PRUEBA SIMPLE ==========');
  
  try {
    // PASO 1: Diagnóstico
    console.log('PASO 1: Diagnóstico de Firebase');
    await diagnosticarFirebase();
    
    // PASO 2: Crear usuario
    console.log('\nPASO 2: Creando usuario de prueba');
    const timestamp = Date.now();
    const email = `test${timestamp}@prueba.com`;
    const password = 'Test123456';
    const name = 'Usuario Prueba';
    
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    const registro = await registrarUsuario(name, email, password, 'role_student');
    
    if (registro.success) {
      console.log('✅ REGISTRO EXITOSO!');
      console.log('Usuario:', registro.user);
      
      // PASO 3: Probar login
      console.log('\nPASO 3: Probando login');
      const login = await loginUsuario(email, password);
      
      if (login.success) {
        console.log('✅ LOGIN EXITOSO!');
        console.log('Usuario logueado:', login.user);
        
        Alert.alert(
          '🎉 ¡Éxito!',
          `Todo funciona correctamente!\n\nUsuario creado: ${email}\nLogin exitoso: ${login.user?.name}`,
          [{ text: 'Genial!' }]
        );
        
        return { 
          success: true, 
          mensaje: 'Sistema funcionando correctamente',
          credenciales: { email, password }
        };
        
      } else {
        console.log('❌ LOGIN FALLÓ:', login.errorMessage);
        Alert.alert('Error en Login', login.errorMessage);
        return { success: false, error: 'Login falló' };
      }
      
    } else {
      console.log('❌ REGISTRO FALLÓ:', registro.errorMessage);
      Alert.alert('Error en Registro', registro.errorMessage);
      return { success: false, error: 'Registro falló' };
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    Alert.alert('Error', `Error inesperado: ${error}`);
    return { success: false, error: error };
  }
};

// ==================== FUNCIÓN PARA PROBAR SOLO LOGIN ====================

export const probarLogin = async (email: string, password: string) => {
  console.log(`🔐 Probando login: ${email}`);
  
  try {
    const resultado = await loginUsuario(email, password);
    
    if (resultado.success) {
      console.log('✅ Login exitoso:', resultado.user);
      Alert.alert('Login Exitoso', `Bienvenido ${resultado.user?.name}!`);
      return resultado;
    } else {
      console.log('❌ Login falló:', resultado.errorMessage);
      Alert.alert('Error de Login', resultado.errorMessage);
      return resultado;
    }
  } catch (error) {
    console.error('Error inesperado:', error);
    Alert.alert('Error', `Error inesperado: ${error}`);
    return { success: false, error };
  }
};

// ==================== FUNCIÓN PARA PROBAR SOLO REGISTRO ====================

export const probarRegistro = async (name: string, email: string, password: string) => {
  console.log(`📝 Probando registro: ${email}`);
  
  try {
    const resultado = await registrarUsuario(name, email, password, 'role_student');
    
    if (resultado.success) {
      console.log('✅ Registro exitoso:', resultado.user);
      Alert.alert('Registro Exitoso', `Usuario creado: ${resultado.user?.name}!`);
      return resultado;
    } else {
      console.log('❌ Registro falló:', resultado.errorMessage);
      Alert.alert('Error de Registro', resultado.errorMessage);
      return resultado;
    }
  } catch (error) {
    console.error('Error inesperado:', error);
    Alert.alert('Error', `Error inesperado: ${error}`);
    return { success: false, error };
  }
};

// ==================== FUNCIÓN DE DIAGNÓSTICO RÁPIDO ====================

export const verificarFirebase = async () => {
  console.log('🔍 Verificando Firebase...');
  
  try {
    await diagnosticarFirebase();
    Alert.alert('Diagnóstico Completado', 'Revisa la consola para ver los resultados');
  } catch (error) {
    console.error('Error en diagnóstico:', error);
    Alert.alert('Error', `Error en diagnóstico: ${error}`);
  }
};

// ==================== EXPORTACIÓN SIMPLE ====================

export const pruebasRapidas = {
  todo: ejecutarPruebaSimple,
  login: probarLogin,
  registro: probarRegistro,
  diagnostico: verificarFirebase
};

// ==================== INSTRUCCIONES ====================

if (__DEV__) {
  console.log('🧪 PRUEBAS RÁPIDAS DISPONIBLES:');
  console.log('import { pruebasRapidas } from "./pruebas-rapidas";');
  console.log('pruebasRapidas.todo() - Prueba completa');
  console.log('pruebasRapidas.diagnostico() - Solo diagnóstico');
}