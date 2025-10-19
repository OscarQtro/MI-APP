import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ActivityLayout from "../common/ActivityLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemedStyles } from "../../../hooks/useThemedStyles";

/**
 * PuntoGo: Identificación de coordenadas en un plano cartesiano con propósito.
 * Historia: "Eres un repartidor. Entrega el paquete en la coordenada (x,y) partiendo del origen (0,0)."
 * - 10x10, 5 rondas
 * - Puntos por acierto; penalización por intentos y pista.
 * - Botón Reiniciar siempre visible; pista opcional.
 */

type Cell = { x: number; y: number };

const SIZE = 10;                 // 10x10 -> coords 0..9
const ROUNDS_TOTAL = 5;
const STORAGE_KEY = "progress:oscar:puntogo:v2";

// Aleatorio entero en [min, max]
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Objetivos únicos (x,y) sin repetir
function buildTargets(count: number): Cell[] {
  const set = new Set<string>();
  const out: Cell[] = [];
  while (out.length < count) {
    const x = rand(0, SIZE - 1);
    const y = rand(0, SIZE - 1);
    const key = `${x},${y}`;
    if (!set.has(key)) {
      set.add(key);
      out.push({ x, y });
    }
  }
  return out;
}

export default function PuntoGo() {
  const { theme, fontSizes, screenReaderEnabled, speakText, speakAction, speakNavigation } = useThemedStyles();
  
  const [targets, setTargets] = useState<Cell[]>(() => buildTargets(ROUNDS_TOTAL));
  const [round, setRound] = useState(0);          // 0..ROUNDS_TOTAL-1
  const [hits, setHits] = useState(0);
  const [score, setScore] = useState(0);
  const [lastPick, setLastPick] = useState<Cell | null>(null); // último click
  const [revealed, setRevealed] = useState<string>("");        // "x,y;"
  const [attemptsThisRound, setAttemptsThisRound] = useState(0);
  const [usedHintThisRound, setUsedHintThisRound] = useState(false);

  const current = targets[round];
  const progress = useMemo(
    () => (round >= ROUNDS_TOTAL ? 1 : hits / ROUNDS_TOTAL),
    [round, hits]
  );

  // Cargar progreso previo
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved: {
          hits: number; round: number; revealed: string; targets?: Cell[];
          score?: number;
        } = JSON.parse(raw);
        if (typeof saved.round === "number" && saved.round < ROUNDS_TOTAL) {
          setRound(saved.round);
          setHits(saved.hits ?? 0);
          setRevealed(saved.revealed ?? "");
          setScore(saved.score ?? 0);
          if (Array.isArray(saved.targets) && saved.targets.length === ROUNDS_TOTAL) {
            setTargets(saved.targets);
          }
        }
      } catch {}
    })();
  }, []);

  // Announce game instructions when screen reader is enabled
  useEffect(() => {
    if (screenReaderEnabled && current) {
      setTimeout(() => {
        speakText(`Juego PuntoGo. Eres un repartidor. Debes entregar ${ROUNDS_TOTAL} paquetes en diferentes coordenadas. Ronda ${round + 1}: entrega el paquete en la coordenada ${current.x}, ${current.y}. Toca una celda en la cuadrícula para hacer la entrega.`);
      }, 1000);
    }
  }, [screenReaderEnabled, current, round]);

  // Guardar progreso
  async function persist(nextRound: number, nextHits: number, nextRevealed: string, nextScore: number) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          hits: nextHits,
          round: nextRound,
          revealed: nextRevealed,
          targets,
          score: nextScore,
        })
      );
    } catch {}
  }

  // Mapea (fila, col) de la UI a (x,y) con origen abajo-izquierda
  function toCoord(row: number, col: number): Cell {
    return { x: col, y: SIZE - 1 - row };
  }

  function keyOf(c: Cell) {
    return `${c.x},${c.y}`;
  }

  function isRevealed(c: Cell) {
    return revealed.split(";").includes(keyOf(c));
  }

  function onPick(row: number, col: number) {
    if (round >= ROUNDS_TOTAL) return; // terminado
    const pick = toCoord(row, col);
    setLastPick(pick);

    const correct = current && pick.x === current.x && pick.y === current.y;

    if (correct) {
      const nextHits = hits + 1;
      const nextRound = round + 1;

      // puntuación: base 100 - 10*intentos fallidos - 30 si usó pista (máx no negativa)
      const penaltyAttempts = Math.max(0, attemptsThisRound) * 10;
      const penaltyHint = usedHintThisRound ? 30 : 0;
      const gained = Math.max(20, 100 - penaltyAttempts - penaltyHint);
      const nextScore = score + gained;

      // marca celda correcta como revelada
      const setKeys = new Set(revealed ? revealed.split(";") : []);
      setKeys.add(keyOf(current));
      const nextRevealed = Array.from(setKeys).join(";");

      setHits(nextHits);
      setRound(nextRound);
      setRevealed(nextRevealed);
      setScore(nextScore);
      setAttemptsThisRound(0);
      setUsedHintThisRound(false);
      persist(nextRound, nextHits, nextRevealed, nextScore);

      // Screen reader feedback for correct answer
      if (screenReaderEnabled) {
        speakAction(`¡Correcto! Paquete entregado en coordenada ${pick.x}, ${pick.y}. Ganaste ${gained} puntos. ${nextRound < ROUNDS_TOTAL ? `Siguiente entrega: ronda ${nextRound + 1}` : '¡Ruta completada!'}`);
      }

      if (nextRound >= ROUNDS_TOTAL) {
        if (screenReaderEnabled) {
          speakAction(`¡Felicidades! Has completado todas las entregas. Puntuación final: ${nextScore} puntos.`);
        }
        Alert.alert(
          "¡Ruta completada!",
          `Entregas: ${nextHits}/${ROUNDS_TOTAL}\nPuntuación: ${nextScore} 🎉`
        );
      }
    } else {
      // fallo suave: solo cuenta intento y feedback visual
      setAttemptsThisRound(n => n + 1);
      
      // Screen reader feedback for incorrect answer
      if (screenReaderEnabled) {
        speakText(`Incorrecto. Seleccionaste coordenada ${pick.x}, ${pick.y}. El objetivo está en otra posición. Intentos en esta ronda: ${attemptsThisRound + 1}.`);
      }
    }
  }

  // Pista (una vez por ronda): resalta fuerte fila y columna correctas
  function useHint() {
    if (round >= ROUNDS_TOTAL || usedHintThisRound || !current) return;
    setUsedHintThisRound(true);
    
    // Screen reader feedback for hint
    if (screenReaderEnabled) {
      speakAction(`Pista activada: el paquete debe entregarse en la columna ${current.x} y fila ${current.y}. Se aplicará una penalización de 30 puntos.`);
    }
  }

  // Reiniciar sesión (nueva ruta)
  function resetSession() {
    const fresh = buildTargets(ROUNDS_TOTAL);
    setTargets(fresh);
    setRound(0);
    setHits(0);
    setScore(0);
    setLastPick(null);
    setRevealed("");
    setAttemptsThisRound(0);
    setUsedHintThisRound(false);
    persist(0, 0, "", 0);
    
    // Screen reader feedback for reset
    if (screenReaderEnabled) {
      speakAction("Juego reiniciado. Nueva ruta de entrega generada. Primera entrega en coordenada " + fresh[0].x + ", " + fresh[0].y + ".");
    }
  }

  return (
    <View style={styles.screen}>
      {/* Fondo degradado global */}
      <LinearGradient
        colors={[theme.colors.gradTop, theme.colors.gradBottom]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ActivityLayout
          title="PuntoGo"
          subtitle="Entrega el paquete en la coordenada."
          progress={progress}
        >
          <View style={styles.content}>

            {/* Barra superior de estado */}
            <View style={styles.topBar}>
              <Text style={styles.badgeInfo}>Ronda {Math.min(round + 1, ROUNDS_TOTAL)}/{ROUNDS_TOTAL}</Text>
              <Text style={styles.badgeInfo}>Aciertos: {hits}</Text>
              <Text style={styles.badgeScore}>Puntos: {score}</Text>
            </View>

            {/* Cabecera con objetivo/mini-historia */}
            {round < ROUNDS_TOTAL ? (
              <View style={styles.targetBox}>
                
                <Text style={[styles.targetValue, { 
                  color: theme.colors.textPrimary, 
                  fontSize: fontSizes.subtitle 
                }]}>
                  📍 Objetivo: ({current?.x}, {current?.y})
                </Text>

                <View style={styles.actions}>
                  <Pressable 
                    onPress={useHint} 
                    disabled={usedHintThisRound} 
                    style={({pressed}) => [
                      styles.btn, 
                      { backgroundColor: usedHintThisRound ? theme.colors.textMuted : theme.colors.secondary },
                      pressed && !usedHintThisRound && styles.btnPressed
                    ]}
                    accessible={true}
                    accessibilityLabel="Pista para encontrar el objetivo"
                    accessibilityHint={usedHintThisRound ? "Ya usaste la pista en esta ronda" : "Muestra la fila y columna correctas, con penalización de puntos"}
                  >
                    <Text style={[styles.btnText, { 
                      fontSize: fontSizes.base, 
                      color: usedHintThisRound ? theme.colors.textSecondary : theme.colors.textLight 
                    }]}>💡 Pista</Text>
                  </Pressable>
                  <Pressable 
                    onPress={resetSession} 
                    style={({pressed}) => [
                      styles.btnGhost, 
                      { borderColor: theme.colors.textSecondary },
                      pressed && styles.btnGhostPressed
                    ]}
                    accessible={true}
                    accessibilityLabel="Reiniciar juego"
                    accessibilityHint="Comenzar una nueva ruta con objetivos diferentes"
                  >
                    <Text style={[styles.btnGhostText, { 
                      fontSize: fontSizes.base, 
                      color: theme.colors.textSecondary
                    }]}>↺ Reiniciar</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.endBox}>
                <Text style={[styles.endTitle, { 
                  color: theme.colors.textPrimary, 
                  fontSize: fontSizes.title 
                }]}>Ruta finalizada</Text>
                <Text style={[styles.endSub, { 
                  color: theme.colors.textSecondary, 
                  fontSize: fontSizes.base 
                }]}>Aciertos: {hits} / {ROUNDS_TOTAL}</Text>
                <Text style={[styles.endSub, { 
                  color: theme.colors.textSecondary, 
                  fontSize: fontSizes.base 
                }]}>Puntuación: {score}</Text>
                <Pressable 
                  onPress={resetSession} 
                  style={({ pressed }) => [
                    styles.resetBtn, 
                    { backgroundColor: theme.colors.primary },
                    pressed && { opacity: 0.9 }
                  ]}
                  accessible={true}
                  accessibilityLabel="Jugar de nuevo"
                  accessibilityHint="Comenzar una nueva ruta de entrega"
                >
                  <Text style={{ 
                    color: theme.colors.textLight, 
                    fontWeight: "900", 
                    fontSize: fontSizes.base 
                  }}>Jugar de nuevo</Text>
                </Pressable>
              </View>
            )}

            {/* Plano cartesiano */}
            <View style={styles.boardCard}>
              <LinearGradient
                colors={[theme.colors.surface + 'ee', theme.colors.surface + 'cc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.boardWrap}
              >
                {/* Ejes (marcas superiores X) */}
                <View style={styles.axisLabelsRow}>
                  <View style={styles.axisCorner} />
                  {Array.from({ length: SIZE }).map((_, x) => (
                    <View key={`xl-${x}`} style={styles.axisCell}>
                      <Text style={[styles.axisText, { color: theme.colors.textSecondary }]}>{x}</Text>
                    </View>
                  ))}
                  {/* Flecha eje X */}
                  <Text style={[styles.axisArrowX, { color: theme.colors.textSecondary }]}>→ X</Text>
                </View>

                <View style={styles.board}>
                  {/* Etiquetas Y + flecha */}
                  <View style={styles.axisCol}>
                    {Array.from({ length: SIZE }).map((_, i) => {
                      const y = SIZE - 1 - i;
                      return (
                        <View key={`yl-${y}`} style={styles.axisCellY}>
                          <Text style={[styles.axisText, { color: theme.colors.textSecondary }]}>{y}</Text>
                        </View>
                      );
                    })}
                    <Text style={[styles.axisArrowY, { color: theme.colors.textSecondary }]}>↑ Y</Text>
                  </View>

                  {/* Grid */}
                  <View style={[styles.grid, { 
                    borderColor: theme.colors.textMuted, 
                    backgroundColor: theme.colors.surface 
                  }]}>
                    {Array.from({ length: SIZE }).map((_, row) => (
                      <View key={`row-${row}`} style={styles.row}>
                        {Array.from({ length: SIZE }).map((__, col) => {
                          const coord = toCoord(row, col);
                          const isTarget =
                            round <= ROUNDS_TOTAL &&
                            current &&
                            coord.x === current.x &&
                            coord.y === current.y;

                          const revealedCell = isRevealed(coord);
                          const picked =
                            lastPick &&
                            lastPick.x === coord.x &&
                            lastPick.y === coord.y &&
                            round < ROUNDS_TOTAL;

                          const guideSoft = current && (coord.x === current.x || coord.y === current.y);
                          const guideStrong = usedHintThisRound && current && (coord.x === current.x || coord.y === current.y);

                          return (
                            <Pressable
                              key={`c-${row}-${col}`}
                              onPress={() => onPick(row, col)}
                              style={[
                                styles.cell,
                                { 
                                  backgroundColor: theme.colors.surface, 
                                  borderColor: theme.colors.textMuted 
                                },
                                revealedCell && { backgroundColor: theme.colors.success },
                                picked && !revealedCell && { backgroundColor: theme.colors.warning },
                                guideSoft && { backgroundColor: theme.colors.info + '40' },
                                guideStrong && { backgroundColor: theme.colors.info },
                                coord.x === 0 && coord.y === 0 && { backgroundColor: theme.colors.primary + '60' },
                              ]}
                              accessible={true}
                              accessibilityLabel={`Coordenada ${coord.x}, ${coord.y}${coord.x === 0 && coord.y === 0 ? ', origen' : ''}${revealedCell ? ', paquete entregado aquí' : ''}${isTarget && round < ROUNDS_TOTAL ? ', objetivo actual' : ''}`}
                              accessibilityHint={round < ROUNDS_TOTAL ? "Toca para entregar el paquete en esta coordenada" : "Juego terminado"}
                            >
                              {isTarget && round < ROUNDS_TOTAL ? 
                                <View style={[styles.dotHint, { backgroundColor: theme.colors.info }]} /> 
                                : null}
                            </Pressable>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Nota de ayuda */}
            {round < ROUNDS_TOTAL ? (
              <Text style={[styles.hint, { 
                color: theme.colors.textSecondary, 
                fontSize: fontSizes.caption 
              }]}>
                Consejo: empieza en (0,0), avanza en X hacia la derecha y sube en Y. Usa 💡 si te pierdes (resta puntos).
              </Text>
            ) : null}
          </View>
        </ActivityLayout>
      </SafeAreaView>
    </View>
  );
}

const CELL = 26;
const TOP_PADDING = Platform.OS === "android" ? (StatusBar.currentHeight ?? 12) : 12;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  safe: { flex: 1, paddingTop: TOP_PADDING + 8 },
  content: { paddingHorizontal: 12 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  badgeInfo: { fontWeight: "800" },
  badgeScore: { fontWeight: "900" },

  targetBox: {
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  story: { fontWeight: "600", textAlign: "center" },
  targetValue: { fontWeight: "900" },
  subhint: { fontWeight: "600" },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  btn: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
  },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnText: { fontWeight: "900" },
  btnDisabled: { opacity: 0.5 },

  btnGhost: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    borderWidth: 2, backgroundColor: "rgba(58,0,112,0.06)",
  },
  btnGhostPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnGhostText: { fontWeight: "900" },

  endBox: { alignItems: "center", gap: 8, marginBottom: 10, marginTop: 6 },
  endTitle: { fontWeight: "900" },
  endSub: { fontWeight: "700" },
  resetBtn: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  // Tarjeta del tablero
  boardCard: {
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  boardWrap: { padding: 8, borderRadius: 16 },

  axisLabelsRow: {
    flexDirection: "row",
    marginLeft: CELL, // espacio para la columna Y
    marginBottom: 4,
    alignItems: "center",
    gap: 4,
  },
  axisCorner: { width: 18 },
  axisCell: { width: CELL, alignItems: "center", justifyContent: "center" },
  axisCellY: { height: CELL, alignItems: "center", justifyContent: "center" },
  axisText: { fontWeight: "800" },
  axisArrowX: { marginLeft: 6, fontWeight: "800" },

  board: { flexDirection: "row" },
  axisCol: { width: CELL - 16, marginRight: 4, alignItems: "center" },
  axisArrowY: { marginTop: 4, fontWeight: "800" },

  grid: {
    borderWidth: 1,
  },
  row: { flexDirection: "row" },

  // Celdas
  cell: {
    width: CELL,
    height: CELL,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  dotHint: { width: 6, height: 6, borderRadius: 3 },

  hint: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
});
