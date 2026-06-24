# 02 — Lenguajes regulares: las tres caras y sus construcciones

> El corazón del tema. Un mismo lenguaje regular se puede describir de tres formas
> intercambiables: **expresión regular**, **autómata finito no determinista (AFN)** y
> **autómata finito determinista (AFD)** (y además, gramática regular). Las tres tienen
> **exactamente el mismo poder** — y hay algoritmos para pasar de una a otra. Esto es lo que
> hace Flex por dentro.

---

## 1. El Teorema de Kleene (1951): el resultado fundacional

> **Un lenguaje es regular si y solo si puede describirse con una expresión regular, si y solo
> si es reconocido por un autómata finito.**

Es decir, estos tres conjuntos son **el mismo**:
- los lenguajes denotados por expresiones regulares,
- los lenguajes aceptados por autómatas finitos (deterministas o no),
- los lenguajes generados por gramáticas regulares.

Este teorema es la **licencia teórica** de todo generador de scanners: garantiza que *toda*
expresión regular se puede convertir en una máquina, y que esa máquina existe y es finita.

```
    Expresión Regular  ◄──────►  Autómata Finito  ◄──────►  Gramática Regular
         (RE)             Kleene      (AFN/AFD)               (Tipo 3)
```

---

## 2. Las tres caras en detalle

### Cara 1 — Expresión regular (la que escribe el humano)
Sintaxis para *describir* patrones, construida con:
- símbolos del alfabeto: `a`, `b`, …
- concatenación: `ab`
- alternancia: `a|b`
- clausura de Kleene: `a*` (cero o más)
- y derivados: `a+`, `a?`, `[0-9]`, etc.

Es **declarativa**: dice *qué* forma tienen las cadenas, no *cómo* reconocerlas.

### Cara 2 — Autómata finito NO determinista (AFN)
Una máquina donde, desde un estado, un símbolo puede llevar a **varios** estados a la vez (o a
ninguno), y se permiten transiciones **ε** (saltar de estado sin consumir entrada). "Acepta"
una cadena si **existe algún** camino que termine en estado final.

- **Ventaja:** es facilísimo de construir a partir de una expresión regular.
- **Desventaja:** ejecutarlo requiere explorar varios caminos simultáneos.

### Cara 3 — Autómata finito DETERMINISTA (AFD)
Como el AFN pero **sin ambigüedad**: desde cada estado, cada símbolo lleva a **exactamente un**
estado, y no hay transiciones ε.

- **Ventaja:** ejecución trivial y velocísima — leer símbolo, seguir la única flecha, repetir.
  Tiempo lineal en la longitud de la entrada, **sin retroceso**.
- Es la forma final que Flex emite como tablas en C.

```
  AFN: (estado, símbolo) → CONJUNTO de estados   (no determinista, con ε)
  AFD: (estado, símbolo) → UN estado             (determinista, sin ε)
```

---

## 3. Las construcciones: cómo pasar de una cara a otra

Flex encadena estas transformaciones. Cada una es un algoritmo clásico.

### 3.1. Expresión Regular → AFN: **construcción de Thompson** (1968)
Ken Thompson (sí, el de Unix y C) dio un método mecánico: cada operador de la expresión
regular tiene un "ladrillo" de autómata, y se ensamblan recursivamente. Las imágenes
`File:Thompson-*.svg` (doc 00) muestran cada ladrillo:

```
  Símbolo  a :     →(i)──a──►(f)

  Concatenación r·s :   [AFN de r]──ε──►[AFN de s]

  Alternancia r|s :        ┌─ε─►[AFN de r]─ε─┐
                        →(i)                 (f)
                           └─ε─►[AFN de s]─ε─┘

  Kleene  r* :          ┌──────────ε─────────┐
                        │                     ▼
                    →(i)──ε──►[AFN de r]──ε──►(f)
                              ▲          │
                              └────ε─────┘
```
El AFN resultante tiene un tamaño **lineal** en el largo de la expresión regular: elegante y
barato.

### 3.2. AFN → AFD: **construcción de subconjuntos** (Rabin–Scott, 1959)
Aquí está la idea genial. Cada estado del AFD es un **conjunto de estados** del AFN: representa
"todos los estados en los que el AFN podría estar a la vez". Se simula el no determinismo
*por adelantado*:

1. El estado inicial del AFD = la **ε-clausura** del inicial del AFN (todos los estados
   alcanzables con saltos ε).
2. Para cada estado del AFD (un conjunto `S`) y cada símbolo `x`: el próximo estado es la
   ε-clausura de "todos los estados a los que se llega desde `S` leyendo `x`".
3. Un estado del AFD es final si su conjunto contiene **algún** final del AFN.

> **Costo:** un AFN de `n` estados puede dar un AFD de hasta **2ⁿ** estados (explosión
> exponencial en el peor caso). En la práctica del análisis léxico casi nunca explota, pero el
> riesgo existe y por eso luego se minimiza.

Rabin y Scott ganaron el **Premio Turing (1976)** en parte por esta idea.

### 3.3. AFD → AFD mínimo: **minimización**
Se fusionan estados indistinguibles para obtener el AFD más chico. (Documento 03 completo.)

### 3.4. El atajo: Expresión Regular → AFD directo
Existe un camino que **saltea el AFN**: las **derivadas de Brzozowski** (1964) construyen el
AFD directamente desde la expresión regular, calculando "qué queda de la expresión después de
consumir cada símbolo". (También en doc 03.)

---

## 4. El panorama de las conversiones

```
                         construcción
   Expresión Regular  ─── de Thompson ───►   AFN
        │                                     │
        │  derivadas de Brzozowski            │ construcción de
        │  (directo, sin AFN)                 │ subconjuntos (Rabin–Scott)
        ▼                                     ▼
       AFD  ◄──────────────────────────────  AFD
        │
        │ minimización (Hopcroft / Myhill–Nerode)
        ▼
   AFD MÍNIMO  ──── (Flex lo emite como tablas en C) ────►  scanner
```

Y para cerrar el círculo, **todo AFD se puede volver a convertir en una expresión regular**
(eliminación de estados / algoritmo de Kleene), confirmando que las tres caras son
verdaderamente intercambiables.

---

## 5. Por qué esto importa para Flex (y para vos)

- Cuando escribís reglas en un `.l`, estás del lado de la **expresión regular** (Cara 1).
- Flex hace **Thompson → subconjuntos → minimización** y termina del lado del **AFD** (Cara 3),
  que es lo más rápido de ejecutar.
- El AFD final lo viste con tus propios ojos: son las tablas `yy_nxt`, `yy_accept`, etc. de
  `lex.yy.c` (decodificadas en `flex-profundo.md`).

Todo el "magia" de un generador léxico es, literalmente, **este pipeline de teoremas de los
años 50 y 60 automatizado**.

---

## Fuentes
- *Thompson's construction* — Wikipedia:
  https://en.wikipedia.org/wiki/Thompson%27s_construction
- *Powerset construction* (Rabin–Scott) — Wikipedia:
  https://en.wikipedia.org/wiki/Powerset_construction
- *Kleene's theorem* / *Regular language* — Wikipedia:
  https://en.wikipedia.org/wiki/Regular_language
- Ken Thompson, *Regular Expression Search Algorithm*, CACM, 1968.
- Hopcroft, Motwani, Ullman — *Introduction to Automata Theory* (cap. 2–3).
