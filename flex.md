# Flex — Documento de referencia para el TP2

> Material de fondo sobre la herramienta elegida. Pensado como lectura nutritiva para
> entender Flex a fondo y extraer de acá el contenido de las diapositivas.
> Todas las afirmaciones tienen su fuente al pie (sección **Bibliografía**).

---

## 1. ¿Qué es Flex?

**Flex** (acrónimo de ***F**ast **L**exical analyzer generator*, "generador rápido de
analizadores léxicos") es un programa que **genera analizadores léxicos** (también llamados
*scanners* o *lexers*) en lenguaje **C** (y C++).

En una frase: *vos le describís los tokens de tu lenguaje con expresiones regulares, y Flex
te escribe automáticamente el código C del analizador léxico que los reconoce.* [1][2]

Ese analizador generado funciona internamente como un **autómata finito determinista (AFD)**:
exactamente el modelo matemático que tu cátedra asocia al reconocimiento de patrones. [1]

---

## 2. ¿Para qué sirve?

- **Construir la primera etapa de un compilador o intérprete**: el análisis léxico, que
  parte el código fuente en tokens (identificadores, números, palabras clave, operadores…).
- **Cualquier tarea de "parsing" de texto estructurado**: procesar archivos de configuración,
  lenguajes de marcado, filtros de texto, conversores de formato, etc.
- **En conjunto con un generador de analizadores sintácticos** (Bison o Yacc): Flex produce
  los tokens y Bison los organiza según una gramática. Es la dupla clásica para hacer
  lenguajes. [1][2]

La gran ventaja: lo que a mano serían cientos o miles de líneas de C programando estados de
un autómata, con Flex son unas pocas decenas de líneas de expresiones regulares.

---

## 3. Orígenes e historia

La historia de Flex es, en realidad, la historia de **dos** herramientas: Lex (la original)
y Flex (su sucesora libre).

### 3.1. Lex (1975) — el origen

- Creada en **Bell Laboratories** (Murray Hill, Nueva Jersey) por **Mike Lesk** y
  **Eric Schmidt**, con la implementación a cargo de Schmidt. [3]
- Documentada por primera vez en **octubre de 1975** como el *Computing Science Technical
  Report #39* de Bell Labs. [3]
- Se volvió herramienta **estándar de Unix a partir de la Versión 7 (1979)**, formando la
  dupla histórica con **Yacc** (el generador sintáctico de Steve Johnson). [3]
- Esto coincide exactamente con lo que cuenta el PDF de tu cátedra: *"El más conocido es Lex,
  desarrollado por Mike Lesk para Unix"* (1975).

> **Dato jugoso para la presentación:** aquel **Eric Schmidt** que de estudiante implementó
> Lex es el mismo **Eric Schmidt que años después fue CEO de Google (2001–2011)**. Una de las
> herramientas fundacionales de los compiladores la escribió un futuro CEO de Google. [3]

### 3.2. Flex (~1987) — la reescritura libre

- Lex era software propietario de AT&T. Hacía falta una alternativa **libre**.
- En **1982**, **Vern Paxson** tomó el proyecto "lex" de los *Software Tools* de manos de
  **Jef Poskanzer**, y **alrededor de 1987 lo reescribió en C**: así nació **Flex**, en el
  **Lawrence Berkeley National Laboratory**. [1]
- El nombre "Fast" no es casualidad: Flex genera scanners **más rápidos** que Lex. La técnica
  de "tablas rápidas" fue un diseño de **Van Jacobson**, implementado por **Kevin Gong** y
  el propio Paxson. [1]

> **Otro dato jugoso:** **Vern Paxson** se convirtió luego en una leyenda de la **seguridad
> informática** (creó el sistema de detección de intrusiones **Bro**, hoy **Zeek**, y es
> profesor en UC Berkeley). Y **Van Jacobson**, que inspiró las tablas rápidas de Flex, es
> uno de los padres del control de congestión de **TCP/IP**. Flex tiene ADN de gente que
> después marcó Internet. [1]

### 3.3. Línea de tiempo resumida

```
1975 ── Lex (Lesk & Schmidt, Bell Labs) ── par de Yacc
1979 ── Lex entra como estándar en Unix V7
1982 ── Paxson toma el proyecto de Poskanzer
~1987 ── nace Flex (reescritura libre en C, Berkeley)
1990s ── serie 2.x; Flex 2.5 (~1994) mejora portabilidad
2017 ── Flex 2.6.4 (última versión estable a la fecha)
```
[1][3]

---

## 4. ¿Cómo funciona? (el flujo interno)

Cuando Flex procesa tu especificación, hace internamente la cadena teórica clásica:

```
Expresiones      ──►   AFN          ──►   AFD              ──►   Código C
regulares              (autómata no       (autómata             (tablas de
(las escribís vos)     determinista)      determinista)         transición)
```

Es decir: **Expresión Regular → AFN → AFD → código C**. [2][4]

Y al reconocer el texto, el scanner generado aplica dos reglas estándar:

- **"Maximal munch" / match más largo:** elige siempre el token más largo posible. Ante
  `index`, no para en `i`; sigue hasta consumir `index`.
- **Prioridad por orden:** si dos reglas coinciden, gana la que aparece primero en el archivo
  (así `if` se reconoce como palabra clave y no como identificador genérico).

El AFD generado es **dirigido por tablas** (*table-driven*): Flex no escribe `if/else` por
cada caso, sino tablas numéricas de transición (`yy_nxt`, `yy_accept`, etc.) que un motor
genérico recorre. Por eso es rápido y compacto. [1][4]

> Para reconocer **lenguajes regulares**, un AFD es óptimo: en cada estado, para cada símbolo
> de entrada, hay exactamente una transición. Cada estado final del AFD corresponde a un tipo
> de token. [4]

---

## 5. Anatomía de una especificación (archivo `.l`)

Todo archivo de Flex tiene **tres secciones** separadas por `%%`:

```
   DEFINICIONES        (atajos de expresiones regulares; ej.  DIGITO  [0-9])
%%
   REGLAS              (patrón  →  acción: qué hacer/devolver al reconocerlo)
%%
   CÓDIGO DE USUARIO   (funciones auxiliares, main, etc.)
```

La parte central (las **reglas**) es el corazón: cada línea es
`<expresión regular>  { acción }`. Por ejemplo:

```lex
{DIGITO}+                      { printf("NUMERO(%s)\n", yytext); }
{LETRA}({LETRA}|{DIGITO})*     { printf("IDENTIFICADOR(%s)\n", yytext); }
```

> En este mismo proyecto tenés un ejemplo completo y funcionando en
> [`ejemplos/lexer.l`](ejemplos/lexer.l), que reconoce un mini-lenguaje aritmético.

Algunas variables/funciones que Flex pone a tu disposición:
- **`yylex()`** — la función del analizador, generada automáticamente.
- **`yytext`** — el texto exacto que acaba de reconocer (el "lexema").
- **`yywrap()`** — qué hacer al llegar al fin de archivo.

---

## 6. Flex hoy (estado actual)

| Aspecto | Detalle |
|---|---|
| **Última versión estable** | **2.6.4**, del **6 de mayo de 2017** [1] |
| **Lenguaje que genera** | C y C++ (la variante C++ usa `FlexLexer.h`) [1] |
| **Licencia** | **BSD** (software libre) [1] |
| **Mantenimiento** | Proyecto en **GitHub: `github.com/westes/flex`** [1] |
| **Estandarización** | Lex está en la especificación **POSIX**; Flex la cumple en gran parte [1] |
| **Pareja sintáctica habitual** | **GNU Bison** (en Linux) o **Berkeley Yacc** (en BSD) [1] |

**Limitaciones conocidas** (útiles para la sección de comparación / honestidad técnica):
- Trabaja a nivel de **bytes de 8 bits**: no tiene soporte nativo de **Unicode**. [1]
- El scanner generado **no es reentrante** por defecto (se puede activar). [1]
- Depende de cabeceras propias del entorno Unix. [1]

> **Curiosidad:** que la última versión sea de **2017** no es abandono, sino **madurez**:
> Flex es una herramienta tan estable y probada que prácticamente no necesita cambios. Es
> infraestructura "terminada".

---

## 7. Cosas interesantes (para enganchar al público)

1. **Un futuro CEO de Google** (Eric Schmidt) implementó Lex, el abuelo de Flex. [3]
2. **Flex NO es parte del proyecto GNU**, a pesar de venir casi siempre junto a herramientas
   GNU como Bison. Usa licencia BSD. Es un error común creer lo contrario. [1]
3. La dupla **Flex + Bison** es el reemplazo libre de la dupla histórica **Lex + Yacc**.
4. El "Fast" de Flex viene de una idea de **Van Jacobson**, una leyenda de las redes (TCP/IP).
5. Su autor, **Vern Paxson**, terminó siendo referente mundial en **ciberseguridad** (Zeek).
6. La idea de fondo —"describí con expresiones regulares, que la máquina genere el autómata"—
   tiene **50 años** (1975) y sigue intacta: *"los fundamentos del diseño de los compiladores
   siguen siendo los mismos de siempre"* (cita de tu propio PDF de cátedra).

---

## 8. Comparación rápida con herramientas similares

(Para el punto 4 de la consigna; acá en versión breve.)

| Herramienta | Año / origen | Genera | Notas |
|---|---|---|---|
| **Lex** | 1975, Bell Labs | C | El original, propietario. Valor histórico. |
| **Flex** | ~1987, Berkeley | C/C++ | Libre (BSD), rápido. El estándar de facto en C. |
| **JFlex** | ~1998 | Java | "Flex para Java". Se combina con CUP. |
| **PLY** | ~2001 | Python | Lex/Yacc en Python; muy legible, sin compilar. |
| **ANTLR** | 1992 | Multi-target | Léxico **+** sintáctico juntos; muy usado en industria. |

---

## 9. Imágenes sugeridas para las diapositivas

Como esto es texto, acá van **qué imágenes conviene incluir y de dónde sacarlas** (todas
reutilizables o propias):

1. **Diagrama de etapas del compilador** → ya lo tenés en el PDF de tu cátedra
   (`..\Teoria\4_Introducción_a_Compiladores.pdf`, diapositiva "ETAPAS DE COMPILACIÓN").
   Es ideal porque ya está en español y es la fuente oficial de la materia.
2. **El ejemplo `a = 4 + 2` → tokens** → también está en ese PDF (diapositiva "Análisis
   léxico"). Conecta tu demo con la teoría vista en clase.
3. **Foto de Eric Schmidt** (para el dato de Lex → Google) → Wikimedia Commons,
   categoría "Eric Schmidt" (imágenes con licencia libre):
   https://commons.wikimedia.org/wiki/Category:Eric_Schmidt
4. **Foto de Vern Paxson** (autor de Flex) → buscar en Wikimedia Commons / su página en
   UC Berkeley.
5. **Diagrama del flujo de Flex** → podés rehacer este (simple y claro):

   ```
   archivo .l  ──►  [ flex ]  ──►  lex.yy.c  ──►  [ gcc ]  ──►  scanner  ──►  tokens
   (tus reglas)                  (autómata en C)              (ejecutable)
   ```
6. **Diagrama de un AFD** (autómata finito) para ilustrar el reconocimiento → podés armar uno
   simple (estados y flechas) para "número" o "identificador". También hay ejemplos en la
   Wikipedia de "Deterministic finite automaton".

> Sugerencia: priorizá las imágenes del **PDF de tu cátedra** (puntos 1 y 2): quedan
> coherentes con lo que el profesor ya mostró y refuerzan que tu trabajo se apoya en la teoría
> de la materia.

---

## 10. Bibliografía y fuentes

Fuentes consultadas para este documento (verificadas el 23/06/2026):

- **[1]** *Flex (lexical analyzer generator)* — Wikipedia (inglés).
  https://en.wikipedia.org/wiki/Flex_(lexical_analyzer_generator)
- **[2]** *Flex (Fast Lexical Analyzer Generator)* — GeeksforGeeks.
  https://www.geeksforgeeks.org/compiler-design/flex-fast-lexical-analyzer-generator/
- **[3]** *Lex (software)* — Wikipedia (inglés).
  https://en.wikipedia.org/wiki/Lex_(software)
- **[4]** *Lex — A Lexical Analyzer Generator* (M. E. Lesk y E. Schmidt, Bell Laboratories) —
  documento original. https://www.cs.utexas.edu/~novak/lexpaper.htm

Fuentes adicionales recomendadas para la bibliografía formal del TP:
- **Manual oficial de Flex** (GNU/`westes`): https://github.com/westes/flex y
  https://westes.github.io/flex/manual/
- **Aho, Lam, Sethi, Ullman — *Compilers: Principles, Techniques, and Tools*** (el
  "Libro del Dragón"), capítulo de análisis léxico. Referencia académica estándar.
- **Material de cátedra:** `4_Introducción_a_Compiladores.pdf` (Teoría de los Lenguajes de
  Programación).
