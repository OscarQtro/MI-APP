# 📱 KIDIQUO - Aplicación Educativa

> **Plataforma educativa interactiva con 4 juegos dinámicos y sistema de autenticación completo**

## 🎯 **DESCRIPCIÓN**

KIDIQUO es una aplicación móvil educativa desarrollada con **React Native** y **Expo**, que ofrece una experiencia de aprendizaje interactiva a través de juegos educativos, con un robusto sistema de autenticación y base de datos en tiempo real.

## ✨ **CARACTERÍSTICAS PRINCIPALES**

### 🎮 **4 Juegos Educativos:**
- 🔤 **CazaLetras** - Juego de búsqueda de letras y palabras
- 🗣️ **DiloTú** - Actividad de expresión oral y vocabulario  
- 🔺 **GeoSopa** - Geometría y formas interactivas
- 📍 **PuntoGo** - Ubicación espacial y coordenadas

### 🔐 **Sistema de Autenticación:**
- ✅ Registro de usuarios con validación
- ✅ Login seguro con Firebase Auth
- ✅ Gestión de sesiones persistentes
- ✅ Perfiles de usuario dinámicos

### ♿ **Accesibilidad Completa:**
- 🔊 Text-to-speech integrado
- 🎨 Temas de alto contraste
- 🌈 Soporte para daltonismo
- 📱 Navegación asistida

### 💾 **Base de Datos en Tiempo Real:**
- 🔥 Firebase Firestore
- 📊 Progreso del estudiante
- 👤 Perfiles personalizados
- 📈 Estadísticas detalladas

## 🚀 **TECNOLOGÍAS UTILIZADAS**

### **Frontend:**
- ⚛️ **React Native** - Framework móvil
- 🎭 **Expo** - Plataforma de desarrollo
- 📱 **Expo Router** - Navegación
- 🎨 **React Native StyleSheet** - Estilos

### **Backend:**
- 🔥 **Firebase Auth** - Autenticación
- 💾 **Firestore** - Base de datos NoSQL
- ☁️ **Firebase Storage** - Almacenamiento de archivos

### **Desarrollo:**
- 📘 **TypeScript** - Tipado estático
- 🛠️ **EAS Build** - Compilación
- 🧪 **Testing integrado** - Pruebas automatizadas

## 📁 **ESTRUCTURA DEL PROYECTO**

```
MI-APP/
├── 📱 app/                  # Pantallas principales
├── 🎮 features/             # Juegos educativos
├── 🔐 src/auth/            # Autenticación
├── 💾 services/            # Servicios de datos
├── 🎨 components/          # Componentes UI
├── ⚙️ config/              # Configuraciones
└── 📚 assets/              # Recursos multimedia
```

*Ver [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) para detalles completos*

## 🛠️ **INSTALACIÓN Y USO**

### **Prerrequisitos:**
- Node.js 18+
- Expo CLI
- Android Studio / Xcode (opcional)

### **Instalación:**
```bash
# Clonar repositorio
git clone https://github.com/OscarQtro/MI-APP.git
cd MI-APP

# Instalar dependencias
npm install

# Iniciar desarrollo
npm start
```

### **Ejecución:**
```bash
# Expo Go (móvil)
npm start  # Escanear QR

# Web browser
npm run web

# Emulador Android
npm run android
```

## 🎮 **GUÍA DE USO**

### **Para Estudiantes:**
1. 📝 **Registro** - Crear cuenta con nombre y email
2. 🔑 **Login** - Iniciar sesión segura
3. 🎯 **Actividades** - Elegir entre 4 juegos
4. 📊 **Progreso** - Ver estadísticas personales

### **Para Desarrolladores:**
- 🔥 Firebase configurado automáticamente
- 🧪 Herramientas de debug incluidas
- 📱 Hot reload en desarrollo
- 🛠️ Build system integrado

## 🔧 **CONFIGURACIÓN**

### **Firebase Setup:**
```javascript
// config/firebase.ts
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id"
}
```

### **Variables de Entorno:**
```
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
```

## 📊 **FEATURES IMPLEMENTADAS**

- ✅ **Autenticación** - Login/Registro completo
- ✅ **4 Juegos** - CazaLetras, DiloTú, GeoSopa, PuntoGo
- ✅ **Base de Datos** - Firestore integrado
- ✅ **Accesibilidad** - TTS y temas adaptativos
- ✅ **Navegación** - Router nativo
- ✅ **Responsive** - Adaptable a dispositivos

## 🎯 **ROADMAP**

### **v2.0 - Próximas Funcionalidades:**
- 📈 Dashboard de profesores
- 🏆 Sistema de logros
- 👥 Multijugador en línea
- 📊 Analytics avanzados

## 🤝 **CONTRIBUIR**

1. Fork el repositorio
2. Crear branch feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 **LICENCIA**

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👥 **EQUIPO**

- **Desarrollo Principal:** OscarQtro
- **Backend & Firebase:** GitHub Copilot Assistant
- **UI/UX:** Equipo colaborativo

## 📞 **CONTACTO**

- 📧 **Email:** contacto@kidiquo.com
- 🐙 **GitHub:** [OscarQtro/MI-APP](https://github.com/OscarQtro/MI-APP)
- 🌐 **Website:** [kidiquo.com](https://kidiquo.com)

---

**📱 ¡Descarga KIDIQUO y transforma el aprendizaje en una aventura interactiva!**