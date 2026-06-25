<!--
MAQUETADO DE LA PRESENTACIÓN — TP2: Generadores de Analizadores Léxicos (Flex)
Convención: cada `#` (H1) = una diapositiva.
  · El texto bajo el título = lo que va EN la pantalla (mantener conciso).
  · "🎤 Para decir" = narrativa del orador (NO va en la slide; es lo que explicás hablando).
  · "🖼️ Visual" = qué diagrama/imagen usar.
  · "⏱️" = presupuesto de tiempo orientativo.
Para convertir a slides: sirve tal cual en Marp (cada H1 abre diapo) o se copia a PowerPoint/Slides.

PRESUPUESTO TOTAL: ~17-18 min de exposición + preguntas.
  Bloque A (contexto/teoría) ......... ~5 min
  Bloque B (Flex + DEMO) ............. ~9 min   (la demo ~3-4 min)
  Bloque C (comparación/cierre) ...... ~4 min
Las slides marcadas [OPCIONAL] se saltean si el tiempo apremia.
-->

# Generadores de Analizadores Léxicos — Flex

**Trabajo de Investigación N°2 · Teoría de los Lenguajes de Programación**

Integrantes: _(completar)_
Fecha: 26/06/2026

🎤 Para decir: "Hoy presentamos una herramienta que automatiza la primera etapa de un compilador: el analizador léxico. La herramienta es Flex, pero antes de llegar a ella vamos a entender qué problema resuelve y por qué."

🖼️ Visual: portada limpia; opcional, captura de la terminal con tokens saliendo.
⏱️ 30 s

---

# Hoja de ruta

1. **El problema:** del texto a los tokens
2. **La teoría:** expresiones regulares y autómatas
3. **La idea:** generar el analizador en vez de programarlo
4. **Flex:** qué es, historia, cómo trabaja
5. **Demo en vivo** ⭐
6. **Comparación, ventajas y cierre**

🎤 Para decir: "El recorrido va de un problema concreto a la herramienta, pasando por la teoría justa. El centro de la charla es la demo: van a ver a Flex generando un analizador y partiendo texto en tokens, en vivo."

⏱️ 30 s

---

# ¿Dónde encaja esto? Las etapas de un compilador

`código fuente → [Análisis Léxico] → Sintáctico → Semántico → … → código objeto`

- El **análisis léxico** es la **primera etapa**.
- Es la que **más se ejecuta** (toca cada carácter) → la velocidad importa.
- Todas las etapas dialogan con la **tabla de símbolos** y el **manejo de errores**.

🎤 Para decir: "Un compilador traduce de un lenguaje a otro en varias etapas. La primera, la que nos ocupa, es el análisis léxico: toma el código fuente como una tira de caracteres y lo prepara para las etapas siguientes. Es la que más trabaja, porque recorre cada carácter del programa, así que conviene que sea rápida."

🖼️ Visual: diagrama de etapas del PDF de cátedra (`4_Introducción_a_Compiladores.pdf`), con la etapa léxica resaltada. (También en la guía web, U1.)
⏱️ 1 min

---

# ¿Qué es el análisis léxico?

Convierte un **flujo de caracteres** en una secuencia de **tokens**.

```
a [ index ] = 4 + 2
```
→ `IDENT(a)` `[` `IDENT(index)` `]` `=` `NUM(4)` `+` `NUM(2)`

| Término | Qué es | Ejemplo |
|---|---|---|
| **Token** | la categoría | `NUM` |
| **Lexema** | el texto concreto | `4` |
| **Patrón** | la regla (regex) | `[0-9]+` |

🎤 Para decir: "El analizador léxico agrupa los caracteres en piezas con significado —los tokens— y descarta espacios y comentarios. Tres palabras que conviene separar: el token es el tipo, el lexema es el texto que lo formó, y el patrón es la regla que lo describe. Este ejemplo, a corchete index, es el mismo que está en las diapositivas de la cátedra."

🖼️ Visual: el ejemplo `a[index]=4+2` con flechas a sus tokens (PDF de cátedra / guía web U1).
⏱️ 1 min

---

# Conceptos teóricos mínimos

Para describir y reconocer tokens alcanza con dos ideas:

- **Expresiones regulares** → *describen* los tokens.
  - número: `[0-9]+` · identificador: `[a-zA-Z_][a-zA-Z0-9_]*`
- **Autómatas finitos** → *reconocen* esos patrones (máquina sin memoria: solo "en qué estado estoy").

> **Teorema de Kleene:** expresión regular ≡ autómata finito (son la misma cosa).

🎤 Para decir: "No hace falta más teoría que esta. Las expresiones regulares son la notación para decir qué forma tiene cada token. Los autómatas finitos son la máquina que los reconoce, leyendo carácter por carácter, recordando solo en qué estado está. Y un resultado clásico —el teorema de Kleene— dice que las dos cosas son equivalentes: lo que se describe con una regex se puede reconocer con un autómata. Esa equivalencia es lo que hace posible todo lo que sigue."

🖼️ Visual: el autómata del identificador (SVG de la guía web U2) + la equivalencia ER ≡ AFD.
⏱️ 1 min 30 s

---

# El problema: hacerlo a mano es tedioso

Programar el autómata a mano implica, para **cada lenguaje**:

- codificar estado por estado la función de transición
- el **"match más largo"** con retroceso (que `index` sea un token, no `i`+`ndex`)
- **prioridad** entre patrones (que `if` sea palabra clave, no identificador)
- espacios, comentarios, conteo de líneas, recuperación de errores…

> Es **siempre el mismo procedimiento mecánico** → se puede automatizar.

🎤 Para decir: "Reconocer tokens es ejecutar un autómata, y nada impide programarlo a mano. Pero miren todo lo que hay que resolver: el match más largo con su retroceso, la prioridad entre reglas, los espacios, los comentarios, los errores… Y rehacerlo para cada lenguaje. Es repetitivo y fácil de equivocar. La observación clave es que ese trabajo es siempre el mismo procedimiento mecánico. Y lo mecánico se automatiza."

⏱️ 45 s

---

# La idea: describir, no programar

**No programes el scanner. Describí los tokens con expresiones regulares y dejá que una herramienta genere el código por vos.**

```
especificación (regex)  →  [ GENERADOR ]  →  analizador léxico (autómata en C)
```

- Vos decís el **qué**; la herramienta resuelve el **cómo**.
- A esta clase de herramientas se las llama **"compilador de compiladores"**.

🎤 Para decir: "El cambio de mentalidad es este: en vez de escribir el código del analizador, escribimos solo las reglas, y la herramienta construye el autómata y emite el código. Esa herramienta es un generador de analizadores léxicos. La nuestra se llama Flex."

🖼️ Visual: diagrama entrada→generador→salida (SVG de la guía web U3).
⏱️ 45 s

---

# Flex — nombre e historia

- **Lex (1975):** primer generador léxico, en Bell Labs (Unix), por **Mike Lesk** y **Eric Schmidt**. Par de **Yacc**.
- **Flex (~1987):** reescritura **libre** y más rápida en C, por **Vern Paxson** (Berkeley).
- *Fast Lexical analyzer generator* = "generador rápido de analizadores léxicos".

> Dato: el **Eric Schmidt** que co-creó Lex fue después **CEO de Google** (2001–2011).

🎤 Para decir: "Flex tiene genealogía. El original es Lex, de 1975, hecho en los laboratorios donde nació Unix, por Mike Lesk y Eric Schmidt —sí, el mismo Eric Schmidt que después fue CEO de Google—. Lex era propietario, así que en los 80 Vern Paxson, que más tarde sería una figura de la ciberseguridad, escribió una versión libre y más rápida en C: Flex. El nombre significa 'generador rápido de analizadores léxicos'."

🖼️ Visual: mini línea de tiempo (1975 Lex → 1987 Flex). Opcional: foto de Eric Schmidt (Wikimedia, link en `teoria-profunda/00`).
⏱️ 1 min

---

# ¿Qué es Flex? — descripción

- Programa que **genera analizadores léxicos** en **C / C++**.
- El analizador generado es, por dentro, un **autómata finito determinista (AFD)**.
- **Libre** (licencia BSD), **estándar de facto**, vigente (última versión 2.6.4).
- Se combina con **Bison** (analizador sintáctico) para el front-end completo del compilador.

🎤 Para decir: "En concreto: Flex toma tus expresiones regulares y genera código C que implementa un autómata finito determinista que reconoce los tokens. Es software libre, es el estándar de facto en C desde hace décadas, y suele usarse junto a Bison, su socio sintáctico. Que su última versión sea de 2017 no es abandono: es madurez, está terminado."

⏱️ 45 s

---

# Cómo trabaja Flex — el pipeline

```
reglas (regex)
   │  construcción de Thompson
   ▼
  AFN  ──subconjuntos──►  AFD  ──minimización──►  AFD mínimo  ──►  código C (tablas)
```

- Es **la teoría del compilador automatizada**: tres algoritmos clásicos…
- …que Flex corre **solo**. Vos solo escribís las reglas.

🎤 Para decir: "Por dentro, Flex hace la cadena teórica completa: convierte tus expresiones regulares en un autómata no determinista con el algoritmo de Thompson, lo vuelve determinista con la construcción de subconjuntos —que es de Rabin y Scott, premio Turing—, lo minimiza, y lo emite como tablas en C. Vos no ves nada de esto: solo escribís las reglas. Ese es todo el valor de la herramienta: te regala 60 años de teoría hecha programa."

🖼️ Visual: el flujo RE→AFN→AFD→código (SVG de la guía web U2/U4).
⏱️ 1 min

---

# Anatomía de un archivo `.l`

Tres secciones separadas por `%%`:

```
   DEFINICIONES        atajos de regex (DIGITO  [0-9])
%%
   REGLAS              patrón  →  acción (qué token devolver)
%%
   CÓDIGO DE USUARIO   main, funciones auxiliares
```

La sección del medio (**reglas**) es el corazón: `<expresión regular> { acción }`.

🎤 Para decir: "Una especificación de Flex tiene siempre tres partes separadas por doble porcentaje: las definiciones, que son atajos; las reglas, que es lo importante; y el código de usuario. Cada regla es una expresión regular con una acción entre llaves: cuando el patrón matchea, se ejecuta la acción, que normalmente devuelve o imprime un token."

⏱️ 45 s

---

# Ejemplo: nuestro `lexer.l`

```lex
DIGITO   [0-9]
LETRA    [a-zA-Z_]
%%
{DIGITO}+                      { printf("NUMERO(%s)\n", yytext); }
{LETRA}({LETRA}|{DIGITO})*     { printf("IDENTIFICADOR(%s)\n", yytext); }
"+"                            { printf("MAS\n"); }
"="                            { printf("ASIGNACION\n"); }
[ \t\n]+                       { /* espacios: ignorar */ }
.                              { printf("DESCONOCIDO(%s)\n", yytext); }
%%
int main(void){ yylex(); return 0; }
```

🎤 Para decir: "Este es un ejemplo real y completo que reconoce un mini-lenguaje aritmético. Fíjense lo corto que es: una regla por tipo de token. `yytext` es el lexema, el texto reconocido. `yylex` es la función que Flex va a generar por nosotros. La regla del punto, al final, atrapa cualquier carácter inesperado."

🖼️ Visual: el código con sintaxis resaltada (completo en la guía web U4).
⏱️ 1 min

---

# 🎬 DEMO EN VIVO — 3 comandos

```bash
flex lexer.l            # genera lex.yy.c (el analizador en C)
gcc lex.yy.c -o lexer   # lo compila
echo "a = 4 + 2" | ./lexer
```

Salida:
`IDENTIFICADOR(a)` `ASIGNACION` `NUMERO(4)` `MAS` `NUMERO(2)`

🎤 Para decir: "Y acá lo hacemos en vivo. Tres comandos: flex genera el código C, gcc lo compila, y le pasamos una línea de texto. (Ejecutar.) Ahí está: convirtió 'a = 4 + 2' en su lista de tokens, los mismos del ejemplo del principio. Y ahora probamos con lo que ustedes quieran." → *(pedir una expresión a la clase y ejecutarla)*.

🖼️ Visual: **terminal en vivo** (ver guion completo en el anexo). Tener el video de respaldo abierto en otra pestaña.
⏱️ 2 min

---

# El "wow": 37 líneas → 1813

| Archivo | Qué es | Líneas |
|---|---|---|
| `lexer.l` | lo que **escribimos** | **37** |
| `lex.yy.c` | lo que **Flex generó** | **1813** |

- Esas 1813 líneas son el **autómata finito** como tablas en C.
- Flex incluso **optimiza**: vio que "todos los dígitos son iguales" y comprimió **256 caracteres → 12 clases de equivalencia**.

🎤 Para decir: "Este es el momento clave de toda la charla. Escribimos 37 líneas de reglas y Flex generó 1813 líneas de C: el autómata completo, que a mano sería larguísimo. (En vivo se puede mostrar con `wc -l lexer.l lex.yy.c`.) Y no solo lo genera: lo optimiza. Se da cuenta de que todos los dígitos se comportan igual y comprime los 256 caracteres posibles a 12 clases. Esa inteligencia viene gratis con la herramienta."

🖼️ Visual: la tabla 37 vs 1813; opcional, un fragmento real de las tablas `yy_nxt`/`yy_accept`.
⏱️ 1 min

---

# Comparación con otras herramientas

| Herramienta | Genera | Modelo interno | Vigencia | Nota |
|---|---|---|---|---|
| **Lex** | C | AFD (tablas) | histórico | el original (1975), propietario |
| **Flex** | C/C++ | AFD (tablas) | **activo** | libre, rápido, **estándar de facto** |
| **JFlex** | Java | AFD (tablas) | activo | "Flex para Java" (+ CUP) |
| **PLY** | Python | AFD (en runtime) | activo | muy legible, sin compilar |
| **re2c** | C/C++ | AFD (**código directo**) | activo | scanners aún más rápidos |
| **ANTLR** | multi | **adaptativo ALL(*)** | muy activo | léxico **+** sintáctico juntos |

🎤 Para decir: "Flex no está solo. Lex, JFlex y Flex usan exactamente el mismo modelo, el AFD por tablas, por eso Flex es el que mejor ilustra la teoría que vimos. PLY lo lleva a Python sin compilar; re2c genera código directo en vez de tablas y es todavía más rápido; y ANTLR juega en otra liga, porque combina léxico y sintáctico con un algoritmo más potente, pero se aleja del modelo limpio. Que existan para tantos lenguajes prueba que la base teórica es universal."

⏱️ 1 min 15 s

---

# Cómo se comparan (los criterios) [OPCIONAL]

Para elegir un generador léxico se miran:

- **Lenguaje destino** (C, Java, Python…) → ¿en qué vas a programar?
- **Modelo interno** → tablas (Flex) vs. código directo (re2c) vs. runtime (PLY)
- **Velocidad** del scanner generado
- **Integración con un parser** (Flex↔Bison, JFlex↔CUP, ANTLR todo-en-uno)
- **Madurez, documentación y licencia**

> Para este tema, **Flex gana en fidelidad con la teoría** (AFD clásico) y en vigencia.

🎤 Para decir: "Si tuvieran que elegir una, mirarían estos criterios: en qué lenguaje generan, qué modelo usan por dentro, qué tan rápidas son, si se integran con un analizador sintáctico, y qué tan maduras y documentadas están. Para nuestro objetivo —ilustrar la teoría— Flex es la mejor: es el AFD clásico, es libre y sigue plenamente vigente."

⏱️ 45 s (saltear si vamos cortos)

---

# Ventajas, desventajas y cuándo usarlo

**A favor:** rápido de escribir · scanner veloz · maduro y confiable · ideal para prototipos y lenguajes de dominio específico.

**En contra:** genera C (sin Unicode nativo) · no reentrante por defecto.

> Curiosidad madura: compiladores como **GCC** escriben su lexer **a mano** (rendimiento y mejor manejo de errores). El generador es excelente, pero no dogma.

🎤 Para decir: "Como toda herramienta, tiene su lugar. Flex es ideal cuando querés un analizador correcto y rápido sin esfuerzo: prototipos, lenguajes propios, la docencia. Sus límites: genera C y no maneja Unicode de fábrica. Y un dato interesante para cerrar con criterio: varios compiladores de producción, como GCC, terminan escribiendo el lexer a mano por rendimiento y mejor manejo de errores. La teoría te dice qué es posible; la ingeniería, qué conviene."

⏱️ 1 min

---

# Conclusión

- El **análisis léxico** es la primera etapa del compilador: texto → tokens.
- Se apoya en **expresiones regulares + autómatas finitos** (lenguajes regulares).
- Un **generador** automatiza esa construcción: vos describís, él genera.
- **Flex** es el representante clásico: 50 años de vigencia, y **lo vimos funcionar**.

🎤 Para decir: "Para cerrar: vimos el problema, la teoría que lo resuelve, la idea de automatizarla y la herramienta que la encarna. Un problema cotidiano —partir texto en palabras— que es la cara visible de una teoría profunda y elegante, hecha herramienta hace medio siglo y todavía vigente. Y lo más importante: la vimos andar en vivo."

⏱️ 45 s

---

# Bibliografía

- **Manual oficial de Flex** — westes.github.io/flex/manual
- **Lesk & Schmidt**, *Lex — A Lexical Analyzer Generator* (Bell Labs, 1975).
- **Aho, Lam, Sethi, Ullman**, *Compilers: Principles, Techniques, and Tools* ("Libro del Dragón"), cap. 3.
- **Hopcroft, Motwani, Ullman**, *Introduction to Automata Theory, Languages, and Computation*.
- **Material de cátedra:** `4_Introducción_a_Compiladores.pdf`.

🎤 Para decir: "Las fuentes: el manual oficial de Flex, el paper original de Lex del 75, el clásico Libro del Dragón para la teoría, y el material de la cátedra. ¿Preguntas?"

⏱️ 15 s

---

<!-- ============================================================= -->
<!--   ANEXO (no son diapositivas) — material de apoyo del orador  -->
<!-- ============================================================= -->

# 🎬 ANEXO · La demo: decisión y guion

## Decisión: TERMINAL como demo principal ✅

Para una exposición de clase, la **demo en terminal** es la mejor opción:
- **A prueba de fallos:** no depende de wifi ni de un servidor corriendo.
- **Auténtica:** muestra el verdadero acto de *generación* (`flex` creando `lex.yy.c`), que es justo el corazón del tema.
- **Ya funciona:** está probada en este proyecto (`ejemplos/lexer.l`).

> El **"Flex Playground" web** queda como mejora opcional (más vistoso, pero necesita un backend local y agrega riesgo). Si lo querés, se construye aparte — decímelo y lo armo. No es necesario para una gran demo.

## Guion paso a paso (qué tipear + qué decir)

1. **"Estas son nuestras reglas."** → `cat lexer.l`  (mostrar lo corto que es)
2. **"Flex genera el analizador."** → `flex lexer.l`  → "creó `lex.yy.c`"
3. **"¿Cuánto generó a partir de eso?"** → `wc -l lexer.l lex.yy.c`  → **37 vs 1813** (momento wow)
4. **"Lo compilamos."** → `gcc lex.yy.c -o lexer`
5. **"Y lo probamos."** → `echo "a = 4 + 2" | ./lexer`
6. **"Prueben ustedes."** → pedir una expresión a la clase → `echo "<lo que digan>" | ./lexer`

## Preparación (antes de exponer)
- `flex` y `gcc` instalados (WSL/Linux: `sudo apt install flex gcc`).
- Estar parado en `ejemplos/` con `lexer.l` presente.
- Terminal con **fuente grande** (legible desde el fondo).
- **Plan B obligatorio:** video/capturas de la demo, abiertos en otra pestaña.

---

# 🎬 ANEXO · Checklist de cierre

- [ ] Completar **integrantes** en la portada.
- [ ] Repartir **quién expone** cada bloque (A / B / C).
- [ ] Grabar el **backup** de la demo (video corto o capturas).
- [ ] Pasar este maquetado a **slides** (Marp / PowerPoint / Google Slides).
- [ ] **Ensayar** una vez con cronómetro (objetivo 15–20 min).
- [ ] Llevar la demo en una **notebook propia**, probada en el lugar si se puede.
- [ ] Tener a mano la **guía web** (`guia-generadores-lexicos/`) como respaldo visual.

---

# 🎬 ANEXO · Diapositivas opcionales (si sobra tiempo o en preguntas)

**Flex por dentro:** las tablas `yy_nxt`, `yy_accept`, `yy_ec`; las clases de equivalencia decodificadas (256 → 12).

**Condiciones de arranque:** "modos" del scanner para, p. ej., ignorar comentarios `/* … */`. Ejemplo potente y vistoso (está en la guía web U5).

**Flex + Bison:** `yyparse()` llama a `yylex()`; el valor del token viaja por `yylval`. El front-end completo del compilador.

**La teoría a fondo:** lo regular se describe desde 5 mundos (máquinas, regex, gramáticas, lógica MSO, álgebra). Material en `teoria-profunda/`.
