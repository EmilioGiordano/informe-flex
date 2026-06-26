<!--
VERSIÓN LISTA PARA PEGAR EN GAMMA (u otro generador de slides).
Solo contenido de pantalla: títulos + bullets/tablas/código. SIN notas de orador.
Cada "#" (H1) = una diapositiva. Las notas del orador y el guion de demo están en presentacion.md.
-->

# Generadores de Analizadores Léxicos — Flex

Trabajo de Investigación N°2 · Teoría de los Lenguajes de Programación

Integrantes: _(completar)_ · 26/06/2026

---

# Hoja de ruta

1. El problema: del texto a los tokens
2. La teoría: expresiones regulares y autómatas
3. La idea: generar el analizador
4. Flex: qué es, historia, cómo trabaja
5. Demo en vivo
6. Comparación y cierre

---

# ¿Dónde encaja? Las etapas de un compilador

código fuente → **Análisis Léxico** → Sintáctico → Semántico → … → código objeto

- El análisis léxico es la **primera etapa**.
- Es la que **más se ejecuta** (toca cada carácter) → la velocidad importa.
- Todas dialogan con la **tabla de símbolos** y el **manejo de errores**.

---

# ¿Qué es el análisis léxico?

Convierte un **flujo de caracteres** en una secuencia de **tokens**.

`a [ index ] = 4 + 2` → `IDENT(a)` `[` `IDENT(index)` `]` `=` `NUM(4)` `+` `NUM(2)`

| Término | Qué es | Ejemplo |
|---|---|---|
| Token | la categoría | `NUM` |
| Lexema | el texto concreto | `4` |
| Patrón | la regla (regex) | `[0-9]+` |

---

# Conceptos teóricos mínimos

- **Expresiones regulares** → *describen* los tokens
  - número `[0-9]+` · identificador `[a-zA-Z_][a-zA-Z0-9_]*`
- **Autómatas finitos** → *reconocen* esos patrones (máquina sin memoria)

**Teorema de Kleene:** expresión regular ≡ autómata finito.

---

# El problema: hacerlo a mano es tedioso

Para **cada lenguaje** habría que programar:

- la transición estado por estado
- el **match más largo** con retroceso
- la **prioridad** entre patrones
- espacios, comentarios, errores…

Es siempre el mismo procedimiento mecánico → **se puede automatizar**.

---

# La idea: describir, no programar

**Describí los tokens con expresiones regulares y dejá que una herramienta genere el código.**

especificación (regex) → **GENERADOR** → analizador léxico (autómata en C)

Vos decís el **qué**; la herramienta resuelve el **cómo**.

---

# Flex — nombre e historia

- **Lex (1975):** primer generador léxico, Bell Labs (Unix). Mike Lesk y Eric Schmidt. Par de Yacc.
- **Flex (~1987):** reescritura libre y más rápida en C, por Vern Paxson.
- *Fast Lexical analyzer generator.*

Dato: el **Eric Schmidt** de Lex fue después **CEO de Google**.

---

# ¿Qué es Flex?

- Genera analizadores léxicos en **C / C++**.
- El analizador es, por dentro, un **autómata finito determinista**.
- **Libre** (BSD), **estándar de facto**, vigente.
- Se combina con **Bison** (parser) para el front-end completo.

---

# Cómo trabaja Flex — el pipeline

reglas (regex) → **Thompson** → AFN → **subconjuntos** → AFD → **minimización** → tablas en C

Es la teoría del compilador **automatizada**: tres algoritmos clásicos que Flex corre solo.

---

# Anatomía de un archivo `.l`

```
   DEFINICIONES        atajos (DIGITO  [0-9])
%%
   REGLAS              patrón → acción
%%
   CÓDIGO DE USUARIO   main, etc.
```

El corazón son las **reglas**: `<expresión regular> { acción }`.

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
[ \t\n]+                       { /* ignorar */ }
.                              { printf("DESCONOCIDO(%s)\n", yytext); }
%%
int main(void){ yylex(); return 0; }
```

---

# 🎬 Demo en vivo — 3 comandos

```bash
flex lexer.l            # genera lex.yy.c
gcc lex.yy.c -o lexer   # compila
echo "a = 4 + 2" | ./lexer
```

→ `IDENTIFICADOR(a)` `ASIGNACION` `NUMERO(4)` `MAS` `NUMERO(2)`

*(Y probamos con lo que proponga la clase.)*

---

# El "wow": 37 líneas → 1813

| Archivo | Qué es | Líneas |
|---|---|---|
| `lexer.l` | lo que escribimos | **37** |
| `lex.yy.c` | lo que Flex generó | **1813** |

- Son el **autómata finito** como tablas en C.
- Flex **optimiza**: 256 caracteres → **12 clases de equivalencia**.

---

# Comparación con otras herramientas

| Herramienta | Genera | Modelo interno | Nota |
|---|---|---|---|
| Lex | C | AFD (tablas) | el original (1975) |
| **Flex** | C/C++ | AFD (tablas) | libre, rápido, **estándar** |
| JFlex | Java | AFD (tablas) | "Flex para Java" |
| PLY | Python | AFD (runtime) | sin compilar |
| re2c | C/C++ | AFD (código directo) | aún más rápido |
| ANTLR | multi | adaptativo ALL(*) | léxico + sintáctico |

---

# Ventajas, desventajas y cuándo usarlo

**A favor:** rápido de escribir · veloz · maduro · ideal para prototipos y DSLs.

**En contra:** genera C (sin Unicode nativo) · no reentrante por defecto.

Dato: GCC escribe su lexer **a mano** (rendimiento y errores). El generador es excelente, pero no dogma.

---

# Conclusión

- El análisis léxico es la primera etapa: **texto → tokens**.
- Se apoya en **expresiones regulares + autómatas finitos**.
- Un **generador** automatiza esa construcción.
- **Flex**: 50 años de vigencia, y **lo vimos funcionar**.

---

# Bibliografía

- Manual oficial de Flex — westes.github.io/flex/manual
- Lesk & Schmidt, *Lex — A Lexical Analyzer Generator* (Bell Labs, 1975)
- Aho, Lam, Sethi, Ullman, *Compilers* ("Libro del Dragón"), cap. 3
- Hopcroft, Motwani, Ullman, *Introduction to Automata Theory*
- Material de cátedra: *4_Introducción_a_Compiladores.pdf*
