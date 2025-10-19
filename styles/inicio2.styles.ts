import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({


  // 🔵 Botón principal
  button: {
    backgroundColor: "#00AEEF",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 999,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 20,
  },

  // 🔤 Texto del botón
  buttonText: { 
    color: "#fff",
    fontWeight: "800",
    fontSize: 28,
    letterSpacing: 0.5,
  },
});
