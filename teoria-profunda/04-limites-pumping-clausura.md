# 04 — Los límites de lo regular: bombeo, clausura y decidibilidad

> Toda clase de lenguajes se define tanto por lo que **puede** como por lo que **no puede**.
> Este documento explora la frontera de los lenguajes regulares: qué cosas quedan afuera (y por
> qué), qué operaciones los preservan, y qué preguntas sobre ellos tienen respuesta algorítmica.

---

## 1. El lema de bombeo (*pumping lemma*): la prueba de "no es regular"

Es la herramienta clásica para demostrar que un lenguaje **NO** es regular. La intuición nace
de la limitación que ya vimos: un autómata finito tiene **memoria finita** (sus estados).

### La idea
Si un AFD tiene `p` estados y procesa una cadena de largo `≥ p`, por el **principio del
palomar** tiene que **repetir un estado**. Entre dos visitas al mismo estado hay un "bucle":
ese pedazo de cadena se puede **repetir (bombear) cuantas veces se quiera** y la máquina seguirá
aceptando.

### El enunciado
> Para todo lenguaje regular `L` existe un número `p` (la "longitud de bombeo") tal que toda
> cadena `w ∈ L` con `|w| ≥ p` se puede partir en `w = xyz` con:
> 1. `|y| ≥ 1` (el bucle no es vacío),
> 2. `|xy| ≤ p`,
> 3. `xyⁱz ∈ L` para **todo** `i ≥ 0` (se puede bombear `y` las veces que sea).

### Cómo se usa (por el absurdo)
Para probar que `L = aⁿbⁿ` no es regular: si lo fuera, tomá `w = aᵖbᵖ`. El bucle `y` cae
dentro de las primeras `p` letras (todas `a`). Bombear `y` agrega `a` de más → quedan más `a`
que `b` → la cadena ya **no** está en `L`. Contradicción. Por lo tanto `aⁿbⁿ` **no es regular**.

> **Esto formaliza por qué el lexer no puede balancear paréntesis** (visto en doc 01): `()ⁿ`
> anidados son como `aⁿbⁿ`. Hace falta una pila (autómata de tipo 2 = el parser).

⚠️ **Cuidado:** el lema de bombeo es una condición **necesaria** pero no suficiente. Pasarlo no
garantiza ser regular. La herramienta *definitiva* es Myhill–Nerode (doc 03).

---

## 2. Propiedades de clausura: qué operaciones preservan la regularidad

Los lenguajes regulares son **notablemente robustos**: están "cerrados" bajo casi toda
operación razonable. Si `L₁` y `L₂` son regulares, también lo son:

| Operación | Resultado | ¿Regular? |
|---|---|:---:|
| Unión | `L₁ ∪ L₂` | ✅ |
| Intersección | `L₁ ∩ L₂` | ✅ |
| **Complemento** | `Σ* − L₁` | ✅ |
| Concatenación | `L₁ · L₂` | ✅ |
| Estrella de Kleene | `L₁*` | ✅ |
| Reverso | `L₁ᴿ` | ✅ |
| Diferencia | `L₁ − L₂` | ✅ |
| Homomorfismo (y su inverso) | renombrar símbolos | ✅ |

Esta riqueza tiene consecuencias prácticas enormes:
- El **complemento** se obtiene fácil: tomá el AFD y **intercambiá** estados finales y no
  finales. (Por eso es trivial para un AFD, pero NO para un AFN — hay que determinizar primero.)
- La **intersección** se obtiene con la **construcción producto**: un AFD que simula los dos a
  la vez, con estados `(estado de A₁, estado de A₂)`.
- Estar cerrado bajo booleanos + concatenación + estrella es justo lo que hace que las
  expresiones regulares sean un álgebra tan cómoda.

> **Contraste:** los lenguajes libres de contexto (tipo 2) **NO** están cerrados bajo
> intersección ni complemento. Lo regular es, en este sentido, "más prolijo" que lo libre de
> contexto. Menos poder, pero más propiedades.

---

## 3. Decidibilidad: preguntas con respuesta algorítmica

Para los lenguajes regulares, **casi todo es decidible** — hay un algoritmo que responde sí/no:

| Pregunta | ¿Decidible? | Cómo |
|---|:---:|---|
| ¿`w ∈ L`? (pertenencia) | ✅ | correr el AFD sobre `w` (tiempo lineal) |
| ¿`L = ∅`? (vacuidad) | ✅ | ¿hay un estado final alcanzable desde el inicial? |
| ¿`L` es infinito? | ✅ | ¿hay un ciclo alcanzable que llegue a un final? |
| ¿`L₁ = L₂`? (equivalencia) | ✅ | minimizar ambos y comparar; o ver si `(L₁−L₂)∪(L₂−L₁)=∅` |
| ¿`L₁ ⊆ L₂`? (inclusión) | ✅ | ¿`L₁ ∩ complemento(L₂) = ∅`? |

> **Esto es excepcional.** En niveles superiores estas preguntas se complican o se vuelven
> **indecidibles**: la equivalencia de dos gramáticas libres de contexto (tipo 2) ya es
> **indecidible**. La regularidad es una especie de "paraíso algorítmico": todo se puede
> computar. Por eso los generadores de scanners pueden, por ejemplo, detectar reglas que nunca
> matchearán o avisar de ambigüedades — porque esas preguntas son decidibles.

---

## 4. La foto completa de la frontera

```
  LO QUE LO REGULAR PUEDE                 LO QUE NO PUEDE
  ─────────────────────────               ───────────────────────────
  • reconocer patrones de texto           • contar sin límite (aⁿbⁿ)
  • "¿par o impar?", módulos              • anidar / balancear (paréntesis)
  • prefijos, sufijos, subcadenas         • comparar dos mitades (ww)
  • uniones/intersecciones de lo anterior • aritmética arbitraria
  • todo con memoria FINITA               • todo lo que requiera memoria ∞
```

La frontera la marca exactamente una cosa: **la memoria**. Con memoria finita llegás hasta acá;
para cruzar al tipo 2 necesitás una pila; para el tipo 0, una cinta infinita (Turing).

---

## 5. Por qué estos límites son una *virtud* para el análisis léxico

Podría parecer que las limitaciones son malas, pero para un lexer son **exactamente lo que se
quiere**:
- **Velocidad garantizada:** tiempo lineal, sin retroceso, sin explosión. Un AFD procesa cada
  carácter en tiempo constante.
- **Memoria acotada y predecible.**
- **Decidibilidad:** la herramienta puede analizar tus reglas por completo.

El diseño de los compiladores aprovecha esto deliberadamente: se le da a cada subproblema **la
máquina más débil que lo resuelve**. Tokens → autómata finito (rápido y simple). Estructura →
autómata de pila (más potente, más caro). Es ingeniería guiada por la teoría.

---

## Fuentes
- *Pumping lemma for regular languages* — Wikipedia:
  https://en.wikipedia.org/wiki/Pumping_lemma_for_regular_languages
- *Regular language* (propiedades de clausura y decisión) — Wikipedia:
  https://en.wikipedia.org/wiki/Regular_language
- Sipser — *Introduction to the Theory of Computation* (cap. 1).
- Hopcroft, Motwani, Ullman — *Introduction to Automata Theory* (cap. 4).
