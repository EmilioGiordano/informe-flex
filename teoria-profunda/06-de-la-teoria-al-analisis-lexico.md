# 06 — De la teoría al scanner: cómo todo esto se vuelve un analizador léxico

> Cierre que baja la teoría profunda a la práctica. Todo lo de los documentos anteriores
> —Kleene, Thompson, Rabin–Scott, Myhill–Nerode— se ejecuta, automatizado, cada vez que Flex
> compila un `.l`. Este documento es el puente entre la matemática y la herramienta.

---

## 1. El análisis léxico como aplicación directa de la teoría

Un analizador léxico hace exactamente esto: dado un texto, reconocer la secuencia de **tokens**
(lexemas con su categoría). Cada categoría de token es un **lenguaje regular**:

| Token | Lenguaje regular (expresión) |
|---|---|
| Número entero | `[0-9]+` |
| Identificador | `[a-zA-Z_][a-zA-Z0-9_]*` |
| Palabra clave `if` | `if` |
| Operador | `\+ | \- | \* | /` |

Reconocer tokens = decidir pertenencia a estos lenguajes regulares = correr autómatas finitos.
**El análisis léxico ES teoría de lenguajes regulares aplicada.** Nada más, nada menos.

---

## 2. El pipeline completo (teoría → código), revisitado

Cuando corrés `flex lexer.l`, por dentro pasa toda la cadena de teoremas:

```
   Tus reglas (.l)                          Documento donde se explica
   ──────────────                           ──────────────────────────
   expresiones regulares          ........  doc 02 (cara 1)
        │  construcción de Thompson .......  doc 02 §3.1  (Thompson 1968)
        ▼
       AFN  (no determinista, con ε)
        │  construcción de subconjuntos ...  doc 02 §3.2  (Rabin–Scott 1959)
        ▼
       AFD  (determinista)
        │  minimización ..................  doc 03        (Myhill–Nerode, Hopcroft)
        ▼
   AFD mínimo
        │  emisión como tablas en C
        ▼
   lex.yy.c  (yy_nxt, yy_accept, yy_ec…)  .  flex-profundo.md §2 (decodificado)
```

Cada flecha es un resultado de la teoría profunda. Flex es, en esencia, **estos teoremas
convertidos en un programa**.

---

## 3. Lo que el análisis léxico le AGREGA a la teoría pura

La teoría reconoce **un** lenguaje a la vez (sí/no). Un lexer necesita un par de ideas extra,
pragmáticas, que no están en el teorema de Kleene:

### 3.1. Reconocer muchos tokens a la vez
Flex fusiona los AFD de **todas** las reglas en uno solo, donde cada estado final recuerda **qué
regla** reconoció (la tabla `yy_accept`). Un solo autómata distingue números, identificadores y
operadores simultáneamente.

### 3.2. Match más largo (*maximal munch*)
La teoría dice "¿esta cadena entera está en L?". El lexer en cambio debe **trocear un flujo** y
decidir dónde termina cada token. La regla: consumir **el lexema más largo posible**. Por eso
`index` es un token y no `i`+`ndex`. Requiere que el autómata recuerde la última posición de
aceptación y retroceda si se pasa (ver `flex-profundo.md` §3).

### 3.3. Desempate por prioridad
Si dos reglas matchean lo mismo, gana la primera del archivo. Así `if` se reconoce como palabra
clave y no como identificador. Es una decisión de diseño, no un teorema.

> **Conclusión:** un generador léxico = teoría de autómatas (el núcleo) + un puñado de reglas
> de troceo (maximal munch, prioridad). La teoría aporta el motor; el análisis léxico aporta la
> "carrocería" para usarlo sobre flujos de texto reales.

---

## 4. La familia de herramientas (todas hijas de la misma teoría)

Todas implementan el **mismo** pipeline RE→AFN→AFD; cambian el lenguaje destino y la ingeniería:

| Herramienta | Año | Genera | Particularidad |
|---|---|---|---|
| **Lex** | 1975 | C | El original (Bell Labs). |
| **Flex** | ~1987 | C/C++ | Libre, rápido, table-driven. El estándar de facto. |
| **JFlex** | ~1998 | Java | "Flex para Java". |
| **re2c** | ~1994 | C/C++ | Genera el AFD como **código directo** (goto/switch), no tablas. |
| **Ragel** | ~2001 | varios | Permite acciones en cualquier punto del autómata. |
| **PLY** | ~2001 | Python | Lex/Yacc en Python; usa el motor `re` en runtime. |
| **ocamllex** | — | OCaml | El generador léxico de OCaml. |
| **Alex** | — | Haskell | El generador léxico de Haskell. |
| **logos** | ~2019 | Rust | Moderno, muy rápido, basado en derivadas. |
| **ANTLR** | 1992 | multi | Léxico + sintáctico; algoritmo adaptativo ALL(*). |

> Que existan generadores léxicos para C, Java, Python, OCaml, Haskell, Rust… y que todos hagan
> lo mismo por dentro, es la mejor prueba de que el fundamento es **teórico y universal**, no
> atado a un lenguaje. *"Los fundamentos del diseño de los compiladores siguen siendo los
> mismos de siempre"* (PDF de tu cátedra).

---

## 5. ¿Y por qué algunos compiladores escriben el lexer a MANO?

Un giro interesante: varios compiladores de producción (**GCC**, **Clang**, entre otros)
terminaron escribiendo su analizador léxico **a mano** en vez de usar Flex. ¿Por qué, si la
teoría dice que el generado es correcto y rápido?

- **Rendimiento al límite:** un lexer a mano, muy afinado, puede superar al table-driven en los
  casos calientes.
- **Mejores mensajes de error y recuperación:** control fino sobre qué hacer ante entrada
  inválida.
- **Casos sensibles al contexto** que incomodan al modelo regular puro (p. ej. el manejo de
  ciertos tokens en C++).

> **Lección madura para la presentación:** la herramienta generadora es **excelente para la
> gran mayoría de los casos** (prototipos, lenguajes de dominio específico, la docencia), pero
> no es dogma. Saber *cuándo* el generador conviene y cuándo no es señal de criterio
> ingenieril. La teoría te dice qué es posible; la ingeniería, qué conviene.

---

## 6. Síntesis final: por qué este tema es hermoso

1. Un problema **cotidiano y humilde** —partir texto en palabras— resulta ser la cara visible
   de una de las teorías **más profundas y completas** de la informática.
2. Esa teoría **converge desde cinco direcciones** (máquinas, expresiones, gramáticas, lógica,
   álgebra) sobre un mismo concepto: rarísimo y bellísimo.
3. Es **totalmente decidible y eficiente**: un paraíso algorítmico que permite herramientas
   automáticas y confiables como Flex.
4. Y sin embargo **todavía esconde misterios** sin resolver (altura de estrella generalizada).
5. La línea va sin cortes desde **Turing (1936)** y **Kleene (1951)** hasta el `lexer.l` que
   corriste en tu máquina esta semana. Tocaste, con un `echo "a = 4 + 2" | ./lexer`, la punta
   de 90 años de matemática.

---

## Fuentes
- *Lexical analysis* — Wikipedia: https://en.wikipedia.org/wiki/Lexical_analysis
- *Maximal munch* — Wikipedia: https://en.wikipedia.org/wiki/Maximal_munch
- *Flex* / *Lex* — Wikipedia (ver `flex.md` y `flex-profundo.md`).
- Aho, Lam, Sethi, Ullman — *Compilers: Principles, Techniques, and Tools* ("Dragon Book"),
  cap. 3 (análisis léxico): el puente canónico entre teoría y herramienta.
- Material de cátedra: `4_Introducción_a_Compiladores.pdf`.
