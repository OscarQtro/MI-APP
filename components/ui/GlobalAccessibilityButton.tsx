import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Dimensions, 
  PanResponder, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  View 
} from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface GlobalAccessibilityButtonProps {
  onPress: () => void;
}

const BUTTON_SIZE = 56;
const STORAGE_KEY = 'accessibility_button_position';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GlobalAccessibilityButton({ onPress }: GlobalAccessibilityButtonProps) {
  const { speakText } = useAccessibility();
  
  // Posición inicial (esquina inferior derecha)
  const [position, setPosition] = useState({
    x: screenWidth - BUTTON_SIZE - 20,
    y: screenHeight - BUTTON_SIZE - 100
  });

  const pan = useRef(new Animated.ValueXY(position)).current;
  const [isDragging, setIsDragging] = useState(false);

  // Cargar posición guardada al inicializar
  useEffect(() => {
    loadSavedPosition();
  }, []);

  const loadSavedPosition = async () => {
    try {
      const savedPosition = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPosition) {
        const parsedPosition = JSON.parse(savedPosition);
        // Validar que la posición esté dentro de los límites actuales de pantalla
        const validX = Math.max(10, Math.min(screenWidth - BUTTON_SIZE - 10, parsedPosition.x));
        const validY = Math.max(50, Math.min(screenHeight - BUTTON_SIZE - 50, parsedPosition.y));
        const validPosition = { x: validX, y: validY };
        
        setPosition(validPosition);
        pan.setValue(validPosition);
      }
    } catch (error) {
      console.warn('Error loading saved position:', error);
    }
  };

  const savePosition = async (newPosition: { x: number; y: number }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPosition));
    } catch (error) {
      console.warn('Error saving position:', error);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Solo activar el drag si se mueve más de 5 píxeles
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        speakText('Arrastrando botón de accesibilidad');
        // Establecer el offset para que el drag sea relativo a la posición actual
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 }); // Resetear valores para un drag limpio
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        setIsDragging(false);
        pan.flattenOffset();

        // Obtener la posición actual del pan
        const currentX = (pan.x as any)._value;
        const currentY = (pan.y as any)._value;

        // Aplicar límites de pantalla a la posición actual
        const newX = Math.max(
          10, 
          Math.min(screenWidth - BUTTON_SIZE - 10, currentX)
        );
        const newY = Math.max(
          50, // Espacio para el header
          Math.min(screenHeight - BUTTON_SIZE - 50, currentY)
        );

        const newPosition = { x: newX, y: newY };
        
        // Solo animar si la posición necesita ajustarse por los límites
        if (newX !== currentX || newY !== currentY) {
          Animated.spring(pan, {
            toValue: newPosition,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start();
        }

        setPosition(newPosition);
        savePosition(newPosition);
        speakText('Botón de accesibilidad reposicionado');
      },
    })
  ).current;

  const handlePress = () => {
    if (!isDragging) {
      speakText('Abrir menú de accesibilidad');
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: pan.getTranslateTransform(),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={[
          styles.button,
          isDragging && styles.buttonDragging
        ]}
        onPress={handlePress}
        accessibilityLabel="Opciones de accesibilidad"
        accessibilityHint="Mantén presionado para mover, toca para abrir menú"
        accessibilityRole="button"
        activeOpacity={0.8}
      >
        <Ionicons 
          name="accessibility" 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 1000,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  buttonDragging: {
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 12,
    transform: [{ scale: 1.1 }],
  },
});