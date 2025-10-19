// ==================== CREAR USUARIO DE PRUEBA ====================
// Úsalo para crear un usuario que puedas usar en el login

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/firebase';
import { createUser } from './services/database';

export const crearUsuarioPrueba = async () => {
  const email = 'prueba@test.com';
  const password = '123456';
  
  try {
    console.log('🔥 Creando usuario en Firebase Auth...');
    
    // Crear en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Usuario creado en Auth:', user.uid);
    
    // Crear en Firestore
    await createUser(user.uid, {
      email: email,
      name: 'Usuario Prueba',
      createdAt: new Date(),
      progress: 0,
      completedActivities: 0,
      totalActivities: 4
    });
    
    console.log('✅ Usuario creado en Firestore');
    
    console.log('🎯 CREDENCIALES PARA PROBAR:');
    console.log('Email:', email);
    console.log('Password:', password);
    
    return { email, password, uid: user.uid };
    
  } catch (error: any) {
    console.error('❌ Error creando usuario:', error.message);
    throw error;
  }
};

// Para usar fácilmente
export const debugCrearUsuario = {
  crear: crearUsuarioPrueba
};

console.log('📋 Para crear usuario de prueba:');
console.log('import { debugCrearUsuario } from "./crear-usuario-prueba";');
console.log('debugCrearUsuario.crear()');