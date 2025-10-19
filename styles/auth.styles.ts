// styles/auth.styles.ts
import { StyleSheet } from "react-native";

/** Estética suave: título blanco, labels blancos con opacidad,
 *  inputs “pill” azules y botón primario consistente. */
export const authStyles = StyleSheet.create({
  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    paddingHorizontal: 24,
    gap: 14,
  },

  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  group: { gap: 6 },

  label: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: "800",
    letterSpacing: 0.6,
    fontSize: 12,
  },

  // Pastilla azul (texto blanco)
  inputPill: {
    backgroundColor: "#00AEEF",
    color: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  passwordRow: { flexDirection: "row", alignItems: "center", gap: 8 },

  showBtn: {
    backgroundColor: "rgba(0,0,0,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  showText: { color: "#fff", fontWeight: "700" },

  primaryBtn: {
    backgroundColor: "#00AEEF",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  linkBtn: { alignItems: "center", paddingVertical: 6 },
  linkText: {
    color: "rgba(255,255,255,0.95)",
    textDecorationLine: "underline",
    fontWeight: "700",
  },

  disabled: { opacity: 0.6 },

  /* ====== NUEVO: estilos para el selector de rol (chips) ====== */
  chipsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 2,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  chipActive: {
    backgroundColor: "#00AEEF",
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chipText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  chipTextActive: { color: "#fff" },
});

