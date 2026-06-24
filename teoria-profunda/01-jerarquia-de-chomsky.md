# 01 — La jerarquía de Chomsky: dónde vive lo regular

> Objetivo: ubicar el análisis léxico dentro del mapa completo de los lenguajes formales.
> Es el "marco" que tu cátedra menciona (gramáticas tipo 0–3) pero acá desarrollado.

---

## 1. Qué es un "lenguaje formal"

En esta teoría, las palabras tienen un significado preciso:

- **Alfabeto (Σ):** un conjunto finito de símbolos. Ej. `Σ = {a, b}` o el conjunto ASCII.
- **Cadena (o palabra):** una secuencia finita de símbolos. Ej. `abba`. La cadena vacía se
  nota **ε**.
- **Σ\*** : el conjunto de **todas** las cadenas posibles sobre Σ (infinito).
- **Lenguaje (L):** un subconjunto de Σ\*. O sea, **un lenguaje es simplemente un conjunto de
  cadenas**. Ej. "todas las cadenas con un número par de `a`".

Toda la teoría gira en torno a una pregunta: *¿qué lenguajes puede reconocer/generar una
máquina, y con qué poder?*

---

## 2. Dos formas de describir un lenguaje: generar vs. reconocer

Hay una dualidad que recorre todo el tema:

- **Gramática (generador):** un conjunto de reglas que *produce* las cadenas del lenguaje.
- **Autómata (reconocedor):** una máquina que, dada una cadena, responde *sí/no* según
  pertenezca al lenguaje.

Para cada nivel de la jerarquía, gramática y autómata tienen **exactamente el mismo poder**:
lo que una clase de gramática genera, una clase de máquina lo reconoce. Esta correspondencia
es uno de los resultados centrales.

---

## 3. La jerarquía de Chomsky (1956)

Noam Chomsky clasificó las gramáticas según **cuán restringidas** son sus reglas de
producción. Resultan **cuatro niveles anidados**, de menor a mayor poder:

```
   ┌───────────────────────────────────────────────────────┐
   │ Tipo 0 — Recursivamente enumerables                    │
   │  (Máquina de Turing)                                   │
   │   ┌─────────────────────────────────────────────────┐ │
   │   │ Tipo 1 — Dependientes del contexto              │ │
   │   │  (Autómata linealmente acotado)                 │ │
   │   │   ┌───────────────────────────────────────────┐ │ │
   │   │   │ Tipo 2 — Independientes del contexto      │ │ │
   │   │   │  (Autómata de pila)                       │ │ │
   │   │   │   ┌─────────────────────────────────────┐ │ │ │
   │   │   │   │ Tipo 3 — REGULARES                  │ │ │ │
   │   │   │   │  (Autómata finito)  ← EL LEXER      │ │ │ │
   │   │   │   └─────────────────────────────────────┘ │ │ │
   │   │   └───────────────────────────────────────────┘ │ │
   │   └─────────────────────────────────────────────────┘ │
   └───────────────────────────────────────────────────────┘
```
> Imagen lista para usar: `File:Chomsky-hierarchy.svg` (ver doc 00).

La inclusión es **estricta**: cada nivel puede hacer todo lo del nivel interior y *algo más*.

| Tipo | Nombre | Máquina reconocedora | Memoria de la máquina | Ejemplo de lenguaje |
|:---:|---|---|---|---|
| 3 | **Regular** | Autómata finito | **Ninguna** (solo estados finitos) | `a*b*` ; identificadores; números |
| 2 | Libre de contexto | Autómata de pila | Una pila | `aⁿbⁿ` (paréntesis balanceados) |
| 1 | Dependiente del contexto | Autómata lin. acotado | Cinta acotada | `aⁿbⁿcⁿ` |
| 0 | Recursivamente enumerable | Máquina de Turing | Cinta infinita | cualquier cosa computable |

---

## 4. El nivel que nos importa: Tipo 3 (regular)

Una **gramática regular** tiene reglas de forma muy restringida (lineales por la derecha):

```
   A → aB        (un terminal seguido de a lo sumo un no-terminal)
   A → a
   A → ε
```

Su máquina es el **autómata finito**: una máquina con un número **finito** de estados y
**sin memoria auxiliar**. Solo "recuerda" en cuál de sus pocos estados está. Lee la cadena de
izquierda a derecha, un símbolo a la vez, y al final acepta o rechaza.

**La consecuencia profunda de no tener memoria:** un autómata finito **no puede contar sin
límite**. Puede chequear "¿la cantidad de `a` es par?" (le alcanzan 2 estados), pero **no**
"¿hay tantas `a` como `b`?" (necesitaría memoria ilimitada para contar). Por eso `aⁿbⁿ` —los
paréntesis balanceados— **no es regular**, y por eso un analizador léxico no puede, por sí
solo, verificar que los paréntesis de un programa estén balanceados: eso es trabajo del
**analizador sintáctico** (tipo 2). (La demostración formal de esto es el *lema de bombeo*,
doc 04.)

> **Esta es la razón teórica de la división léxico / sintáctico en un compilador.** No es una
> decisión arbitraria de ingeniería: es que el reconocimiento de tokens es un problema de
> tipo 3, y el de estructuras anidadas es de tipo 2. Cada uno usa la máquina mínima que su
> problema requiere.

---

## 5. Por qué empezar por lo regular

Aunque sea el nivel más simple, lo regular es donde la teoría es **más completa y redonda**:

- Tiene **algoritmos eficientes** para todo (reconocer, minimizar, comparar lenguajes).
- Casi todas las preguntas son **decidibles** (se pueden responder con un algoritmo). En
  niveles superiores, muchas se vuelven indecidibles.
- Admite las **cuatro caracterizaciones equivalentes** (máquinas, expresiones, lógica,
  álgebra) que veremos en los próximos documentos.

Esa "completitud" es lo que lo hace tan buen objeto de estudio, y lo que permite que
herramientas como Flex sean **totalmente automáticas y confiables**: todo lo que necesitan
hacer es decidible y eficiente.

---

## Fuentes
- *Chomsky hierarchy* — Wikipedia: https://en.wikipedia.org/wiki/Chomsky_hierarchy
- Hopcroft, Motwani, Ullman — *Introduction to Automata Theory, Languages, and Computation*
  (referencia estándar para todo este documento).
- Sipser — *Introduction to the Theory of Computation* (cap. 1–2).
- Material de cátedra: `4_Introducción_a_Compiladores.pdf`.
