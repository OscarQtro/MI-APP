// ==================== COMPONENTE DE TESTING PARA TU APP ====================
// Añade este componente temporalmente a cualquier pantalla para probar

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { testAuth } from './test-auth-corregido';
import { loginUsuario, registrarUsuario, diagnosticarFirebase } from './auth-corregido';

export const TestingComponent = () => {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLog = () => {
    setLog([]);
  };

  const ejecutarTestCompleto = async () => {
    setLoading(true);
    clearLog();
    addLog('🧪 Iniciando test completo...');
    
    try {
      // Sobrescribir console.log temporalmente para capturar logs
      const originalLog = console.log;
      console.log = (message: any, ...args: any[]) => {
        const fullMessage = [message, ...args].join(' ');
        setLog(prev => [...prev, fullMessage]);
        originalLog(message, ...args);
      };

      await testAuth.todo();
      
      // Restaurar console.log
      console.log = originalLog;
      
      addLog('✅ Test completado');
      Alert.alert('Test Completado', 'Revisa los logs para ver los resultados');
      
    } catch (error) {
      addLog(`❌ Error en test: ${error}`);
      Alert.alert('Error', `Error en el test: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const probarSoloRegistro = async () => {
    setLoading(true);
    addLog('📝 Probando solo registro...');
    
    try {
      const timestamp = Date.now();
      const resultado = await registrarUsuario(
        'Usuario Test',
        `test${timestamp}@prueba.com`,
        'Test123456',
        'role_student'
      );

      if (resultado.success) {
        addLog(`✅ Registro exitoso: ${resultado.user?.email}`);
        addLog(`👤 Usuario: ${resultado.user?.name}`);
        addLog(`🆔 UID: ${resultado.user?.uid}`);
        Alert.alert('Registro Exitoso', `Usuario creado: ${resultado.user?.email}`);
      } else {
        addLog(`❌ Registro falló: ${resultado.errorMessage}`);
        Alert.alert('Error de Registro', resultado.errorMessage || 'Error desconocido');
      }
    } catch (error) {
      addLog(`❌ Error inesperado: ${error}`);
      Alert.alert('Error', `Error inesperado: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const probarSoloLogin = async () => {
    setLoading(true);
    addLog('🔐 Probando login...');
    
    // Usar credenciales de ejemplo (deberás cambiarlas)
    const email = 'test@prueba.com';
    const password = 'Test123456';
    
    try {
      const resultado = await loginUsuario(email, password);

      if (resultado.success) {
        addLog(`✅ Login exitoso: ${resultado.user?.email}`);
        addLog(`👤 Usuario: ${resultado.user?.name}`);
        addLog(`📊 Progreso: ${resultado.user?.progress}%`);
        Alert.alert('Login Exitoso', `Bienvenido: ${resultado.user?.name}`);
      } else {
        addLog(`❌ Login falló: ${resultado.errorMessage}`);
        Alert.alert('Error de Login', resultado.errorMessage || 'Error desconocido');
      }
    } catch (error) {
      addLog(`❌ Error inesperado: ${error}`);
      Alert.alert('Error', `Error inesperado: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const ejecutarDiagnostico = async () => {
    setLoading(true);
    addLog('🔍 Ejecutando diagnóstico...');
    
    try {
      const originalLog = console.log;
      console.log = (message: any, ...args: any[]) => {
        const fullMessage = [message, ...args].join(' ');
        setLog(prev => [...prev, fullMessage]);
        originalLog(message, ...args);
      };

      await diagnosticarFirebase();
      
      console.log = originalLog;
      addLog('✅ Diagnóstico completado');
      
    } catch (error) {
      addLog(`❌ Error en diagnóstico: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Testing de Autenticación</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={ejecutarTestCompleto}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Ejecutando...' : '🧪 Test Completo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={probarSoloRegistro}
          disabled={loading}
        >
          <Text style={styles.buttonText}>📝 Solo Registro</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={probarSoloLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>🔐 Solo Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={ejecutarDiagnostico}
          disabled={loading}
        >
          <Text style={styles.buttonText}>🔍 Diagnóstico</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearLog}
        >
          <Text style={styles.buttonText}>🗑️ Limpiar Log</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.logTitle}>📋 Logs:</Text>
      <ScrollView style={styles.logContainer}>
        {log.map((item, index) => (
          <Text key={index} style={styles.logItem}>
            {item}
          </Text>
        ))}
        {log.length === 0 && (
          <Text style={styles.emptyLog}>No hay logs aún. Ejecuta algún test.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
  },
  logItem: {
    color: '#00FF00',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  emptyLog: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TestingComponent;