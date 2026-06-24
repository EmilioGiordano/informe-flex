# Flex en profundidad — documento técnico

> Continuación de [`flex.md`](flex.md) (que sirve de introducción). Acá vamos al detalle
> técnico: la teoría completa detrás del scanner, cómo Flex representa el autómata por dentro
> (decodificando el autómata **real** de nuestro ejemplo), las características avanzadas, la
> integración con Bison y una comparación arquitectónica con otras herramientas.
>
> Está pensado como material de fondo: de acá se extrae la "carne" técnica de la presentación.
> No hace falta exponer todo; elegí lo que quieras profundizar.

## Índice
1. La teoría completa: de la expresión regular al AFD
2. Cómo Flex guarda el autómata por dentro (tablas reales decodificadas)
3. El algoritmo de reconocimiento, paso a paso
4. Anatomía avanzada de un archivo `.l`
5. Características potentes (condiciones de arranque, contexto, acciones especiales)
6. Buffers de entrada y reentrancia
7. Integración con Bison/Yacc (front-end completo)
8. Rendimiento y compresión de tablas
9. Comparación arquitectónica con JFlex, PLY, ANTLR y re2c
10. Glosario y fuentes

---

## 1. La teoría completa: de la expresión regular al AFD

Flex automatiza una cadena de transformaciones que es **teoría pura de lenguajes formales**.
Vale la pena entenderla porque es exactamente lo que tu cátedra enseña, y es el "cómo trabaja"
profundo que pide la consigna.

```
   Expresión        Construcción      Construcción de       Minimización
   Regular    ──►   de Thompson  ──►  subconjuntos    ──►   de estados
                       (AFN)           (AFD)                  (AFD mínimo)
```

### 1.1. Expresión regular (ER)
Describe un conjunto de cadenas (un *lenguaje regular*). Operadores básicos:
- **Concatenación**: `ab` (una `a` seguida de una `b`).
- **Alternancia**: `a|b` (una `a` o una `b`).
- **Clausura de Kleene**: `a*` (cero o más `a`).
- Derivados: `a+` (una o más), `a?` (cero o una), `[0-9]` (clase de caracteres).

### 1.2. Construcción de Thompson: ER → AFN
Todo operador de ER tiene un "ladrillo" de autómata con transiciones vacías (ε). Se ensamblan
recursivamente para obtener un **Autómata Finito No determinista (AFN)** que reconoce la ER.
"No determinista" = desde un estado, un mismo símbolo (o ε) puede llevar a varios estados.

**Ejemplo — identificador** `letra (letra|digito)*`:
```
        letra              letra|digito
   (0) ───────► (1) ◄──────────────────┐
                 │                      │
                 └──────────────────────┘   (1 es estado de aceptación)
```

### 1.3. Construcción de subconjuntos: AFN → AFD
El AFN es cómodo de construir pero incómodo de ejecutar (habría que explorar varios caminos a
la vez). La **construcción de subconjuntos** lo convierte en un **Autómata Finito Determinista
(AFD)**: cada estado del AFD es un *conjunto* de estados del AFN, y desde cada estado, cada
símbolo lleva a **exactamente un** estado. Un AFD se ejecuta de forma trivial y veloz: leer
carácter, seguir la única flecha, repetir.

### 1.4. Minimización
Se fusionan los estados que son indistinguibles (que aceptan exactamente las mismas cadenas a
partir de ellos). Resultado: el AFD **más chico** que reconoce la ER. Menos estados = tabla
más compacta y scanner más rápido.

### 1.5. Lo importante: Flex hace TODO esto por vos
Vos escribís la ER; Flex corre Thompson + subconjuntos + minimización y emite el AFD como
tablas en C. **Y lo hace para TODAS tus reglas a la vez**, fusionándolas en un único AFD donde
cada estado final "recuerda" qué regla reconoció. Esto es clave: un solo autómata reconoce
números, identificadores y operadores simultáneamente.

---

## 2. Cómo Flex guarda el autómata por dentro (tablas reales)

Esto es lo más jugoso y concreto: vamos a **decodificar el autómata real** que Flex generó
para nuestro [`ejemplos/lexer.l`](ejemplos/lexer.l). No es teoría abstracta; son los números
que están en `lex.yy.c` ahora mismo.

### 2.1. Clases de equivalencia (`yy_ec`) — la primera optimización
Un AFD necesitaría, en teoría, una columna por cada uno de los 256 bytes posibles. Pero muchos
caracteres se comportan **idéntico**: para nuestro lexer, todos los dígitos hacen lo mismo,
todas las letras hacen lo mismo, etc. Flex los agrupa en **clases de equivalencia**.

Decodificando la tabla `yy_ec` real de nuestro ejemplo, los 256 caracteres se reducen a
**solo 12 clases**:

| Clase | Caracteres que la integran | ¿Por qué juntos? |
|------:|----------------------------|------------------|
| 1 | cualquier otro carácter | todos caen en la regla `.` (DESCONOCIDO) |
| 2 | espacio y tab `\t` | ambos son "espacio en blanco horizontal" |
| 3 | salto de línea `\n` | separado (el `.` no matchea `\n`) |
| 4 | `(` | operador propio |
| 5 | `)` | operador propio |
| 6 | `*` | operador propio |
| 7 | `+` | operador propio |
| 8 | `-` | operador propio |
| 9 | `/` | operador propio |
| 10 | dígitos `0`–`9` | todos arrancan/continúan un NUMERO igual |
| 11 | `=` | operador propio |
| 12 | letras `A`–`Z`, `a`–`z`, `_` | todas arrancan/continúan un IDENTIFICADOR igual |

> **Esto es oro para la presentación:** podés mostrar que Flex **comprimió 256 columnas a 12**
> automáticamente, dándose cuenta de que "todos los dígitos son intercambiables". Es una
> optimización real, visible, sobre TU ejemplo.

### 2.2. Meta-clases de equivalencia (`yy_meta`) — segunda compresión
Flex va más lejos: agrupa clases de equivalencia que se comportan igual en la mayoría de los
estados. En nuestro ejemplo, `yy_meta` junta las clases 2 y 3 (los dos tipos de espacio) en
una meta-clase. Es una compresión sobre la compresión.

### 2.3. Estados de aceptación (`yy_accept`) — qué token se reconoció
El AFD de nuestro lexer tiene unos **20 estados**. La tabla `yy_accept[estado]` dice, para cada
estado, **qué regla se reconoce** si el autómata se detiene ahí (`0` = estado no final, todavía
no se reconoció nada). Así un único autómata distingue todos los tipos de token: cada estado
final apunta a la regla (NUMERO, IDENTIFICADOR, MAS, etc.) que le corresponde.

### 2.4. Transiciones comprimidas (`yy_base`, `yy_def`, `yy_nxt`, `yy_chk`)
La función de transición no se guarda como una matriz `estado × clase` (gastaría memoria con
muchos ceros). Flex usa un esquema **disperso con transiciones por defecto**, repartido en
cuatro tablas:
- **`yy_nxt`**: el próximo estado para una transición concreta.
- **`yy_chk`**: verifica que esa entrada de `yy_nxt` corresponde al estado actual (control de
  colisiones del empaquetado).
- **`yy_base`**: dónde empieza, dentro de `yy_nxt`, la fila de cada estado.
- **`yy_def`**: a qué estado "por defecto" caer si la transición buscada no está explícita.

La idea: las transiciones más comunes se heredan de un estado por defecto, y solo se guardan
explícitamente las excepciones. Resultado: tablas chiquititas (en nuestro caso, `yy_nxt` tiene
apenas 32 entradas para todo el autómata).

---

## 3. El algoritmo de reconocimiento, paso a paso

El motor que recorre esas tablas implementa dos reglas que ya mencionamos, pero acá vemos
*cómo*:

### 3.1. Match más largo (*maximal munch*) con retroceso
El scanner **no** se detiene en el primer estado de aceptación que encuentra: sigue avanzando
mientras pueda, y **recuerda la última posición donde aceptó** y qué regla. Cuando ya no puede
avanzar (cae en un estado muerto), **retrocede** hasta esa última aceptación y emite ese token.

**Traza conceptual** reconociendo `a1` con la regla `letra(letra|digito)*`:

| Paso | Lee | Estado | ¿Acepta? | Recordado |
|-----:|:---:|:------:|:--------:|-----------|
| 1 | `a` | S1 | sí (IDENT) | "IDENT hasta aquí: `a`" |
| 2 | `1` | S1 | sí (IDENT) | "IDENT hasta aquí: `a1`" |
| 3 | (fin/espacio) | muerto | — | retrocede al último aceptado → emite **IDENT(`a1`)** |

Por eso `a1` sale como **un** token y no como `a` + `1`.

### 3.2. Desempate por orden de reglas
Si al alcanzar la misma longitud, **dos** reglas aceptan, gana la que **aparece primero** en el
`.l`. Este es el truco para las palabras clave: poniendo la regla `"if"` *antes* que la de
identificadores, `if` se reconoce como palabra clave; cualquier otra palabra cae en la regla
genérica de identificador.

### 3.3. La regla por defecto
Si ningún patrón matchea, Flex tiene una **regla por defecto** que copia el carácter a la
salida (`ECHO`). En nuestro lexer la "tapamos" con la regla `.` que imprime `DESCONOCIDO`, para
controlar nosotros qué pasa con lo inesperado.

---

## 4. Anatomía avanzada de un archivo `.l`

Más allá de las tres secciones (`definiciones %% reglas %% código`), Flex ofrece:

### 4.1. Directivas `%option`
Configuran el scanner generado. Las más útiles:
- `%option noyywrap` — evita tener que definir `yywrap()` (para entrada de un solo archivo).
- `%option yylineno` — mantiene automáticamente el número de línea en la variable `yylineno`
  (clave para mensajes de error con número de línea).
- `%option case-insensitive` — patrones sin distinguir mayúsculas/minúsculas.
- `%option reentrant` — genera un scanner reentrante (ver §6).
- `%option debug` — emite trazas de qué regla matchea cada vez (excelente para depurar).

### 4.2. Sintaxis de expresiones regulares de Flex
Flex soporta un dialecto rico de ER:
- `[abc]`, `[^abc]` (negación), `[a-z]` (rangos), `[[:digit:]]` (clases POSIX).
- `r*`, `r+`, `r?`, `r{2,5}` (repetición acotada).
- `r1|r2`, `(r)`, `"texto literal"`, `\.` (escape).
- `.` = cualquier carácter **excepto** salto de línea.
- `{NOMBRE}` = expande una definición declarada en la sección 1.

### 4.3. Anclas de posición
- `^r` — la ER `r` solo matchea **al principio de la línea**.
- `r$` — solo **al final de la línea**.

---

## 5. Características potentes

### 5.1. Condiciones de arranque (*start conditions*) — el scanner con "modos"
A veces el mismo carácter significa cosas distintas según el contexto (dentro de un comentario,
dentro de un string, etc.). Las **condiciones de arranque** son como **estados/modos** del
scanner: ciertas reglas solo se activan en cierto modo.

Se declaran con `%x` (exclusivas) o `%s` (inclusivas) y se cambia de modo con `BEGIN(modo)`.

**Ejemplo clásico — saltar comentarios de bloque `/* ... */`:**
```lex
%x COMENTARIO
%%
"/*"            BEGIN(COMENTARIO);      /* entro al modo comentario */
<COMENTARIO>"*/"   BEGIN(INITIAL);      /* salgo del modo */
<COMENTARIO>.|\n   ;                    /* dentro: ignoro todo */
```
Esto resuelve elegantemente algo que a mano sería engorroso. Es uno de los rasgos más potentes
de Flex y un gran ejemplo para mostrar en clase.

### 5.2. Contexto posterior (*trailing context*)
`r/s` matchea `r` **solo si va seguida de** `s`, pero `s` no se consume. Útil para reglas
sensibles a lo que viene después.

### 5.3. Acciones especiales
- **`ECHO`** — copia el lexema a la salida.
- **`REJECT`** — "rechaza" este match y prueba la **segunda** mejor regla (para patrones
  solapados).
- **`yymore()`** — anexa el próximo lexema al actual en lugar de reemplazarlo.
- **`yyless(n)`** — devuelve a la entrada todos los caracteres salvo los primeros `n`.
- **`unput(c)` / `input()`** — devolver un carácter a la entrada / leer uno directo.

---

## 6. Buffers de entrada y reentrancia

### 6.1. De dónde lee el scanner
Por defecto lee de `yyin` (un `FILE*`, típicamente stdin). Pero Flex permite analizar
**strings en memoria** y manejar **múltiples buffers**:
- `yy_scan_string("texto")` — analizar una cadena de C.
- `yy_create_buffer` / `yy_switch_to_buffer` — apilar buffers, p. ej. para implementar
  `#include` (cuando aparece un include, se cambia de buffer al archivo incluido y se vuelve).

### 6.2. Reentrancia y multithreading
El scanner por defecto usa **variables globales** (`yytext`, `yylval`, etc.), así que **no es
reentrante** ni thread-safe. Con `%option reentrant` Flex genera un scanner que lleva su estado
en una estructura que se pasa como parámetro, permitiendo varios scanners en paralelo. Esta es
una de las limitaciones históricas de Flex que conviene mencionar en la comparación.

---

## 7. Integración con Bison/Yacc — el front-end completo

Flex casi nunca trabaja solo: produce los **tokens** que un **analizador sintáctico** consume.
La dupla libre estándar es **Flex + Bison** (equivalente moderno de Lex + Yacc).

### 7.1. El contrato entre ambos
- Bison genera una función `yyparse()` que, cada vez que necesita el próximo token, **llama a
  `yylex()`** (¡la función que genera Flex!).
- `yylex()` devuelve un **código de token** (un entero; ej. `NUMERO`, `IDENTIFICADOR`). Esos
  códigos los **define Bison** en un header (`y.tab.h` / `*.tab.h`) que el `.l` incluye.
- El **valor** asociado al token (p. ej., *qué* número) se pasa por la variable global
  compartida **`yylval`**.

### 7.2. Esquema de quién hace qué
```
   código fuente
        │
        ▼
   ┌─────────┐   tokens (yylex)   ┌─────────┐   árbol sintáctico
   │  FLEX   │ ─────────────────► │  BISON  │ ──────────────────►  ...
   │ (léxico)│   yylval (valor)   │(sintáct.)│
   └─────────┘                    └─────────┘
```
Esto conecta perfectamente con el diagrama de etapas del compilador del PDF de tu cátedra:
Flex = "Análisis Léxico"; Bison = "Análisis Sintáctico".

### 7.3. Seguimiento de posición
Para errores con fila/columna, Flex aporta `yylineno` y Bison tiene infraestructura de
*locations* (`yylloc`). Juntos permiten mensajes tipo `error en línea 12, columna 5`.

---

## 8. Rendimiento y compresión de tablas

El "Fast" de Flex es configurable. Hay un compromiso **tamaño ↔ velocidad**:

| Opción | Qué hace | Compromiso |
|--------|----------|------------|
| (por defecto) | Usa clases de equivalencia + meta-clases (lo que vimos en §2) | Tablas chicas; un poco más lento por la indirección |
| `-Cf` | Tablas **completas** (*full*), sin compresión | Más rápido; tablas grandes |
| `-CF` | Variante rápida de tablas completas | El scanner más veloz de Flex |
| `-Cem` | Máxima compresión (clases + meta-clases) | Tablas mínimas; es el comportamiento por defecto |

> En nuestro `lex.yy.c` se ve que se usó la compresión por defecto: por eso aparecen `yy_ec`
> (clases) y `yy_meta` (meta-clases). Con `-Cf` esas tablas desaparecerían a favor de una tabla
> de transición directa.

### Dirigido por tablas vs. código directo
Flex es **dirigido por tablas** (*table-driven*): un motor genérico recorre las tablas
numéricas. Otra estrategia es generar **código directo** (un montón de `goto`/`switch` que *son*
el autómata): así trabaja **re2c**, que produce scanners aún más rápidos a costa de código más
voluminoso y menos flexible. Es un buen punto de comparación.

---

## 9. Comparación arquitectónica (más allá de la tabla básica)

No todas las herramientas usan el mismo modelo formal. Esto es lo que las distingue **por
dentro** (ideal para una comparación con criterio técnico, punto 4 de la consigna):

| Herramienta | Modelo del analizador léxico | Paradigma |
|---|---|---|
| **Flex** | AFD dirigido por tablas, comprimido | RE → AFN → AFD |
| **Lex** | AFD (igual idea, código menos optimizado) | RE → AFN → AFD |
| **JFlex** | AFD dirigido por tablas, en Java | RE → AFN → AFD (mismo modelo, otro lenguaje) |
| **re2c** | AFD como **código directo** (goto/switch) | RE → AFD codificado inline |
| **PLY** | AFD construido en runtime sobre el motor `re` de Python | RE de Python en tiempo de ejecución |
| **ANTLR (v4)** | Lexer y parser **adaptativos** (algoritmo ALL(*)) | Modelo distinto, más potente para sintaxis |

**Lecturas clave de esta tabla:**
- Flex, Lex y JFlex comparten **exactamente** el modelo teórico de tu cátedra (RE→AFN→AFD).
  Por eso Flex es el que mejor "ilustra la teoría".
- re2c muestra que el **mismo** AFD se puede materializar como tablas (Flex) o como código
  (re2c): misma teoría, distinta ingeniería.
- ANTLR juega en otra liga conceptual (combina léxico y sintáctico con un algoritmo adaptativo
  ALL(*)); es más poderoso pero **se aleja del modelo limpio AFD** que el TP quiere mostrar.

---

## 10. Glosario y fuentes

### Glosario rápido
- **Token / componente léxico**: unidad mínima con significado (NUMERO, IDENT, `+`…).
- **Lexema**: el texto concreto que formó el token (`yytext`).
- **Patrón**: la expresión regular que describe a un token.
- **AFN / AFD**: autómata finito no determinista / determinista.
- **Maximal munch**: regla del match más largo.
- **Clase de equivalencia**: grupo de caracteres que el autómata trata igual.
- **Start condition**: "modo" del scanner que activa/desactiva reglas.

### Fuentes
- **Manual oficial de Flex** — referencia completa de directivas, condiciones de arranque,
  buffers, reentrancia y opciones de compresión.
  https://westes.github.io/flex/manual/  ·  Repo: https://github.com/westes/flex
- **Flex / Lex — Wikipedia** (historia, modelo AFD, licencia, POSIX).
  https://en.wikipedia.org/wiki/Flex_(lexical_analyzer_generator) ·
  https://en.wikipedia.org/wiki/Lex_(software)
- **Lex — A Lexical Analyzer Generator**, M. E. Lesk y E. Schmidt (paper original, Bell Labs).
  https://www.cs.utexas.edu/~novak/lexpaper.htm
- **Aho, Lam, Sethi, Ullman — *Compilers: Principles, Techniques, and Tools* ("Dragon Book")**,
  cap. 3 (Análisis Léxico): Thompson, construcción de subconjuntos, minimización. Referencia
  académica estándar para toda la teoría de §1.
- **Material de cátedra:** `4_Introducción_a_Compiladores.pdf`.

> Evidencia propia: las tablas decodificadas en §2 provienen del archivo `ejemplos/lex.yy.c`
> generado en este mismo proyecto a partir de `ejemplos/lexer.l`.
