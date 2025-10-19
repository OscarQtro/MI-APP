import React, { useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityLayout from "../common/ActivityLayout";

const WORDS = [
  "SOL", "LUNA", "CASA", "PERRO", "GATO", "ROCA", "RANA", "FUEGO",
  "MAPA", "NUBE", "LAGO", "VALE", "RUTA", "MESA", "RISA"
];
const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const ROUNDS_TOTAL = 5;
const POOL_SIZE = 12; // cuántas celdas visibles

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRoundWord(used: string[]) {
  const candidates = WORDS.filter(w => !used.includes(w));
  const word = candidates[Math.floor(Math.random() * candidates.length)] || WORDS[0];
  return word;
}

function buildPoolFor(word: string) {
  // Siempre incluye las letras de la palabra objetivo + distractores
  const needed = word.split("");
  const distractors = shuffle(ALPHABET.filter(l => !needed.includes(l))).slice(
    0,
    Math.max(POOL_SIZE - needed.length, 0)
  );
  return shuffle([...needed, ...distractors]).slice(0, POOL_SIZE);
}

export default function CazaLetras() {
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [objetivo, setObjetivo] = useState(() => buildRoundWord([]));
  const [pool, setPool] = useState(() => buildPoolFor(buildRoundWord([]))); // se corrige abajo en resetRound
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [aciertos, setAciertos] = useState(0);
  const [round, setRound] = useState(1);
  const [estado, setEstado] = useState<"idle" | "ok" | "bad">("idle");

  // corrige pool inicial según objetivo real
  React.useEffect(() => {
    setPool(buildPoolFor(objetivo));
  }, []); // solo al montar

  const progreso = (round - 1) / ROUNDS_TOTAL;

  const resetAll = useCallback(() => {
    const first = buildRoundWord([]);
    setUsedWords([]);
    setObjetivo(first);
    setPool(buildPoolFor(first));
    setSeleccion([]);
    setAciertos(0);
    setRound(1);
    setEstado("idle");
  }, []);

  const resetRound = useCallback(
    (nextWord?: string) => {
      const word = nextWord ?? buildRoundWord(usedWords);
      setObjetivo(word);
      setPool(buildPoolFor(word));
      setSeleccion([]);
      setEstado("idle");
    },
    [usedWords]
  );

  const pick = useCallback(
    (letter: string) => {
      if (estado === "ok") return; // bloquea mientras está ganada la ronda
      const next = [...seleccion, letter];
      const nextStr = next.join("");
      setSeleccion(next);

      if (nextStr === objetivo) {
        setEstado("ok");
        setAciertos((n) => n + 1);
        setUsedWords((arr) => [...arr, objetivo]);
      } else if (!objetivo.startsWith(nextStr)) {
        // fallo: resetea selección y marca estado
        setEstado("bad");
        // micro-retraso visual para que el usuario vea el rojo
        setTimeout(() => {
          setSeleccion([]);
          setEstado("idle");
        }, 350);
      }
    },
    [seleccion, objetivo, estado]
  );

  const borrarSeleccion = useCallback(() => {
    setSeleccion([]);
    setEstado("idle");
  }, []);

  const siguiente = useCallback(() => {
    if (estado !== "ok") return;
    if (round >= ROUNDS_TOTAL) {
      // fin del juego: reinicia palabras pero respeta aciertos para mostrar "completado"
      setRound(ROUNDS_TOTAL); // queda en la última
      return;
    }
    const w = buildRoundWord([...usedWords, objetivo]);
    setRound((r) => r + 1);
    resetRound(w);
  }, [estado, round, usedWords, objetivo, resetRound]);

  const terminado = round > ROUNDS_TOTAL || (round === ROUNDS_TOTAL && estado === "ok");

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#00B4D8", "#FFEB85"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ActivityLayout title="CazaLetras" subtitle="Forma la palabra" progress={progreso}>
          <View style={styles.content}>

            <View style={styles.headerInfo}>
              <Text style={styles.round}>Ronda {round} / {ROUNDS_TOTAL}</Text>
              <Text style={styles.hits}>Aciertos: {aciertos}</Text>
            </View>

            <View style={styles.obj}>
              <Text style={[styles.objText, estado === "ok" && styles.ok, estado === "bad" && styles.bad]}>
                {objetivo}
              </Text>
              <Text style={styles.helper}>
                Toca las letras en orden. Mantén presionado cualquier letra para <Text style={{fontWeight:"900"}}>borrar</Text>.
              </Text>
            </View>

            <View style={styles.grid}>
              {pool.map((L, idx) => (
                <Pressable
                  key={`${L}-${idx}`}
                  onPress={() => pick(L)}
                  onLongPress={borrarSeleccion}
                  style={({ pressed }) => [styles.cell, pressed && { transform: [{ scale: 0.95 }] }]}
                >
                  <LinearGradient
                    colors={estado === "bad" ? ["#ff5a5f", "#ff7b7f"] : ["#ff92c2", "#ffb3da"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cellGradient}
                  >
                    <Text style={styles.cellText}>{L}</Text>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sel}>
              Seleccionado: <Text style={styles.selStrong}>{seleccion.join(" ") || "—"}</Text>
            </Text>

            {/* Barra de acciones */}
            <View style={styles.actions}>
              <Pressable style={({pressed}) => [styles.btn, pressed && styles.btnPressed]} onPress={borrarSeleccion}>
                <Text style={styles.btnText}>Borrar</Text>
              </Pressable>

              {estado === "ok" && (
                <Pressable style={({pressed}) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]} onPress={siguiente}>
                  <Text style={styles.btnPrimaryText}>{terminado ? "Finalizado" : "Siguiente"}</Text>
                </Pressable>
              )}

              <Pressable style={({pressed}) => [styles.btnGhost, pressed && styles.btnGhostPressed]} onPress={resetAll}>
                <Text style={styles.btnGhostText}>Reiniciar</Text>
              </Pressable>
            </View>

            {terminado && (
              <View style={styles.finishCard}>
                <Text style={styles.finishTitle}>¡Completado! 🎉</Text>
                <Text style={styles.finishSubtitle}>Aciertos: {aciertos} de {ROUNDS_TOTAL}</Text>
                <Pressable style={({pressed}) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]} onPress={resetAll}>
                  <Text style={styles.btnPrimaryText}>Jugar de nuevo</Text>
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
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  round: { fontWeight: "800", color: "#3a0070" },
  hits: { fontWeight: "800", color: "#3a0070" },

  obj: { alignItems: "center", marginBottom: 8 },
  objText: { fontSize: 32, fontWeight: "900", color: "#3a0070", letterSpacing: 4 },
  ok: { color: "#0a7d26", textShadowColor: "rgba(10,125,38,0.25)", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  bad: { color: "#b00020" },
  helper: { marginTop: 4, color: "#333", fontSize: 13, textAlign: "center" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  cell: { width: 60, height: 60, borderRadius: 14, overflow: "hidden" },
  cellGradient: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  cellText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  sel: { marginTop: 6, textAlign: "center", fontWeight: "700", fontSize: 16, color: "#333" },
  selStrong: { color: "#3a0070" },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: 4,
  },

  // Botón primario
  btnPrimary: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#3a0070",
    shadowColor: "#3a0070", shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  btnPrimaryPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnPrimaryText: { color: "#fff", fontWeight: "900", letterSpacing: 0.5 },

  // Botón secundario
  btn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#ffd166",
  },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnText: { color: "#3a0070", fontWeight: "900" },

  // Botón ghost
  btnGhost: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    borderWidth: 2, borderColor: "#3a0070",
    backgroundColor: "rgba(58,0,112,0.06)",
  },
  btnGhostPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnGhostText: { color: "#3a0070", fontWeight: "900" },

  finishCard: {
    marginTop: 16,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(58,0,112,0.15)",
    gap: 8,
  },
  finishTitle: { fontSize: 20, fontWeight: "900", color: "#3a0070" },
  finishSubtitle: { fontSize: 16, color: "#4a4a4a" },
});

