import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase para el proyecto KIDIQUO
const firebaseConfig = {
  apiKey: "AIzaSyCFB6tKZsu2F3rvvK-SQZUQOYPX_Pnm1nI",
  authDomain: "kidiquo.firebaseapp.com",
  projectId: "kidiquo",
  storageBucket: "kidiquo.firebasestorage.app",
  messagingSenderId: "676075089627",
  appId: "1:676075089627:web:ffd4722e22b47025ba26fe",
  measurementId: "G-05LGJ4D1Y2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios para uso en toda la aplicación
export const db = getFirestore(app);        // Base de datos Firestore
export const auth = getAuth(app);           // Servicio de autenticación
export const storage = getStorage(app);     // Almacenamiento de archivos

// Exportar la app por defecto
export default app;

// Configuración adicional para desarrollo
if (__DEV__) {
  console.log('🔥 Firebase configurado correctamente');
  console.log('📱 Proyecto:', firebaseConfig.projectId);
}