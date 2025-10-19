import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  orderBy,
  limit,
  Timestamp,
  FirestoreDataConverter
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==================== INTERFACES ====================

export interface User {
  id?: string;
  name: string;
  email: string;
  progress?: number;
  completedActivities?: number;
  totalActivities?: number;
  roleId?: string;
  accessibilityPreferences?: object;
  lastActivityAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Role {
  id?: string;
  nombre: string;           // Español
  name?: string;            // Inglés (compatibilidad)
  descripcion?: string;
  value?: string;
  permissions?: string[];
  createdAt?: Date;
}

export interface ActivityProgress {
  id?: string;
  userId: string;
  activityId: string;
  activityName: string;
  completed: boolean;
  score?: number;
  attempts: number;
  completedAt?: Date | Timestamp;
  updatedAt: Date | Timestamp;
  createdAt: Date | Timestamp;
}

export interface UserStats {
  totalActivities: number;
  completedActivities: number;
  progress: number;
  averageScore: number;
  lastActivity?: Date;
}

// ==================== FUNCIONES DE USUARIO ====================

/**
 * Obtener usuario por ID
 */
export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: userDoc.id,
        ...userData,
        createdAt: userData.createdAt?.toDate(),
        updatedAt: userData.updatedAt?.toDate(),
        lastActivityAt: userData.lastActivityAt?.toDate(),
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    throw error;
  }
};

/**
 * Crear nuevo usuario en Firestore
 */
export const createUser = async (userId: string, userData: Omit<User, 'id'>): Promise<void> => {
  try {
    const userWithDefaults = {
      ...userData,
      progress: userData.progress || 0,
      completedActivities: userData.completedActivities || 0,
      totalActivities: userData.totalActivities || 12, // Total de actividades disponibles
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(doc(db, 'users', userId), userWithDefaults);
    console.log('✅ Usuario creado en Firestore:', userId);
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    throw error;
  }
};

/**
 * Actualizar datos del usuario
 */
export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    const updateData = {
      ...userData,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(doc(db, 'users', userId), updateData);
    console.log('✅ Usuario actualizado:', userId);
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    throw error;
  }
};

// ==================== FUNCIONES DE ROLES ====================

/**
 * Obtener todos los roles disponibles
 */
export const getRoles = async (): Promise<Role[]> => {
  try {
    const rolesCollection = collection(db, 'roles');
    const rolesSnapshot = await getDocs(rolesCollection);
    
    return rolesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Role[];
  } catch (error) {
    console.error('❌ Error obteniendo roles:', error);
    // Retornar roles por defecto si hay error
    return [
      { 
        id: 'role_student', 
        nombre: 'Alumno', 
        name: 'Student',
        value: 'student',
        descripcion: 'Estudiante que puede acceder a las actividades educativas',
        permissions: ['view_lessons', 'complete_activities']
      },
      { 
        id: 'role_teacher', 
        nombre: 'Profesor', 
        name: 'Teacher',
        value: 'teacher',
        descripcion: 'Profesor que puede gestionar estudiantes y ver progreso',
        permissions: ['view_lessons', 'complete_activities', 'view_student_progress']
      }
    ];
  }
};

/**
 * Crear roles por defecto (ejecutar una sola vez)
 */
export const createDefaultRoles = async (): Promise<void> => {
  try {
    const defaultRoles = [
      {
        nombre: 'Alumno',
        name: 'Student',
        value: 'student',
        descripcion: 'Estudiante que puede acceder a las actividades educativas',
        permissions: ['view_lessons', 'complete_activities'],
        createdAt: Timestamp.now()
      },
      {
        nombre: 'Profesor',
        name: 'Teacher', 
        value: 'teacher',
        descripcion: 'Profesor que puede gestionar estudiantes y ver progreso',
        permissions: ['view_lessons', 'complete_activities', 'view_student_progress'],
        createdAt: Timestamp.now()
      }
    ];

    for (const role of defaultRoles) {
      await setDoc(doc(db, 'roles', `role_${role.value}`), role);
    }

    console.log('✅ Roles por defecto creados');
  } catch (error) {
    console.error('❌ Error creando roles por defecto:', error);
  }
};

// ==================== FUNCIONES DE PROGRESO ====================

/**
 * Guardar progreso de actividad
 */
export const saveActivityProgress = async (
  userId: string,
  activityId: string,
  activityName: string,
  completed: boolean,
  score?: number
): Promise<void> => {
  try {
    // Buscar si ya existe un registro para esta actividad
    const progressQuery = query(
      collection(db, 'activityProgress'),
      where('userId', '==', userId),
      where('activityId', '==', activityId)
    );
    
    const existingProgress = await getDocs(progressQuery);
    const now = Timestamp.now();

    if (existingProgress.empty) {
      // Crear nuevo registro
      const newProgress = {
        userId,
        activityId,
        activityName,
        completed,
        score: score || 0,
        attempts: 1,
        completedAt: completed ? now : undefined,
        createdAt: now,
        updatedAt: now,
      };

      await addDoc(collection(db, 'activityProgress'), newProgress);
    } else {
      // Actualizar registro existiente
      const progressDoc = existingProgress.docs[0];
      const currentData = progressDoc.data();
      
      const updatedProgress = {
        completed,
        score: score || currentData.score || 0,
        attempts: (currentData.attempts || 0) + 1,
        completedAt: completed ? now : currentData.completedAt,
        updatedAt: now,
      };

      await updateDoc(progressDoc.ref, updatedProgress);
    }

    // Actualizar estadísticas del usuario
    await updateUserStats(userId);
    
    console.log('✅ Progreso de actividad guardado:', activityId);
  } catch (error) {
    console.error('❌ Error guardando progreso:', error);
    throw error;
  }
};

/**
 * Actualizar estadísticas generales del usuario
 */
export const updateUserStats = async (userId: string): Promise<void> => {
  try {
    // Obtener todo el progreso del usuario
    const progressQuery = query(
      collection(db, 'activityProgress'),
      where('userId', '==', userId)
    );
    
    const progressSnapshot = await getDocs(progressQuery);
    const userProgress = progressSnapshot.docs.map(doc => doc.data());

    // Calcular estadísticas
    const completedActivities = userProgress.filter(p => p.completed).length;
    const totalActivities = 12; // Total de actividades en la app
    const progress = Math.round((completedActivities / totalActivities) * 100);
    
    const scores = userProgress.filter(p => p.completed && p.score).map(p => p.score);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Encontrar última actividad
    const lastActivity = userProgress
      .filter(p => p.completedAt)
      .sort((a, b) => b.completedAt.seconds - a.completedAt.seconds)[0];

    // Actualizar usuario
    const updateData = {
      progress,
      completedActivities,
      totalActivities,
      lastActivityAt: lastActivity ? lastActivity.completedAt : undefined,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(doc(db, 'users', userId), updateData);
    console.log('✅ Estadísticas de usuario actualizadas');
  } catch (error) {
    console.error('❌ Error actualizando estadísticas:', error);
  }
};

/**
 * Obtener estadísticas detalladas del usuario
 */
export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    // Obtener usuario
    const user = await getUser(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener progreso de actividades
    const progressQuery = query(
      collection(db, 'activityProgress'),
      where('userId', '==', userId),
      where('completed', '==', true),
      orderBy('completedAt', 'desc')
    );
    
    const progressSnapshot = await getDocs(progressQuery);
    const completedActivities = progressSnapshot.docs.map(doc => doc.data());

    // Calcular promedio de puntuaciones
    const scores = completedActivities.filter(p => p.score).map(p => p.score);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return {
      totalActivities: user.totalActivities || 12,
      completedActivities: user.completedActivities || 0,
      progress: user.progress || 0,
      averageScore,
      lastActivity: user.lastActivityAt,
    };
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    throw error;
  }
};

/**
 * Obtener progreso de actividades del usuario
 */
export const getUserActivityProgress = async (userId: string): Promise<ActivityProgress[]> => {
  try {
    const progressQuery = query(
      collection(db, 'activityProgress'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const progressSnapshot = await getDocs(progressQuery);
    
    return progressSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    })) as ActivityProgress[];
  } catch (error) {
    console.error('❌ Error obteniendo progreso de actividades:', error);
    throw error;
  }
};

// ==================== UTILIDADES ====================

/**
 * Verificar si una actividad está completada
 */
export const isActivityCompleted = async (userId: string, activityId: string): Promise<boolean> => {
  try {
    const progressQuery = query(
      collection(db, 'activityProgress'),
      where('userId', '==', userId),
      where('activityId', '==', activityId),
      where('completed', '==', true),
      limit(1)
    );
    
    const progressSnapshot = await getDocs(progressQuery);
    return !progressSnapshot.empty;
  } catch (error) {
    console.error('❌ Error verificando actividad completada:', error);
    return false;
  }
};

/**
 * Obtener puntuación de una actividad específica
 */
export const getActivityScore = async (userId: string, activityId: string): Promise<number> => {
  try {
    const progressQuery = query(
      collection(db, 'activityProgress'),
      where('userId', '==', userId),
      where('activityId', '==', activityId),
      orderBy('updatedAt', 'desc'),
      limit(1)
    );
    
    const progressSnapshot = await getDocs(progressQuery);
    
    if (!progressSnapshot.empty) {
      const data = progressSnapshot.docs[0].data();
      return data.score || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('❌ Error obteniendo puntuación:', error);
    return 0;
  }
};

// Logging para desarrollo
if (__DEV__) {
  console.log('💾 Servicios de base de datos cargados');
}