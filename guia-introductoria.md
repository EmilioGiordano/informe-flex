# Guía introductoria — Generadores de Analizadores Léxicos (TP2)

> Objetivo de esta guía: que entiendas el tema desde cero, veas qué podés hacer
> para el trabajo, y tengas criterio para elegir la herramienta. Sin código todavía.

---

## 1. ¿Qué es un analizador léxico? (el punto de partida)

Cuando un compilador recibe el código fuente, lo primero que hace es **leerlo carácter
por carácter y agruparlo en "palabras" con significado**, llamadas **tokens**.

Ejemplo. Esta línea de código:

```
a[index] = 4 + 2
```

el analizador léxico la convierte en esta secuencia de tokens:

| Texto    | Token            |
|----------|------------------|
| `a`      | identificador    |
| `[`      | corchete izq.    |
| `index`  | identificador    |
| `]`      | corchete der.    |
| `=`      | asignación       |
| `4`      | número           |
| `+`      | suma             |
| `2`      | número           |

Esto es **exactamente el ejemplo del PDF de tu cátedra** (Etapas de un compilador –
Análisis léxico). El analizador léxico (también llamado *scanner* o *rastreador*) descarta
espacios y comentarios, y entrega esta lista de tokens a la siguiente etapa (el analizador
sintáctico).

**Dos conceptos teóricos clave** (los vas a usar sí o sí en la presentación):

- **Expresiones regulares (ER):** sirven para *describir* cómo es cada token.
  - Un número entero: `[0-9]+` (uno o más dígitos)
  - Un identificador: `[a-zA-Z_][a-zA-Z0-9_]*` (letra, seguida de letras/dígitos)
- **Autómatas finitos (AF):** son la "máquina" que *reconoce* esos patrones leyendo el
  texto. Una expresión regular siempre se puede convertir en un autómata finito.

> En la jerarquía de Chomsky, esto corresponde a las **gramáticas de tipo 3** (regulares).

---

## 2. ¿Qué es un GENERADOR de analizadores léxicos? (el tema del TP)

Escribir un analizador léxico **a mano** es tedioso y propenso a errores: hay que programar
el autómata estado por estado. La idea genial (años 70, herramienta **Lex**) fue:

> **No programes el scanner. Describí los tokens con expresiones regulares, y dejá que una
> herramienta genere el código del scanner por vos.**

Eso es un **generador de analizadores léxicos**. El flujo es:

```
   Vos escribís                La herramienta produce
   ─────────────               ──────────────────────
   Especificación      ──►     Código fuente de un
   (expresiones                analizador léxico
    regulares +                (un autómata finito
    acciones)                   implementado en C/Java/…)
```

Tú solo declarás *qué* querés reconocer (las ER); la herramienta resuelve el *cómo*
(construye el autómata finito y lo traduce a código). Por eso a estas herramientas también
se las asocia con la idea de **"compilador de compiladores"** (te ayudan a construir un
compilador).

### Lo que pasa "por dentro" (esto es oro para la presentación)

Cuando la herramienta procesa tus expresiones regulares, internamente hace:

1. **ER → AFN** (autómata finito **no** determinista): algoritmo de **Thompson**.
2. **AFN → AFD** (autómata finito **determinista**): algoritmo de **construcción de
   subconjuntos** (subset construction).
3. **AFD → tabla de transiciones / código**: el scanner final.

Y al reconocer, aplica dos reglas estándar:

- **Maximal munch / "el match más largo":** elige el token más largo posible. Ante `index`,
  no para en `i`, sigue hasta `index`.
- **Prioridad de reglas:** si dos patrones coinciden, gana el que aparece primero (así
  `if` se reconoce como palabra clave y no como identificador).

Estos tres pasos + dos reglas son el "cómo trabaja la herramienta, paso a paso" que pide
la consigna (punto 3).

---

## 3. Cómo se ve una especificación (estructura común a casi todas las herramientas)

Casi todos los generadores (Lex, Flex, JFlex, PLY…) usan un archivo con **tres secciones**
separadas por `%%`:

```
   DEFINICIONES        (atajos para expresiones regulares, p. ej. DIGITO  [0-9])
%%
   REGLAS              (patrón  →  acción:  qué token devolver cuando matchea)
%%
   CÓDIGO DE USUARIO   (funciones auxiliares, main, etc.)
```

La parte central —las **REGLAS**— es lo importante: cada regla es

```
   <expresión regular>      { acción: normalmente, devolver un token }
```

Por ejemplo (pseudo): `[0-9]+   { return NUMERO; }`

---

## 4. Panorama de herramientas (para el punto "comparación" de la consigna)

| Herramienta | Lenguaje que genera | Notas |
|---|---|---|
| **Lex**   | C | El original (1975, Unix). Hoy casi siempre se usa su versión libre, Flex. Valor histórico/teórico. |
| **Flex**  | C | "Fast Lex". El estándar de facto en C. Máxima cercanía con el PDF de la cátedra. |
| **JFlex** | Java | Equivalente moderno en Java, muy buena documentación. Se combina con CUP (parser). |
| **PLY**   | Python | "Python Lex-Yacc". Código muy legible, se ejecuta sin compilar. Ideal para demos claras. |
| **re2c**  | C/C++ | Genera scanners muy rápidos embebidos en el código. Más nicho. |
| **ANTLR** | Multi (Java, C#, Python, JS…) | Muy potente y usado en industria, pero hace **léxico + sintáctico** juntos: puede desenfocar el tema "analizador léxico". |

La comparación típica se hace por criterios: lenguaje destino, facilidad de uso, velocidad
del scanner generado, soporte/documentación, integración con un parser, vigencia.

---

## 5. ¿Qué podemos hacer para el Trabajo de Investigación? (alcances posibles)

La consigna pide una **presentación** (no un compilador completo). Tenés tres niveles de
ambición; cualquiera cumple, elegí según tiempo/ganas:

**Nivel A — Presentación teórica sólida (mínimo que cumple la consigna)**
- Elegir UNA herramienta (recomiendo Flex o JFlex).
- Cubrir los 5 puntos: nombre, descripción, cómo trabaja, comparación, bibliografía.
- Incluir los slides teóricos: ER, autómatas, el flujo ER→AFN→AFD→código.
- Mostrar una especificación de ejemplo **explicada**, aunque no la ejecuten en vivo.

**Nivel B — Presentación + demo en vivo (recomendado, impacta más)**
- Todo lo de A, **más** un ejemplo chiquito real que se ejecute durante la exposición:
  un mini-lenguaje (números, identificadores, `+ - * / ( ) =`) que tome una línea de
  entrada y imprima la lista de tokens. Es poco código y se ve muy bien.

**Nivel C — Demo + comparación práctica**
- Lo de B, pero implementando el **mismo** mini-lexer en **dos** herramientas (p. ej.
  Flex y PLY) para mostrar diferencias reales en la comparación. Más trabajo, más nota.

> Mi sugerencia: apuntar al **Nivel B**. Es el mejor balance esfuerzo/impacto para una
> exposición, y la demo "texto → tokens" hace tangible toda la teoría.

---

## 6. Recomendación de herramienta

Para **este** TP, con este **marco teórico**, las dos mejores opciones son:

- **Flex (C)** si quieren la máxima coherencia con lo que cuenta la cátedra (Lex → Flex,
  el ejemplo histórico del PDF). Contra: hay que compilar C.
- **PLY (Python)** o **JFlex (Java)** si priorizan que la **demo sea fácil de correr** y el
  código se lea claro durante la exposición. PLY no requiere compilar nada.

La decisión fina depende de con qué lenguaje está más cómodo tu grupo. Cuando lo definas,
armamos el esqueleto de diapositivas y el ejemplo paso a paso.

---

## 7. Próximos pasos

1. Leer esta guía y quedarte con la idea central: *ER → la herramienta genera el autómata
   → tokens*.
2. Definir lenguaje/herramienta (Flex, JFlex o PLY) y nivel de alcance (A/B/C).
3. Pedirme: (a) esqueleto de la presentación, (b) ejemplo paso a paso, (c) tabla
   comparativa, (d) bibliografía. Los armo en español, listos para la exposición.
