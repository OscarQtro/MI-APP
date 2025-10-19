import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';

interface HeaderProps {
  title: string;
  showLanguageToggle?: boolean;
  showProfile?: boolean;
}

export default function Header({ 
  title, 
  showLanguageToggle = true, 
  showProfile = true 
}: HeaderProps) {
  const { theme, fontSizes, highContrast } = useThemedStyles();
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>('es');
  
  // Estados para cambiar nombre y contraseña
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Textos multiidioma simplificados
  const texts = {
    es: {
      settings: 'Configuración',
      darkMode: 'Modo Oscuro',
      close: 'Cerrar',
      userProfile: 'Perfil de Usuario',
      changeName: 'Cambiar Nombre',
      changePassword: 'Cambiar Contraseña',
      logout: 'Cerrar Sesión',
      logoutConfirm: '¿Estás seguro de que quieres cerrar sesión?',
      cancel: 'Cancelar',
      error: 'Error',
      logoutError: 'Error al cerrar sesión'
    },
    en: {
      settings: 'Settings',
      darkMode: 'Dark Mode',
      close: 'Close',
      userProfile: 'User Profile',
      changeName: 'Change Name',
      changePassword: 'Change Password',
      logout: 'Logout',
      logoutConfirm: 'Are you sure you want to logout?',
      cancel: 'Cancel',
      error: 'Error',
      logoutError: 'Logout error'
    }
  };
  
  const currentTexts = texts[currentLanguage as keyof typeof texts];

  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  const handleProfilePress = () => {
    setShowUserMenu(true);
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'es' ? 'en' : 'es');
  };

  const handleChangeName = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre');
      return;
    }

    try {
      setLoading(true);
      
      // Aquí puedes agregar la lógica para actualizar el nombre
      // cuando configures Firebase o tu backend
      
      Alert.alert('✅ Éxito', 'Tu nombre ha sido actualizado correctamente');
      setShowChangeNameModal(false);
      setNewName('');
    } catch (error: any) {
      console.error('Error al cambiar nombre:', error);
      Alert.alert('Error', 'No se pudo actualizar el nombre. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      
      // Aquí puedes agregar la lógica para cambiar la contraseña
      // cuando configures Firebase o tu backend
      
      Alert.alert('✅ Éxito', 'Tu contraseña ha sido actualizada correctamente');
      setShowChangePasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      Alert.alert('Error', 'No se pudo actualizar la contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      currentTexts.logout,
      currentTexts.logoutConfirm,
      [
        {
          text: currentTexts.cancel,
          style: 'cancel'
        },
        {
          text: currentTexts.logout,
          style: 'destructive',
          onPress: async () => {
            try {
              // Aquí puedes agregar la lógica de logout
              // cuando configures Firebase o tu backend
              setShowUserMenu(false);
              router.replace('/ingreso');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert(currentTexts.error, currentTexts.logoutError);
            }
          }
        }
      ]
    );
  };

  // Crear estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 15,
      backgroundColor: highContrast ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.1)',
      borderBottomWidth: highContrast ? 2 : 0,
      borderBottomColor: theme.colors.border,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: highContrast ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: highContrast ? 2 : 0,
      borderColor: theme.colors.textLight,
    },
    headerTitle: {
      color: theme.colors.textLight,
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: fontSizes.title,
      textShadowColor: highContrast ? 'rgba(0,0,0,0.8)' : 'transparent',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      padding: 20,
      width: '80%',
      maxWidth: 400,
      borderWidth: highContrast ? 2 : 0,
      borderColor: theme.colors.border,
    },
    modalTitle: {
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: theme.colors.textPrimary,
      fontSize: fontSizes.title,
    },
    settingText: {
      flex: 1,
      marginLeft: 15,
      fontSize: fontSizes.base,
      color: theme.colors.textPrimary,
    },
  });

  return (
    <View style={dynamicStyles.header}>
      {/* Settings Button */}
      <TouchableOpacity
        style={dynamicStyles.headerButton}
        onPress={handleSettingsPress}
        accessibilityLabel="Configuraciones"
        accessibilityRole="button"
      >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={dynamicStyles.headerTitle}>
        {title}
      </Text>

      {/* Right side buttons */}
      <View style={styles.rightButtons}>
        {/* Language Toggle */}
        {showLanguageToggle && (
          <TouchableOpacity
            style={styles.languageButton}
            onPress={handleLanguageToggle}
            accessibilityLabel={`Cambiar idioma a ${currentLanguage === 'es' ? 'inglés' : 'español'}`}
            accessibilityRole="button"
          >
            <Text style={styles.languageFlag}>
              {currentLanguage === 'es' ? '🇲🇽' : '🇺🇸'}
            </Text>
          </TouchableOpacity>
        )}

        {/* User Profile */}
        {showProfile && (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
            accessibilityLabel="Perfil de usuario"
            accessibilityRole="button"
          >
            <View style={styles.profileImage}>
              <Ionicons name="person" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentTexts.settings}
            </Text>
            
            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => {
                setDarkMode(!darkMode);
              }}
              accessibilityLabel={`${currentTexts.darkMode}: ${darkMode ? 'Activado' : 'Desactivado'}`}
              accessibilityRole="switch"
              accessibilityState={{ checked: darkMode }}
            >
              <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color="#333" />
              <Text style={styles.settingText}>{currentTexts.darkMode}</Text>
              <Ionicons 
                name={darkMode ? "toggle" : "toggle-outline"} 
                size={24} 
                color={darkMode ? "#4CAF50" : "#ccc"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
              accessibilityLabel={currentTexts.close}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>{currentTexts.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* User Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showUserMenu}
        onRequestClose={() => setShowUserMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentTexts.userProfile}
            </Text>
            
            <TouchableOpacity
              style={styles.userOption}
              onPress={() => {
                setShowUserMenu(false);
                setShowChangeNameModal(true);
              }}
              accessibilityLabel={currentTexts.changeName}
              accessibilityRole="button"
            >
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.userOptionText}>{currentTexts.changeName}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userOption}
              onPress={() => {
                setShowUserMenu(false);
                setShowChangePasswordModal(true);
              }}
              accessibilityLabel={currentTexts.changePassword}
              accessibilityRole="button"
            >
              <Ionicons name="lock-closed-outline" size={24} color="#333" />
              <Text style={styles.userOptionText}>{currentTexts.changePassword}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userOption}
              onPress={handleLogout}
              accessibilityLabel={currentTexts.logout}
              accessibilityRole="button"
            >
              <Ionicons name="log-out-outline" size={24} color="#f44336" />
              <Text style={[styles.userOptionText, { color: '#f44336' }]}>
                {currentTexts.logout}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUserMenu(false)}
              accessibilityLabel={currentTexts.close}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>{currentTexts.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Name Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChangeNameModal}
        onRequestClose={() => setShowChangeNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentTexts.changeName}
            </Text>
            
            <Text style={styles.inputLabel}>Nuevo Nombre</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa tu nuevo nombre"
              placeholderTextColor="#999"
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowChangeNameModal(false);
                  setNewName('');
                }}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>{currentTexts.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, loading && styles.disabledButton]}
                onPress={handleChangeName}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChangePasswordModal}
        onRequestClose={() => setShowChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentTexts.changePassword}
            </Text>
            
            <Text style={styles.inputLabel}>Contraseña Actual</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa tu contraseña actual"
              placeholderTextColor="#999"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Nueva Contraseña</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Confirma tu nueva contraseña"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowChangePasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>{currentTexts.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, loading && styles.disabledButton]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  languageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userOptionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#6BCDDD',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Nuevos estilos para modales de cambio
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#6BCDDD',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});