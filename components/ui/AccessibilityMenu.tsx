import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface AccessibilityMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function AccessibilityMenu({ visible, onClose }: AccessibilityMenuProps) {
  const {
    highContrast,
    colorBlindMode,
    darkMode,
    fontSize,
    screenReaderEnabled,
    setHighContrast,
    setColorBlindMode,
    setDarkMode,
    setFontSize,
    setScreenReaderEnabled,
    speakText,
    getFontSize
  } = useAccessibility();

  const fontSizes = getFontSize();

  useEffect(() => {
    try {
      if (visible && screenReaderEnabled) {
        speakText("Menú de opciones de accesibilidad abierto. Aquí puedes configurar alto contraste, modo daltónico, lector de pantalla y tamaño de texto.");
      }
    } catch (error) {
      console.warn('Error en useEffect del AccessibilityMenu:', error);
    }
  }, [visible, screenReaderEnabled, speakText]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent, 
          { 
            minHeight: 450,
            backgroundColor: darkMode ? '#1C1C2E' : 'white'
          }
        ]}>
          <Text style={[
            styles.modalTitle, 
            { 
              fontSize: fontSizes.title,
              color: darkMode ? 'white' : '#333'
            }
          ]}>
            Opciones de Accesibilidad
          </Text>
          
          {/* Alto contraste */}
          <TouchableOpacity
            style={[styles.accessibilityOption, highContrast && styles.selectedOption]}
            onPress={() => {
              setHighContrast(!highContrast);
              speakText(highContrast ? "Alto contraste desactivado" : "Alto contraste activado");
            }}
            accessibilityLabel={`Alto contraste: ${highContrast ? 'Activado' : 'Desactivado'}`}
            accessibilityHint="Cambia a colores de alto contraste para mejor visibilidad"
            accessibilityRole="switch"
            accessibilityState={{ checked: highContrast }}
          >
            <Ionicons name="contrast" size={24} color={highContrast ? "white" : "#333"} />
            <Text style={[styles.accessibilityOptionText, { color: highContrast ? "white" : "#333" }]}>
              Alto Contraste
            </Text>
            <Ionicons 
              name={highContrast ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={highContrast ? "white" : "#333"} 
            />
          </TouchableOpacity>

          {/* Modo daltónico */}
          <TouchableOpacity
            style={[styles.accessibilityOption, colorBlindMode && styles.selectedOption]}
            onPress={() => {
              setColorBlindMode(!colorBlindMode);
              speakText(colorBlindMode ? "Modo daltónico desactivado" : "Modo daltónico activado");
            }}
            accessibilityLabel={`Modo daltónico: ${colorBlindMode ? 'Activado' : 'Desactivado'}`}
            accessibilityHint="Activa colores amigables para personas con daltonismo"
            accessibilityRole="switch"
            accessibilityState={{ checked: colorBlindMode }}
          >
            <Ionicons name="eye" size={24} color={colorBlindMode ? "white" : "#333"} />
            <Text style={[styles.accessibilityOptionText, { color: colorBlindMode ? "white" : "#333" }]}>
              Modo Daltónico
            </Text>
            <Ionicons 
              name={colorBlindMode ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={colorBlindMode ? "white" : "#333"} 
            />
          </TouchableOpacity>

          {/* Modo oscuro */}
          <TouchableOpacity
            style={[styles.accessibilityOption, darkMode && styles.selectedOption]}
            onPress={() => {
              setDarkMode(!darkMode);
              speakText(darkMode ? "Modo oscuro desactivado" : "Modo oscuro activado");
            }}
            accessibilityLabel={`Modo oscuro: ${darkMode ? 'Activado' : 'Desactivado'}`}
            accessibilityHint="Cambia a colores oscuros para reducir el brillo de la pantalla"
            accessibilityRole="switch"
            accessibilityState={{ checked: darkMode }}
          >
            <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color={darkMode ? "white" : "#333"} />
            <Text style={[styles.accessibilityOptionText, { color: darkMode ? "white" : "#333" }]}>
              Modo Oscuro
            </Text>
            <Ionicons 
              name={darkMode ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={darkMode ? "white" : "#333"} 
            />
          </TouchableOpacity>

          {/* Lector de pantalla */}
          <TouchableOpacity
            style={[styles.accessibilityOption, screenReaderEnabled && styles.selectedOption]}
            onPress={() => {
              const newState = !screenReaderEnabled;
              setScreenReaderEnabled(newState);
              if (newState) {
                Speech.speak("Lector de pantalla activado. Los elementos serán leídos en voz alta.");
              } else {
                Speech.speak("Lector de pantalla desactivado");
              }
            }}
            accessibilityLabel={`Lector de pantalla: ${screenReaderEnabled ? 'Activado' : 'Desactivado'}`}
            accessibilityHint="Activa la lectura en voz alta de los elementos de la pantalla"
            accessibilityRole="switch"
            accessibilityState={{ checked: screenReaderEnabled }}
          >
            <Ionicons name="volume-high" size={24} color={screenReaderEnabled ? "white" : "#333"} />
            <Text style={[styles.accessibilityOptionText, { color: screenReaderEnabled ? "white" : "#333" }]}>
              Lector de Pantalla
            </Text>
            <Ionicons 
              name={screenReaderEnabled ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={screenReaderEnabled ? "white" : "#333"} 
            />
          </TouchableOpacity>

          {/* Tamaño de fuente */}
          <View style={styles.fontSizeContainer}>
            <Text style={[
              styles.accessibilityLabel, 
              { 
                fontSize: fontSizes.base,
                color: darkMode ? 'white' : '#333'
              }
            ]}>
              Tamaño de Texto:
            </Text>
            <View style={styles.fontSizeButtons}>
              {(['small', 'normal', 'large'] as const).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeButton, 
                    fontSize === size && styles.selectedFontButton,
                    { backgroundColor: darkMode ? '#3A3A4A' : '#e0e0e0' }
                  ]}
                  onPress={() => {
                    setFontSize(size);
                    speakText(`Tamaño de texto cambiado a ${size === 'small' ? 'pequeño' : size === 'normal' ? 'normal' : 'grande'}`);
                  }}
                  accessibilityLabel={`Tamaño de texto: ${size === 'small' ? 'Pequeño' : size === 'normal' ? 'Normal' : 'Grande'}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: fontSize === size }}
                >
                  <Text style={[
                    styles.fontSizeButtonText, 
                    fontSize === size && styles.selectedFontButtonText,
                    { 
                      fontSize: size === 'small' ? 12 : size === 'large' ? 20 : 16,
                      color: fontSize === size ? 'white' : (darkMode ? 'white' : '#333')
                    }
                  ]}>
                    A
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botón para detener la voz */}
          {screenReaderEnabled && (
            <TouchableOpacity
              style={[styles.accessibilityOption, { backgroundColor: '#ff6b6b' }]}
              onPress={() => Speech.stop()}
              accessibilityLabel="Detener lectura en voz alta"
              accessibilityHint="Detiene la lectura actual del lector de pantalla"
              accessibilityRole="button"
            >
              <Ionicons name="stop" size={24} color="white" />
              <Text style={[styles.accessibilityOptionText, { color: 'white' }]}>
                Detener Voz
              </Text>
              <Ionicons name="stop-circle" size={24} color="white" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.cancelButton,
              { backgroundColor: darkMode ? '#3A3A4A' : '#ccc' }
            ]}
            onPress={() => {
              onClose();
              speakText("Menú de accesibilidad cerrado");
            }}
            accessibilityLabel="Cerrar menú de accesibilidad"
            accessibilityRole="button"
          >
            <Text style={[
              styles.cancelButtonText,
              { color: darkMode ? 'white' : '#666' }
            ]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  accessibilityOption: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
  },
  accessibilityOptionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 15,
  },
  accessibilityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  fontSizeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  fontSizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFontButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#2C5AA0',
  },
  fontSizeButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  selectedFontButtonText: {
    color: 'white',
  },
  cancelButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});