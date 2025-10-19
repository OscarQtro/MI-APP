import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomButtons: {
  position: 'absolute',
  bottom: '30%', // distancia desde el fondo (ajústalo según lo que veas en pantalla)
  width: '100%',
  alignItems: 'center',
  gap: 16, // si tu versión lo soporta

},
  button: {
    backgroundColor: '#00AEEF',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 999,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  button2: {
    backgroundColor: '#00AEEF',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 999,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 16, // si no usas gap
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 28,
    letterSpacing: 0.5,
  },
});