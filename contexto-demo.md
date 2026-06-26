# Pack de contexto — para proponer la UI de la demo web (TP2 Flex)

> **Para qué es este archivo:** dárselo a una IA (junto con `propuesta-demo-web.md`) para que
> tenga TODO el contexto del tema y de la demo, y proponga una **identidad visual / UI**
> distintiva y bien fundada. Este archivo consolida la teoría investigada; el otro
> (`propuesta-demo-web.md`) define **qué hace** la app (la UX).
>
> **Lo que se te pide a vos, IA:** proponer la **UI** (paleta, tipografía, layout visual,
> microinteracciones, "elemento firma") de una demo web interactiva. Que sea **distintiva, no
> genérica**, y **anclada en el mundo del tema** (no un dashboard SaaS). **No reutilices** ningún
> estilo preexistente: se busca una propuesta visual fresca. La UX ya está definida; vos aportás
> el "cómo se ve".

---

## 0. Resumen ultra-corto (si solo leés esto)

La demo visualiza **cómo un analizador léxico parte un texto en "tokens"**. Mundo del tema:
compiladores, autómatas, expresiones regulares, terminales Unix, la herramienta **Flex**. El
momento estrella a comunicar visualmente es el **"match más largo"**: el reconocedor se traga
una palabra entera como un solo token y la corta recién en el espacio. Vocabulario clave:
*token, lexema, autómata, estado, transición, rastreador/scanner, expresión regular*.

---

## 1. El proyecto (contexto académico)

- Trabajo de Investigación de la materia **Teoría de los Lenguajes de Programación** (5° año,
  Lic. en Informática).
- Tema: **Generadores de Analizadores Léxicos**. Herramienta elegida: **Flex**.
- Entregable: una **presentación** para exponer en clase. La demo web es el momento interactivo
  de esa exposición (se proyecta en vivo y/o se embebe en las slides).

---

## 2. Qué es el análisis léxico (el corazón del tema)

Un **compilador** traduce código de un lenguaje a otro en etapas. La **primera** es el
**análisis léxico**: lee el código fuente como una tira de caracteres y lo agrupa en **tokens**
(las "palabras" con significado), descartando espacios y comentarios.

Ejemplo canónico (de la cátedra):

```
a [ index ] = 4 + 2
```
se convierte en la secuencia de tokens:
`IDENTIFICADOR(a)` `[` `IDENTIFICADOR(index)` `]` `=` `NUMERO(4)` `+` `NUMERO(2)`

Tres términos que la demo maneja:
- **Token:** la categoría/tipo (`NUMERO`, `IDENTIFICADOR`, `MAS`…).
- **Lexema:** el texto concreto que formó el token (`4`, `index`).
- **Patrón:** la regla que lo describe, escrita como **expresión regular** (`[0-9]+`).

Al analizador léxico también se lo llama **scanner** o **rastreador** (palabra de la cátedra) —
porque "escanea/rastrea" el texto de izquierda a derecha.

---

## 3. La teoría mínima (lo que la demo ilustra)

- **Expresiones regulares (regex):** *describen* los tokens.
  `número = [0-9]+`, `identificador = [a-zA-Z_][a-zA-Z0-9_]*`
- **Autómatas finitos (AFD):** *reconocen* esos patrones. Es una máquina con **estados** y
  **transiciones**, sin memoria (solo "en qué estado estoy"). Lee carácter a carácter y al
  final **acepta** o **rechaza**.
- **Teorema de Kleene:** expresión regular ≡ autómata finito (son equivalentes). Esto es lo que
  permite que un generador convierta regex en una máquina automáticamente.

**El autómata que la demo visualiza** (el del identificador), chico y legible:
```
        letra, _              letra, dígito, _
  →(S0) ─────────► ((S1)) ⟲──────────────────┘
   inicial          aceptación (con self-loop)
```
Una letra lleva de S0 al estado final S1; desde ahí, cada letra o dígito mantiene la aceptación
(el bucle). Cualquier otro carácter corta el token.

---

## 4. Lo que la demo ENSEÑA (el valor a comunicar visualmente)

1. **Match más largo (maximal munch) — EL momento estrella.** El reconocedor consume **el lexema
   más largo posible**: ante `index` no para en `i`, sigue hasta `index` y lo emite como UN
   token; recién el espacio lo corta. Visualmente, "la palabra entera se traga y el espacio la
   parte". Hay una **"última posición de aceptación"** que avanza: ese es el concepto sutil.
2. **Prioridad de reglas:** si dos patrones matchean, gana el primero (así `if` es palabra clave,
   no identificador).
3. **Espacios ignorados** y **caracteres desconocidos** (DESCONOCIDO).

---

## 5. La herramienta: Flex (mundo/vernáculo del tema)

- **Flex** = *Fast Lexical analyzer generator*. Toma reglas (regex) y **genera** el código C de
  un analizador léxico (un AFD). Software libre, estándar de facto, vigente.
- **Historia:** desciende de **Lex** (1975, Bell Labs, Unix; Mike Lesk y **Eric Schmidt** —el
  futuro CEO de Google—). Flex es la reescritura libre de **Vern Paxson** (~1987).
- **Vocabulario propio** (sirve para anclar el diseño): el archivo de reglas `.l`; `yytext` (el
  lexema), `yylex()` (la función generada); el flujo `regex → flex → lex.yy.c → tokens`.
- **Dato de impacto:** de **37 líneas** de reglas, Flex genera **1813 líneas** de C (el autómata
  como tablas). Y optimiza: comprime los **256 caracteres a 12 "clases de equivalencia"** (vio
  que "todos los dígitos son iguales").

---

## 6. La demo real en terminal (lo que la web debe espejar)

El ejemplo `lexer.l` reconoce un mini-lenguaje aritmético. Se ejecuta así:
```bash
flex lexer.l            # genera lex.yy.c
gcc lex.yy.c -o lexer   # compila
echo "a = 4 + 2" | ./lexer
```
Salida real (la web debe dar EXACTAMENTE esto con el mismo input):
```
IDENTIFICADOR(a)
ASIGNACION
NUMERO(4)
MAS
NUMERO(2)
```
Las reglas y sus tipos de token:

| Patrón (regex) | Token |
|---|---|
| `[0-9]+` | NUMERO |
| `[a-zA-Z_][a-zA-Z0-9_]*` | IDENTIFICADOR |
| `+ - * / = ( )` | MAS, MENOS, POR, DIV, ASIGNACION, PAR_IZQ, PAR_DER |
| `[ \t\n]+` | (espacios: se ignoran) |
| `.` | DESCONOCIDO |

> **Puente honesto que la demo debe dejar claro:** el analizador real lo genera **Flex en C**
> (se ve en la terminal); la web replica las **mismas reglas en JavaScript** solo para
> *visualizarlas* en vivo. Por eso arranca con el mismo input que la terminal: para mostrar que
> dan el mismo resultado.

---

## 7. Restricciones técnicas (condicionan la UI)

- **Un solo archivo `.html`**, vanilla JS + SVG, **sin servidor, sin internet, sin frameworks**.
  Abre con doble clic, corre offline, y se **embebe en Gamma por URL**.
- Se proyecta en un **aula** (debe leerse desde el fondo: jerarquía y tamaño importan).
- **Accesible:** usable con teclado; respetar "menos movimiento".
- **No** se dibuja el autómata real completo (~20 estados = ilegible); se usa **uno chico**
  hecho a mano.

---

## 8. Ideas de "mundo" para anclar el diseño (inspiración, no obligación)

El tema da para una identidad visual con carácter, lejos del dashboard genérico. Algunas vetas:
- **El rastreador / cabezal de escaneo:** "scanner" literal = algo que barre el texto de
  izquierda a derecha. Metáfora de **cabezal de lectura** / línea de montaje.
- **Radiografía / rayos X de la máquina:** "ver por dentro" el autómata encendiéndose.
- **Terminal Unix / cultura hacker de los 70** (Lex nació en Bell Labs): monoespaciado, CRT,
  fósforo.
- **Diagramas de autómatas / blueprint / circuito:** estados, flechas, transiciones.
- **Pipeline `texto → máquina → tokens`** como estructura espacial.

(Son disparadores. La propuesta visual es tuya, IA — elegí una dirección y defendela.)

---

## 9. Qué entregar (a la IA que lee esto)

Una **propuesta de UI** para la demo, que incluya:
1. **Concepto / dirección visual** (la "gran idea" estética, anclada en el tema).
2. **Paleta** (4–6 colores con hex y rol).
3. **Tipografía** (display + cuerpo + monoespaciada, con justificación).
4. **Layout** (cómo se organiza la pantalla; los 3 objetos son: entrada, proceso, salida).
5. **Elemento firma** (lo único que se recuerda).
6. **Microinteracciones / motion** (al servicio del "match más largo").
Distintiva, no genérica, coherente con el aula y con el mundo del tema. **No** copies una
estética preexistente: proponé una nueva.

---

## 10. (Opcional) Si querés MÁS profundidad teórica

Este pack ya tiene lo necesario. Si se quisiera el trasfondo teórico completo (jerarquía de
Chomsky, teorema de Myhill–Nerode, equivalencias con lógica MSO de Büchi y con el álgebra de
Schützenberger, lema de bombeo, problemas abiertos), existe material adicional, pero **es
sobreabundante para una propuesta de UI** y conviene no incluirlo para no diluir el foco.
