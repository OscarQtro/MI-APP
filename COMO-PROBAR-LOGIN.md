# 🧪 GUÍA RÁPIDA PARA TESTING DEL LOGIN

## 🚀 CÓMO PROBAR TU LOGIN EN 3 PASOS

### **PASO 1: Abrir la consola de tu app**

1. Inicia tu app con `npm start`
2. Abre la consola de desarrollo (F12 en web o consola de React Native)

### **PASO 2: Ejecutar el test automático**

Copia y pega este código en la consola:

```javascript
// Importar las funciones de testing
import { ejecutarTodasLasPruebas } from './test-login';

// Ejecutar todas las pruebas
ejecutarTodasLasPruebas();
```

### **PASO 3: Ver los resultados**

Deberías ver algo como:

```
🧪 ========== TESTING COMPLETO DEL LOGIN ==========

PASO 1: Crear usuario de prueba
✅ Usuario creado exitosamente!
📧 Email: test1729123456@prueba.com
🔑 Contraseña: Test123456

PASO 2: Probar login correcto
✅ LOGIN EXITOSO!
👤 Usuario: Usuario Prueba
🎫 Token: Obtenido ✅

PASO 3: Probar login incorrecto
✅ LOGIN RECHAZADO CORRECTAMENTE
Mensaje: Correo o contraseña incorrectos

PASO 4: Probar validaciones
✅ Email vacío rechazado
✅ Contraseña vacía rechazada
✅ Email inválido rechazado

🎉 ========== TESTING COMPLETADO ==========
✅ Tu sistema de login está funcionando correctamente!
```

---

## 🔧 OTRAS OPCIONES DE TESTING

### **Opción A: Test rápido**

```javascript
import { testLogin } from './test-login';

// Crear usuario y probarlo inmediatamente
testLogin.crearYProbar();
```

### **Opción B: Probar con tus propias credenciales**

```javascript
import { testLogin } from './test-login';

// Si ya tienes un usuario registrado
testLogin.rapido('tu@email.com', 'tuPassword');
```

### **Opción C: Solo crear usuario de prueba**

```javascript
import { testLogin } from './test-login';

// Solo crear usuario para probar manualmente
testLogin.crear();
```

---

## 🎯 QUÉ ESPERAR

### **✅ Si todo funciona correctamente:**

- ✅ Usuario de prueba se crea exitosamente
- ✅ Login con credenciales correctas funciona
- ❌ Login con credenciales incorrectas es rechazado
- 🔍 Validaciones funcionan (email vacío, etc.)
- 🎫 Token se obtiene correctamente

### **❌ Si hay problemas:**

1. **"Cannot find module"**
   - Verificar que todos los archivos existan
   - Ejecutar `npm install firebase`

2. **"Firebase not configured"**
   - Verificar configuración en `config/firebase.ts`
   - Asegurar que Firebase Authentication esté habilitado

3. **"Network request failed"**
   - Verificar conexión a internet
   - Probar con datos móviles

---

## 🚨 SOLUCIÓN RÁPIDA SI NO FUNCIONA

### **Método alternativo simple:**

1. **Crear usuario manualmente en Firebase Console:**
   - Ir a Firebase Console → Authentication → Users
   - Añadir usuario: `test@prueba.com` con contraseña `Test123456`

2. **Probar login directamente:**
   ```javascript
   import { loginUser } from './auth/login-backend';
   
   // Probar login
   loginUser('test@prueba.com', 'Test123456').then(resultado => {
     if (resultado.success) {
       console.log('✅ Login funciona!', resultado.user);
     } else {
       console.log('❌ Login falló:', resultado.errorMessage);
     }
   });
   ```

---

## 📞 SI NECESITAS AYUDA

### **Información que necesito:**

1. **Qué ves en la consola** cuando ejecutas el test
2. **Errores específicos** si los hay
3. **En qué paso falla** el testing

### **Comandos de diagnóstico:**

```javascript
// Verificar configuración de Firebase
import { auth } from './config/firebase';
console.log('Firebase Auth:', auth);

// Verificar estado actual
import { getCurrentUser } from './auth/login-backend';
console.log('Usuario actual:', getCurrentUser());
```

---

## 🎉 ¡LISTO PARA PROBAR!

**Ejecuta este comando para empezar:**

```javascript
import { ejecutarTodasLasPruebas } from './test-login';
ejecutarTodasLasPruebas();
```

**O usa la versión corta:**

```javascript
import { testLogin } from './test-login';
testLogin.todo();
```

¡Tu sistema de login será probado completamente en menos de 30 segundos! 🚀