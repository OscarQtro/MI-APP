import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ActivityLayout from "../common/ActivityLayout";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemedStyles } from "../../../hooks/useThemedStyles";

/**
 * ¡DiloTú!
 * - TTS pronuncia la palabra objetivo.
 * - El alumno elige la opción correcta entre 4.
 * - 5 rondas, progreso, guardado con AsyncStorage.
 */

const STORAGE_KEY = "progress:oscar:dilotu";
const ROUNDS_TOTAL = 5;

const WORDS = [
  "CASA","PERRO","GATO","MESA","SILLA",
  "LIBRO","MANO","PIE","SOL","LUNA",
  "AGUA","FUEGO","FLOR","NIÑO","NIÑA",
  "ROJO","AZUL","VERDE","AMARILLO","NEGRO",
] as const;
type Word = typeof WORDS[number];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickUnique(count: number, from: readonly string[], except?: string): string[] {
  const pool = except ? from.filter(w => w !== except) : [...from];
  return shuffle(pool).slice(0, count);
}

export default function DiloTu() {
  const { theme, fontSizes, screenReaderEnabled, speakText, speakAction } = useThemedStyles();
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [current, setCurrent] = useState<Word | null>(null);
  const [options, setOptions] = useState<Word[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [picked, setPicked] = useState<Word | null>(null);
  const announcedRef = useRef(false);

  const progress = useMemo(
    () => (round >= ROUNDS_TOTAL ? 1 : hits / ROUNDS_TOTAL),
    [round, hits]
  );

  // Cargar progreso
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved: { hits: number; round: number } = JSON.parse(raw);
        if (typeof saved.round === "number" && saved.round < ROUNDS_TOTAL) {
          setRound(saved.round);
          setHits(saved.hits ?? 0);
        }
      } catch {}
    })();
  }, []);

  // Preparar ronda
  useEffect(() => {
    if (round >= ROUNDS_TOTAL) return;
    const target = shuffle([...WORDS])[0] as Word;
    const distractors = pickUnique(3, WORDS, target) as Word[];
    const opts = shuffle([target, ...distractors]) as Word[];
    setCurrent(target);
    setOptions(opts);
    setPicked(null);
    setDisabled(false);
    announcedRef.current = false;
    
    if (screenReaderEnabled && round > 0) {
      speakAction(`Ronda ${round + 1}`, `Nueva ronda iniciada. Escucha la palabra y elige la opción correcta.`);
    }
  }, [round, screenReaderEnabled, speakAction]);

  // Pronunciar al iniciar ronda
  useEffect(() => {
    if (!current || announcedRef.current) return;
    announcedRef.current = true;
    speak(current);
  }, [current]);

  function speak(word: string) {
    Speech.speak(word, { language: "es-MX", rate: 0.9, pitch: 1.0 });
  }

  async function persist(nextRound: number, nextHits: number) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ round: nextRound, hits: nextHits }));
    } catch {}
  }

  function onPick(option: Word) {
    if (!current || disabled || round >= ROUNDS_TOTAL) return;
    setPicked(option);
    const correct = option === current;
    setDisabled(true);

    if (screenReaderEnabled) {
      const result = correct ? "¡Correcto!" : "Incorrecto";
      speakAction(result, `Seleccionaste ${option}. La palabra correcta era ${current}.`);
    }

    setTimeout(() => {
      const nextRound = round + 1;
      const nextHits = correct ? hits + 1 : hits;
      setHits(nextHits);
      setRound(nextRound);
      persist(nextRound, nextHits);

      if (nextRound >= ROUNDS_TOTAL) {
        Alert.alert("Sesión terminada", `Aciertos: ${nextHits} / ${ROUNDS_TOTAL} 🎉`);
      }
    }, 600);
  }

  function onRepeat() {
    if (current) {
      speak(current);
      if (screenReaderEnabled) {
        speakAction("Repitiendo palabra", `Escucha la palabra: ${current}`);
      }
    }
  }

  function resetSession() {
    setRound(0);
    setHits(0);
    setPicked(null);
    setDisabled(false);
    persist(0, 0);
    if (screenReaderEnabled) {
      speakAction("Juego reiniciado", "Nueva partida iniciada");
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Fondo degradado global */}
      <LinearGradient
        colors={[theme.colors.gradTop, theme.colors.gradBottom]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ActivityLayout title="¡DiloTú!" subtitle="Escucha y elige la palabra correcta" progress={progress}>
          <View style={styles.content}>
            {round < ROUNDS_TOTAL ? (
              <>
                <View style={styles.headerRow}>
                  <Pressable 
                    onPress={onRepeat} 
                    style={({ pressed }) => [
                      styles.speakBtn, 
                      { backgroundColor: theme.colors.primary },
                      pressed && { opacity: 0.9 }
                    ]}
                    accessible={true}
                    accessibilityLabel="Escuchar palabra de nuevo"
                    accessibilityHint="Toca para repetir el audio de la palabra actual"
                  >
                    <Text style={[styles.speakText, { color: theme.colors.textLight, fontSize: fontSizes.base }]}>🔊 Escuchar de nuevo</Text>
                  </Pressable>
                  <Text style={[styles.roundText, { color: theme.colors.textPrimary, fontSize: fontSizes.base }]}>
                    Ronda {round + 1} / {ROUNDS_TOTAL}
                  </Text>
                </View>

                <View style={styles.optionsGrid}>
                  {options.map((opt) => {
                    const isPicked = picked === opt;
                    const isCorrect = picked && opt === current;
                    const isWrong = picked && opt === picked && opt !== current;

                    // Colores dinámicos basados en el tema
                    let gradientColors: [string, string] = [theme.colors.primary, theme.colors.secondary];
                    if (isCorrect) gradientColors = [theme.colors.success, theme.colors.success];
                    if (isWrong) gradientColors = [theme.colors.danger, theme.colors.danger];

                    return (
                      <Pressable
                        key={opt}
                        onPress={() => onPick(opt)}
                        disabled={disabled}
                        style={({ pressed }) => [
                          styles.option,
                          { backgroundColor: theme.colors.surface },
                          pressed && { transform: [{ scale: 0.97 }] },
                          isPicked && styles.optionPicked,
                          disabled && isCorrect && styles.optionCorrect,
                          disabled && isWrong && styles.optionWrong,
                        ]}
                        accessible={true}
                        accessibilityLabel={`Opción ${opt}`}
                        accessibilityHint={disabled ? 
                          (isCorrect ? "Opción correcta seleccionada" : isWrong ? "Opción incorrecta seleccionada" : "") : 
                          "Toca para seleccionar esta opción"
                        }
                      >
                        <LinearGradient
                          colors={gradientColors}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.optionGrad}
                        >
                          <Text style={[styles.optionText, { fontSize: fontSizes.base }]}>{opt}</Text>
                        </LinearGradient>
                      </Pressable>
                    );
                  })}
                </View>

                <Text 
                  style={[styles.hint, { color: theme.colors.textSecondary, fontSize: fontSizes.caption }]}
                  accessible={true}
                  accessibilityLabel="Instrucciones: toca el botón de escuchar para oír la palabra, luego elige la opción correcta"
                >
                  Toca 🔊 para oír la palabra. Luego elige la opción correcta.
                </Text>
              </>
            ) : (
              <View style={[styles.endBox, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.endTitle, { color: theme.colors.textPrimary, fontSize: fontSizes.title }]}>¡Muy bien!</Text>
                <Text style={[styles.endSub, { color: theme.colors.textSecondary, fontSize: fontSizes.base }]}>
                  Aciertos: {hits} / {ROUNDS_TOTAL}
                </Text>
                <Pressable 
                  onPress={resetSession} 
                  style={({ pressed }) => [
                    styles.resetBtn, 
                    { backgroundColor: theme.colors.success },
                    pressed && { opacity: 0.9 }
                  ]}
                  accessible={true}
                  accessibilityLabel="Reiniciar juego completo"
                >
                  <Text style={[{ color: theme.colors.textLight, fontWeight: "900", fontSize: fontSizes.base }]}>Reiniciar</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ActivityLayout>
      </SafeAreaView>
    </View>
  );
}

const TOP_PADDING = Platform.OS === "android" ? (StatusBar.currentHeight ?? 12) : 12;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  safe: { flex: 1, paddingTop: TOP_PADDING + 8 },
  content: { paddingHorizontal: 12 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  speakBtn: {
    borderRadius: 12,
    overflow: "hidden",
    // botón también con degradado
    backgroundColor: "transparent",
  },
  speakText: {
    fontWeight: "900",
    color: "#3b2f00",
    backgroundColor: "#ffd27f",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  roundText: { fontWeight: "800", color: "#333" },

  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 8,
  },
  option: {
    width: "46%",
    minHeight: 64,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  optionGrad: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  // Estados
  optionPicked: { backgroundColor: "#ffefd6" },
  optionCorrect: { backgroundColor: "#baf7bf" },
  optionWrong: { backgroundColor: "#ffd0d0" },

  optionText: { fontSize: 18, fontWeight: "900", color: "#222" },

  hint: {
    marginTop: 10,
    textAlign: "center",
    color: "#444",
    fontWeight: "600",
  },

  endBox: { alignItems: "center", gap: 6, marginTop: 8 },
  endTitle: { fontSize: 22, fontWeight: "900", color: "#3a0070" },
  endSub: { color: "#444", fontWeight: "700" },
  resetBtn: {
    marginTop: 6,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
});

