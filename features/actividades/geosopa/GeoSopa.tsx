import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ActivityLayout from "../common/ActivityLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ==== Tipos ====
type Pos = { r: number; c: number };
type Word = {
  id: string;         // en mayúsculas y sin acentos para la grilla
  text: string;       // versión mostrada (con acentos si aplica)
  positions: Pos[];   // celdas ocupadas
  found: boolean;
};

// ==== Parámetros de tablero ====
const ROWS = 10;
const COLS = 10;
const STORAGE_KEY = "progress:oscar:geosopa:v2";

// Cuántas palabras intentamos colocar por tablero
const WORDS_TO_PLACE = 6;

// ==== Banco de palabras ====
// id: sin acentos (para la parrilla), text: con acentos (para UI)
const WORD_BANK: Array<{ id: string; text: string }> = [
  { id: "CIRCULO", text: "CÍRCULO" },
  { id: "CUADRADO", text: "CUADRADO" },
  { id: "TRIANGULO", text: "TRIÁNGULO" },
  { id: "RECTANGULO", text: "RECTÁNGULO" },
  { id: "PENTAGONO", text: "PENTÁGONO" },
  { id: "HEXAGONO", text: "HEXÁGONO" },
  { id: "HEPTAGONO", text: "HEPTÁGONO" },
  { id: "OCTAGONO", text: "OCTÁGONO" },
  { id: "ESFERA", text: "ESFERA" },
  { id: "CUBO", text: "CUBO" },
  { id: "CILINDRO", text: "CILINDRO" },
  { id: "CONO", text: "CONO" },
  { id: "PRISMA", text: "PRISMA" },
  { id: "PIRAMIDE", text: "PIRÁMIDE" },
  { id: "ANGULO", text: "ÁNGULO" },
  { id: "RADIO", text: "RADIO" },
  { id: "DIAMETRO", text: "DIÁMETRO" },
  { id: "PERIMETRO", text: "PERÍMETRO" },
  { id: "AREA", text: "ÁREA" },
  { id: "VERTICE", text: "VÉRTICE" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickUnique<T>(n: number, from: T[]): T[] {
  return shuffle(from).slice(0, n);
}

// ==== Helpers de grid ====
function emptyGrid(rows = ROWS, cols = COLS): string[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""));
}

function randomLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

function canPlaceHorizontal(grid: string[][], word: string, row: number, startCol: number) {
  if (startCol + word.length > COLS) return false;
  for (let i = 0; i < word.length; i++) {
    const cell = grid[row][startCol + i];
    if (cell && cell !== word[i]) return false; // solape solo si coincide la letra
  }
  return true;
}

function canPlaceVertical(grid: string[][], word: string, startRow: number, col: number) {
  if (startRow + word.length > ROWS) return false;
  for (let i = 0; i < word.length; i++) {
    const cell = grid[startRow + i][col];
    if (cell && cell !== word[i]) return false;
  }
  return true;
}

function placeHorizontal(grid: string[][], word: string, row: number, startCol: number): Pos[] {
  const pos: Pos[] = [];
  for (let i = 0; i < word.length; i++) {
    grid[row][startCol + i] = word[i];
    pos.push({ r: row, c: startCol + i });
  }
  return pos;
}

function placeVertical(grid: string[][], word: string, startRow: number, col: number): Pos[] {
  const pos: Pos[] = [];
  for (let i = 0; i < word.length; i++) {
    grid[startRow + i][col] = word[i];
    pos.push({ r: startRow + i, c: col });
  }
  return pos;
}

function pathBetween(start: Pos, end: Pos): Pos[] | null {
  if (start.r === end.r) {
    const row = start.r;
    const [minC, maxC] = start.c <= end.c ? [start.c, end.c] : [end.c, start.c];
    const path: Pos[] = [];
    for (let c = minC; c <= maxC; c++) path.push({ r: row, c });
    return path;
  }
  if (start.c === end.c) {
    const col = start.c;
    const [minR, maxR] = start.r <= end.r ? [start.r, end.r] : [end.r, start.r];
    const path: Pos[] = [];
    for (let r = minR; r <= maxR; r++) path.push({ r, c: col });
    return path;
  }
  return null;
}

function samePath(a: Pos[], b: Pos[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].r !== b[i].r || a[i].c !== b[i].c) return false;
  }
  return true;
}

// ==== Constructor aleatorio del tablero ====
function buildRandomBoard(): { g: string[][]; W: Word[] } {
  const g = emptyGrid();

  // Selecciona palabras que quepan (<= mayor dimensión del tablero)
  const candidates = WORD_BANK.filter(w => w.id.length <= Math.max(ROWS, COLS));
  const chosen = pickUnique(WORDS_TO_PLACE, candidates);

  const placed: Word[] = [];

  for (const w of chosen) {
    const word = w.id; // sin acentos
    let placedOk = false;

    // Intentos para colocarla (variamos fila/col y orientación)
    for (let attempt = 0; attempt < 250; attempt++) {
      const horizontal = Math.random() < 0.5;
      if (horizontal) {
        const row = Math.floor(Math.random() * ROWS);
        const startCol = Math.floor(Math.random() * (COLS - word.length + 1));
        if (canPlaceHorizontal(g, word, row, startCol)) {
          const pos = placeHorizontal(g, word, row, startCol);
          placed.push({ id: w.id, text: w.text, positions: pos, found: false });
          placedOk = true;
          break;
        }
      } else {
        const col = Math.floor(Math.random() * COLS);
        const startRow = Math.floor(Math.random() * (ROWS - word.length + 1));
        if (canPlaceVertical(g, word, startRow, col)) {
          const pos = placeVertical(g, word, startRow, col);
          placed.push({ id: w.id, text: w.text, positions: pos, found: false });
          placedOk = true;
          break;
        }
      }
    }

    // Si no cupo tras muchos intentos, la saltamos silenciosamente
    if (!placedOk) continue;
  }

  // Relleno con letras aleatorias
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!g[r][c]) g[r][c] = randomLetter();
    }
  }

  return { g, W: placed };
}

// ==== Componente principal ====
export default function GeoSopa() {
  const [grid, setGrid] = useState<string[][]>(() => emptyGrid());
  const [words, setWords] = useState<Word[]>([]);
  const [startSel, setStartSel] = useState<Pos | null>(null);
  const [hoverSel, setHoverSel] = useState<Pos | null>(null);
  const [foundCells, setFoundCells] = useState<string>(() => "");

  // Construye inicialmente + carga progreso si aplica (solo si las palabras coinciden)
  useEffect(() => {
    const { g, W } = buildRandomBoard();
    setGrid(g);
    setWords(W);

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved: { foundIds: string[] } = JSON.parse(raw);
        if (!saved?.foundIds?.length) return;

        // Marca encontradas solo si están presentes en esta sopa
        const foundSet = new Set(saved.foundIds);
        const nextWords = W.map(w => ({ ...w, found: foundSet.has(w.id) }));
        setWords(nextWords);

        const keySet = new Set<string>();
        nextWords.forEach(w => {
          if (w.found) w.positions.forEach(p => keySet.add(`${p.r},${p.c}`));
        });
        setFoundCells(Array.from(keySet).join(";"));
      } catch {}
    })();
  }, []);

  // Progreso
  const total = words.length;
  const foundCount = words.filter(w => w.found).length;
  const progress = total === 0 ? 0 : foundCount / total;

  // Path previo mientras arrastra/hover
  const previewPath: Pos[] = useMemo(() => {
    if (!startSel || !hoverSel) return [];
    const p = pathBetween(startSel, hoverSel);
    return p ?? [];
  }, [startSel, hoverSel]);

  function keyOf(p: Pos) {
    return `${p.r},${p.c}`;
  }

  async function persistProgress(nextWords: Word[]) {
    try {
      const foundIds = nextWords.filter(w => w.found).map(w => w.id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ foundIds }));
    } catch {}
  }

  function tryValidate(end: Pos) {
    if (!startSel) return;
    const path = pathBetween(startSel, end);
    setHoverSel(null);

    if (!path || path.length < 2) {
      setStartSel(null);
      return;
    }

    const reversed = [...path].reverse();
    const idx = words.findIndex(
      (w) => !w.found && (samePath(path, w.positions) || samePath(reversed, w.positions))
    );

    if (idx >= 0) {
      const next = [...words];
      next[idx] = { ...next[idx], found: true };
      setWords(next);

      const setKeys = new Set(foundCells ? foundCells.split(";") : []);
      next[idx].positions.forEach((p) => setKeys.add(keyOf(p)));
      setFoundCells(Array.from(setKeys).join(";"));

      persistProgress(next);

      if (next.every((w) => w.found)) {
        Alert.alert("¡Excelente!", "Has encontrado todas las palabras 🎉");
      }
    }
    setStartSel(null);
  }

  const resetAll = useCallback(async () => {
    // Limpia progreso + arma un tablero completamente nuevo
    try { await AsyncStorage.removeItem(STORAGE_KEY); } catch {}
    const { g, W } = buildRandomBoard();
    setGrid(g);
    setWords(W);
    setStartSel(null);
    setHoverSel(null);
    setFoundCells("");
  }, []);

  function renderCell(r: number, c: number) {
    const char = grid[r]?.[c] ?? "";
    const selected =
      (startSel && startSel.r === r && startSel.c === c) ||
      previewPath.some((p) => p.r === r && p.c === c);
    const permanent = foundCells.split(";").includes(`${r},${c}`);

    return (
      <Pressable
        key={`${r}-${c}`}
        onPress={() => {
          if (!startSel) setStartSel({ r, c });
          else tryValidate({ r, c });
        }}
        onHoverIn={() => {
          if (startSel) setHoverSel({ r, c });
        }}
        style={[
          styles.cell,
          permanent && styles.cellFound,
          selected && !permanent && styles.cellPreview,
        ]}
        accessibilityLabel={`Celda ${r},${c}`}
      >
        <Text style={[styles.cellText, permanent && styles.cellTextFound]}>
          {char}
        </Text>
      </Pressable>
    );
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
          title="GeoSopa"
          subtitle="Encuentra las palabras geométricas"
          progress={progress}
        >
          <View style={styles.content}>
            {/* Lista de palabras */}
            <View style={styles.wordsRow}>
              {words.map((w) => (
                <View key={w.id} style={[styles.badge, w.found && styles.badgeFound]}>
                  <LinearGradient
                    colors={w.found ? ["#b5f5bd", "#8fe79b"] : ["#ffe7a8", "#ffd68a"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.badgeGrad}
                  >
                    <Text style={[styles.badgeText, w.found && styles.badgeTextFound]}>
                      {w.text}
                    </Text>
                  </LinearGradient>
                </View>
              ))}
            </View>

            {/* Grid */}
            <View style={styles.gridCard}>
              <LinearGradient
                colors={["#ffffffee", "#ffffffcc"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.grid}
              >
                {Array.from({ length: ROWS }).map((_, r) => (
                  <View key={`row-${r}`} style={styles.row}>
                    {Array.from({ length: COLS }).map((__, c) => renderCell(r, c))}
                  </View>
                ))}
              </LinearGradient>
            </View>

            {/* Acciones */}
            <View style={styles.actions}>
              <Pressable onPress={resetAll} style={({pressed}) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]}>
                <Text style={styles.btnPrimaryText}>↺ Reiniciar</Text>
              </Pressable>
            </View>

            {/* Instrucciones */}
            <Text style={styles.hint}>
              Toca una letra para iniciar y otra en la misma fila o columna para terminar.
            </Text>
          </View>
        </ActivityLayout>
      </SafeAreaView>
    </View>
  );
}

// ==== Estilos ====
const TOP_PADDING = Platform.OS === "android" ? (StatusBar.currentHeight ?? 12) : 12;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  safe: { flex: 1, paddingTop: TOP_PADDING + 8 },
  content: { paddingHorizontal: 12 },

  // Badges (lista de palabras)
  wordsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 12,
  },
  badge: { borderRadius: 999, overflow: "hidden" },
  badgeGrad: { paddingHorizontal: 12, paddingVertical: 6, justifyContent: "center", alignItems: "center" },
  badgeFound: {},
  badgeText: { fontWeight: "900", color: "#5b4800" },
  badgeTextFound: { color: "#0b4d1d" },

  // Tarjeta del grid
  gridCard: {
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  grid: {
    padding: 8,
    borderRadius: 16,
  },
  row: { flexDirection: "row" },

  // Celdas
  cell: {
    width: 32,
    height: 32,
    margin: 2,
    borderRadius: 8,
    backgroundColor: "#f0f2f5",
    alignItems: "center",
    justifyContent: "center",
  },
  cellPreview: { backgroundColor: "#bfe3ff" },
  cellFound: { backgroundColor: "#b5f5bd" },
  cellText: { fontWeight: "900", color: "#222" },
  cellTextFound: { color: "#0b4d1d" },

  // Acciones
  actions: { flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 12, marginBottom: 6 },
  btnPrimary: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#3a0070",
    shadowColor: "#3a0070", shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  btnPrimaryPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnPrimaryText: { color: "#fff", fontWeight: "900", letterSpacing: 0.5 },

  hint: { textAlign: "center", marginTop: 10, color: "#444", fontWeight: "600" },
});
