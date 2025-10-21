// ==================== CREAR USUARIO DE PRUEBA CON NOMBRE PERSONALIZADO ====================
// Úsalo para crear un usuario con tu nombre y ver el nombre dinámico

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/firebase';
import { createUser } from './services/database';

export const crearUsuarioConNombre = async (nombre: string, email: string, password: string) => {
  try {
    console.log('🔥 Creando usuario personalizado...');
    console.log('Nombre:', nombre);
    console.log('Email:', email);
    
    // Crear en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Usuario creado en Auth:', user.uid);
    
    // Crear en Firestore con el nombre personalizado
    await createUser(user.uid, {
      email: email,
      name: nombre, // 👈 Aquí va tu nombre personalizado
      createdAt: new Date(),
      progress: 0,
      completedActivities: 0,
      totalActivities: 4
    });
    
    console.log('✅ Usuario creado en Firestore con nombre:', nombre);
    
    console.log('🎯 CREDENCIALES PARA PROBAR:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Nombre que aparecerá:', nombre);
    
    return { 
      email, 
      password, 
      nombre,
      uid: user.uid,
      success: true 
    };
    
  } catch (error: any) {
    console.error('❌ Error creando usuario:', error.message);
    
    let errorMessage = "No se pudo crear el usuario";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "Este correo ya está registrado";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "La contraseña es muy débil";
    }
    
    return {
      error: errorMessage,
      success: false
    };
  }
};

// ==================== FUNCIONES RÁPIDAS PARA PROBAR ====================

export const crearErnesto = async () => {
  return await crearUsuarioConNombre(
    "Ernesto",
    "ernesto@test.com", 
    "123456"
  );
};

export const crearUsuarioPersonalizado = async (nombre: string) => {
  const email = `${nombre.toLowerCase().replace(/\s+/g, '')}@test.com`;
  return await crearUsuarioConNombre(nombre, email, "123456");
};

// ==================== EXPORTACIONES FÁCILES ====================

export const testUsuarios = {
  crearErnesto,
  crearPersonalizado: crearUsuarioPersonalizado,
  crearConDatos: crearUsuarioConNombre
};

// ==================== INSTRUCCIONES ====================

console.log('👤 CREAR USUARIO CON NOMBRE PERSONALIZADO:');
console.log('import { testUsuarios } from "./crear-usuario-personalizado";');
console.log('');
console.log('// Crear usuario "Ernesto"');
console.log('testUsuarios.crearErnesto()');
console.log('');
console.log('// Crear usuario con cualquier nombre');
console.log('testUsuarios.crearPersonalizado("Tu Nombre")');
console.log('');
console.log('// Crear con datos específicos');
console.log('testUsuarios.crearConDatos("Nombre", "email@test.com", "password")');