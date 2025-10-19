import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
}

export default function Header({ 
  title, 
  showProfile = true 
}: HeaderProps) {
  const { theme, fontSizes, highContrast, colorBlindMode, darkMode, screenReaderEnabled, speakAction } = useThemedStyles();
  const { setDarkMode } = useAccessibility();
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Estados para cambiar contraseña
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Textos en español
  const texts = {
    settings: 'Configuración',
    darkMode: 'Modo Oscuro',
    close: 'Cerrar',
    userProfile: 'Perfil de Usuario',
    changePassword: 'Cambiar Contraseña',
    logout: 'Cerrar Sesión',
    logoutConfirm: '¿Estás seguro de que quieres cerrar sesión?',
    cancel: 'Cancelar',
    error: 'Error',
    logoutError: 'Error al cerrar sesión'
  };

  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  const handleProfilePress = () => {
    setShowUserMenu(true);
  };

  const handleChangePassword = async () => {
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
      texts.logout,
      texts.logoutConfirm,
      [
        {
          text: texts.cancel,
          style: 'cancel'
        },
        {
          text: texts.logout,
          style: 'destructive',
          onPress: async () => {
            try {
              setShowUserMenu(false);
              router.replace('/ingreso');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert(texts.error, texts.logoutError);
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
      backgroundColor: highContrast 
        ? 'rgba(0, 0, 0, 0.8)' 
        : colorBlindMode 
          ? 'rgba(0, 119, 190, 0.3)' // Azul distintivo
          : darkMode
            ? 'rgba(28, 28, 46, 0.3)'
            : 'rgba(0, 0, 0, 0.1)',
      borderBottomWidth: (highContrast || colorBlindMode) ? 2 : 0,
      borderBottomColor: colorBlindMode ? theme.colors.primary : theme.colors.border,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: highContrast 
        ? theme.colors.primary 
        : colorBlindMode 
          ? theme.colors.primary
          : 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: (highContrast || colorBlindMode) ? 2 : 0,
      borderColor: colorBlindMode ? theme.colors.secondary : theme.colors.textLight,
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
    settingOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
    },
    userOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
    },
    userOptionText: {
      flex: 1,
      marginLeft: 15,
      fontSize: fontSizes.base,
      color: theme.colors.textPrimary,
    },
    modalInput: {
      backgroundColor: darkMode ? theme.colors.surface : '#f5f5f5',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: fontSizes.base,
      color: theme.colors.textPrimary,
      borderWidth: 1,
      borderColor: darkMode ? theme.colors.border : '#e0e0e0',
    },
    inputLabel: {
      fontSize: fontSizes.caption * 1.1,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: 8,
      marginTop: 12,
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
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>
              {texts.settings}
            </Text>
            
            <TouchableOpacity
              style={dynamicStyles.settingOption}
              onPress={() => {
                setDarkMode(!darkMode);
                if (screenReaderEnabled) {
                  speakAction(
                    darkMode ? "Modo oscuro desactivado" : "Modo oscuro activado",
                    "Los colores de la aplicación han cambiado"
                  );
                }
              }}
              accessibilityLabel={`${texts.darkMode}: ${darkMode ? 'Activado' : 'Desactivado'}`}
              accessibilityRole="switch"
              accessibilityState={{ checked: darkMode }}
            >
              <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color={theme.colors.textPrimary} />
              <Text style={dynamicStyles.settingText}>{texts.darkMode}</Text>
              <Ionicons 
                name={darkMode ? "toggle" : "toggle-outline"} 
                size={24} 
                color={darkMode ? "#4CAF50" : "#ccc"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
              accessibilityLabel={texts.close}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>{texts.close}</Text>
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
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>
              {texts.userProfile}
            </Text>
            
            <TouchableOpacity
              style={dynamicStyles.userOption}
              onPress={() => {
                setShowUserMenu(false);
                setShowChangePasswordModal(true);
              }}
              accessibilityLabel={texts.changePassword}
              accessibilityRole="button"
            >
              <Ionicons name="lock-closed-outline" size={24} color={theme.colors.textPrimary} />
              <Text style={dynamicStyles.userOptionText}>{texts.changePassword}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={dynamicStyles.userOption}
              onPress={handleLogout}
              accessibilityLabel={texts.logout}
              accessibilityRole="button"
            >
              <Ionicons name="log-out-outline" size={24} color="#f44336" />
              <Text style={[dynamicStyles.userOptionText, { color: '#f44336' }]}>
                {texts.logout}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUserMenu(false)}
              accessibilityLabel={texts.close}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>{texts.close}</Text>
            </TouchableOpacity>
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
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>
              {texts.changePassword}
            </Text>
            
            <Text style={dynamicStyles.inputLabel}>Contraseña Actual</Text>
            <TextInput
              style={dynamicStyles.modalInput}
              placeholder="Ingresa tu contraseña actual"
              placeholderTextColor={theme.colors.textMuted}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={dynamicStyles.inputLabel}>Nueva Contraseña</Text>
            <TextInput
              style={dynamicStyles.modalInput}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={theme.colors.textMuted}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={dynamicStyles.inputLabel}>Confirmar Nueva Contraseña</Text>
            <TextInput
              style={dynamicStyles.modalInput}
              placeholder="Confirma tu nueva contraseña"
              placeholderTextColor={theme.colors.textMuted}
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
                <Text style={styles.cancelButtonText}>{texts.cancel}</Text>
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
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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