import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ActivityLayout from "../common/ActivityLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

      if (nextRound >= ROUNDS_TOTAL) {
        Alert.alert(
          "¡Ruta completada!",
          `Entregas: ${nextHits}/${ROUNDS_TOTAL}\nPuntuación: ${nextScore} 🎉`
        );
      }
    } else {
      // fallo suave: solo cuenta intento y feedback visual
      setAttemptsThisRound(n => n + 1);
    }
  }

  // Pista (una vez por ronda): resalta fuerte fila y columna correctas
  function useHint() {
    if (round >= ROUNDS_TOTAL || usedHintThisRound || !current) return;
    setUsedHintThisRound(true);
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
  }

  return (
    <View style={styles.screen}>
      {/* Fondo degradado global */}
      <LinearGradient
        colors={["#00B4D8", "#FFEB85"]}
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
                
                <Text style={styles.targetValue}>
                  📍 Objetivo: ({current?.x}, {current?.y})
                </Text>

                <View style={styles.actions}>
                  <Pressable onPress={useHint} disabled={usedHintThisRound} style={({pressed}) => [styles.btn, pressed && styles.btnPressed, usedHintThisRound && styles.btnDisabled]}>
                    <Text style={styles.btnText}>💡 Pista</Text>
                  </Pressable>
                  <Pressable onPress={resetSession} style={({pressed}) => [styles.btnGhost, pressed && styles.btnGhostPressed]}>
                    <Text style={styles.btnGhostText}>↺ Reiniciar</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.endBox}>
                <Text style={styles.endTitle}>Ruta finalizada</Text>
                <Text style={styles.endSub}>Aciertos: {hits} / {ROUNDS_TOTAL}</Text>
                <Text style={styles.endSub}>Puntuación: {score}</Text>
                <Pressable onPress={resetSession} style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.9 }]}>
                  <Text style={{ color: "#fff", fontWeight: "900" }}>Jugar de nuevo</Text>
                </Pressable>
              </View>
            )}

            {/* Plano cartesiano */}
            <View style={styles.boardCard}>
              <LinearGradient
                colors={["#ffffffee", "#ffffffcc"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.boardWrap}
              >
                {/* Ejes (marcas superiores X) */}
                <View style={styles.axisLabelsRow}>
                  <View style={styles.axisCorner} />
                  {Array.from({ length: SIZE }).map((_, x) => (
                    <View key={`xl-${x}`} style={styles.axisCell}>
                      <Text style={styles.axisText}>{x}</Text>
                    </View>
                  ))}
                  {/* Flecha eje X */}
                  <Text style={styles.axisArrowX}>→ X</Text>
                </View>

                <View style={styles.board}>
                  {/* Etiquetas Y + flecha */}
                  <View style={styles.axisCol}>
                    {Array.from({ length: SIZE }).map((_, i) => {
                      const y = SIZE - 1 - i;
                      return (
                        <View key={`yl-${y}`} style={styles.axisCellY}>
                          <Text style={styles.axisText}>{y}</Text>
                        </View>
                      );
                    })}
                    <Text style={styles.axisArrowY}>↑ Y</Text>
                  </View>

                  {/* Grid */}
                  <View style={styles.grid}>
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
                                revealedCell && styles.cellCorrect,
                                picked && !revealedCell && styles.cellPicked,
                                guideSoft && styles.cellGuide,
                                guideStrong && styles.cellGuideStrong,
                                coord.x === 0 && coord.y === 0 && styles.originCell,
                              ]}
                              accessibilityLabel={`Celda ${row},${col}`}
                            >
                              {isTarget && round < ROUNDS_TOTAL ? <View style={styles.dotHint} /> : null}
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
              <Text style={styles.hint}>
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
  badgeInfo: { fontWeight: "800", color: "#3a0070" },
  badgeScore: { fontWeight: "900", color: "#0b4d1d" },

  targetBox: {
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  story: { color: "#444", fontWeight: "600", textAlign: "center" },
  targetValue: { fontSize: 22, fontWeight: "900", color: "#1a1a1a" },
  subhint: { color: "#555", fontWeight: "600" },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  btn: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: "#ffd166",
  },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnText: { color: "#3a0070", fontWeight: "900" },
  btnDisabled: { opacity: 0.5 },

  btnGhost: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    borderWidth: 2, borderColor: "#3a0070", backgroundColor: "rgba(58,0,112,0.06)",
  },
  btnGhostPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnGhostText: { color: "#3a0070", fontWeight: "900" },

  endBox: { alignItems: "center", gap: 8, marginBottom: 10, marginTop: 6 },
  endTitle: { fontSize: 22, fontWeight: "900", color: "#3a0070" },
  endSub: { color: "#444", fontWeight: "700" },
  resetBtn: {
    marginTop: 6,
    backgroundColor: "#4CAF50",
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
  axisText: { fontWeight: "800", color: "#333" },
  axisArrowX: { marginLeft: 6, fontWeight: "800", color: "#333" },

  board: { flexDirection: "row" },
  axisCol: { width: CELL - 16, marginRight: 4, alignItems: "center" },
  axisArrowY: { marginTop: 4, fontWeight: "800", color: "#333" },

  grid: {
    borderWidth: 1,
    borderColor: "#c9c9c9",
    backgroundColor: "#f9f9f9",
  },
  row: { flexDirection: "row" },

  // Celdas
  cell: {
    width: CELL,
    height: CELL,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  cellPicked: { backgroundColor: "#ffe0e0" },
  cellCorrect: { backgroundColor: "#b8f5c1" },
  cellGuide: { backgroundColor: "#eef7ff" },           // guía suave (misma fila o columna)
  cellGuideStrong: { backgroundColor: "#cfe9ff" },     // guía fuerte si usó pista
  originCell: { borderWidth: 2, borderColor: "#3a0070" },

  dotHint: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#9ad0ff" },

  hint: {
    textAlign: "center",
    marginTop: 10,
    color: "#444",
    fontWeight: "600",
  },
});
