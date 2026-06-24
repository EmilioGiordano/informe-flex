# Teoría profunda — Mapa general y biblioteca de imágenes

> Esta carpeta es una **biblioteca de teoría** sobre el área en la que vive el análisis
> léxico: la **teoría de autómatas y lenguajes formales**. El análisis léxico (y Flex) es
> apenas la punta visible y aplicada de un cuerpo teórico que conecta con la **lógica
> matemática**, el **álgebra** y los **límites de la computación**.
>
> No hace falta leerlo en orden, pero está pensado de lo concreto a lo abstracto.

---

## ¿Qué tan profundo es esto realmente?

Mucho. El análisis léxico reconoce **lenguajes regulares**, la clase más simple de la
jerarquía de Chomsky. Pero esa "clase simple" es uno de los objetos más estudiados y elegantes
de toda la informática teórica, porque admite **caracterizaciones equivalentes desde cuatro
mundos distintos**:

```
                        LENGUAJES REGULARES
                     (lo que reconoce un lexer)
                               │
        ┌──────────────┬───────┴───────┬──────────────────┐
        ▼              ▼               ▼                  ▼
   MÁQUINAS        EXPRESIONES       LÓGICA            ÁLGEBRA
   (autómatas      (expresiones      (lógica MSO       (monoides
    finitos)        regulares)        de 2º orden)      sintácticos)
        │              │               │                  │
   Kleene /        Kleene          Büchi-Elgot-      Schützenberger,
   Rabin-Scott                     Trakhtenbrot      Eilenberg
```

Que **lo mismo** se pueda definir como "una máquina con memoria finita", "un patrón de texto",
"una fórmula lógica" y "una estructura algebraica" es una de las coincidencias más profundas y
hermosas de la matemática del siglo XX. Y todo eso está latente cada vez que Flex compila tu
expresión regular.

---

## Índice de la biblioteca

| Doc | Tema | Profundidad |
|---|---|---|
| **00** (este) | Mapa general + imágenes | — |
| **01** | La jerarquía de Chomsky: dónde vive lo regular | ★ base |
| **02** | Lenguajes regulares: las tres caras (RE ≡ AFN ≡ AFD) y sus construcciones | ★★ núcleo |
| **03** | Minimización y el teorema de Myhill–Nerode (+ derivadas de Brzozowski) | ★★★ |
| **04** | Los límites: lema de bombeo, propiedades de clausura, decidibilidad | ★★★ |
| **05** | Las fronteras: lógica (Büchi) y álgebra (Schützenberger), problemas abiertos | ★★★★ frontera |
| **06** | De la teoría al scanner: cómo todo esto se vuelve un analizador léxico | ★★ aplicado |

---

## Línea de tiempo de las ideas (para ubicarse)

```
1936 ── Turing: máquinas de Turing, qué es computable
1943 ── McCulloch & Pitts: neuronas → primeros autómatas finitos
1951 ── Kleene: expresiones regulares ≡ autómatas finitos (Teorema de Kleene)
1956 ── Chomsky: la jerarquía de gramáticas (tipos 0–3)
1959 ── Rabin & Scott: AFN ≡ AFD (construcción de subconjuntos) — Premio Turing
1958-59 ── Myhill / Nerode: caracterización de lo regular, AFD mínimo canónico
1960 ── Büchi, Elgot, Trakhtenbrot: regular ≡ lógica monádica de 2º orden
1964 ── Brzozowski: derivadas de expresiones regulares
1965 ── Schützenberger: lenguajes "sin estrella" ≡ monoides aperiódicos
1968 ── Ken Thompson: algoritmo RE → AFN (el de "la construcción de Thompson")
1971 ── McNaughton & Papert: sin-estrella ≡ lógica de primer orden
1975 ── Lesk & Schmidt: Lex (la aplicación práctica de todo lo anterior)
1987 ── Paxson: Flex
hoy  ── el problema de la "altura de estrella generalizada" SIGUE ABIERTO
```

---

## Biblioteca de imágenes (Wikimedia Commons — todas reutilizables)

Imágenes verificadas, con licencia libre (Creative Commons), listas para tus diapositivas.
Todas son páginas reales de Wikimedia Commons (clic → botón "Descargar").

### La jerarquía de Chomsky
- **Diagrama de inclusión (en inglés)** — los cuatro niveles como conjuntos anidados:
  https://commons.wikimedia.org/wiki/File:Chomsky-hierarchy.svg
- **Versión alternativa**:
  https://commons.wikimedia.org/wiki/File:Chomsky-Hierarchie.svg

### Autómatas finitos (AFD/AFN)
- **Ejemplo de AFD (en español)** — ideal por estar ya en castellano:
  https://commons.wikimedia.org/wiki/File:Automata_finito.svg
- **Ejemplo clásico de AFD**:
  https://commons.wikimedia.org/wiki/File:DFAexample.svg
- **AFD genérico**:
  https://commons.wikimedia.org/wiki/File:Deterministic_Finite-state_Automaton.svg
- **AFD minimizado** (útil para la sección de minimización):
  https://commons.wikimedia.org/wiki/File:Minimized_DFA.svg
- **Categoría completa** (más ejemplos):
  https://commons.wikimedia.org/wiki/Category:Deterministic_finite_state_automata

### Construcción de Thompson (RE → AFN), ladrillo por ladrillo
- **Símbolo simple `a`**: https://commons.wikimedia.org/wiki/File:Thompson-a-symbol.svg
- **Concatenación**: https://commons.wikimedia.org/wiki/File:Thompson-concat.svg
- **Alternancia (`|`)**: https://commons.wikimedia.org/wiki/File:Thompson-or.svg
- **Clausura de Kleene (`*`)**: https://commons.wikimedia.org/wiki/File:Thompson-kleene-star.svg
- **Transición vacía (ε)**: https://commons.wikimedia.org/wiki/File:Thompson-epsilon.svg
- **Ejemplo completo armado**: https://commons.wikimedia.org/wiki/File:Small-thompson-example.svg
- **Categoría completa**:
  https://commons.wikimedia.org/wiki/Category:Thompson's_construction_(formal_language_theory)

### Además (ya en tu poder)
- Diagramas de **etapas del compilador** y del ejemplo `a = 4 + 2`: en el PDF de tu cátedra
  `..\Teoria\4_Introducción_a_Compiladores.pdf`.

> **Cómo usarlas legalmente:** son Creative Commons; al pie de la diapositiva poné el crédito
> (autor + "vía Wikimedia Commons, CC BY-SA"). En la página de cada archivo figura el autor y
> la licencia exacta.
