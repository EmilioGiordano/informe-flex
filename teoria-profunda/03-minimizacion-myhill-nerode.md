# 03 — Minimización y el teorema de Myhill–Nerode

> Uno de los resultados más elegantes de toda la informática: **para cada lenguaje regular
> existe un AFD mínimo, y es único** (salvo renombre de estados). Y la razón profunda de por
> qué es único es un teorema bellísimo: **Myhill–Nerode**.

---

## 1. El problema de la minimización

Un mismo lenguaje puede ser reconocido por muchos AFD distintos, algunos con estados de más
(redundantes). Minimizar = encontrar el AFD con la **menor cantidad de estados** posible que
reconoce el mismo lenguaje.

¿Por qué importa?
- **Tablas más chicas** y scanners más rápidos (menos memoria, mejor uso de caché).
- Da una **forma canónica**: dos expresiones regulares describen el mismo lenguaje si y solo
  si sus AFD mínimos son idénticos. Esto permite **decidir la equivalencia** de dos patrones.

---

## 2. La idea: estados indistinguibles

Dos estados `p` y `q` son **indistinguibles** si, para **toda** cadena `z`, leer `z` desde `p`
y desde `q` lleva a la misma respuesta (ambos terminan aceptando, o ambos rechazando). Si dos
estados son indistinguibles, **sobran**: se pueden fusionar en uno solo sin cambiar el
lenguaje.

El algoritmo de minimización va **refinando** una partición de los estados:
1. Arranca separando finales de no finales (claramente distinguibles: ε los distingue).
2. Repetidamente, si dos estados del mismo grupo van a grupos distintos con algún símbolo,
   los separa.
3. Cuando ya no se puede separar más, **cada grupo se vuelve un estado** del AFD mínimo.

### Algoritmo de Hopcroft (1971)
La versión eficiente corre en **O(n log n)**. Es uno de los algoritmos más finos de la teoría
de autómatas y sigue siendo el estándar.

---

## 3. El teorema de Myhill–Nerode (1958): la joya

Acá está lo profundo. En vez de hablar de "estados", el teorema habla **directamente del
lenguaje**, sin máquina alguna.

### La relación de Myhill–Nerode
Dado un lenguaje `L`, se definen dos cadenas `x` e `y` como **equivalentes** (`x ≡_L y`) si
son **indistinguibles por el futuro**:

> para toda cadena `z`:   `xz ∈ L`  ⟺  `yz ∈ L`

Es decir: no importa qué les agregues a `x` o a `y`, siempre caen juntas dentro o fuera de `L`.
Esto agrupa **todas las cadenas de Σ\*** en **clases de equivalencia**.

### El enunciado
> **Un lenguaje `L` es regular si y solo si su relación de Myhill–Nerode tiene un número
> FINITO de clases de equivalencia.** Y en ese caso, **el número de clases es exactamente el
> número de estados del AFD mínimo** de `L`.

### Por qué es tan profundo
- Da una caracterización de "ser regular" **sin mencionar máquinas ni expresiones**: puramente
  en términos del lenguaje como conjunto de cadenas.
- Explica **por qué el AFD mínimo es único**: ¡cada estado *es* una clase de equivalencia del
  lenguaje! El AFD mínimo no es una construcción arbitraria, es una **estructura intrínseca**
  del lenguaje, que estaba ahí desde el principio.
- Da una herramienta para **demostrar que algo NO es regular**: si encontrás infinitas cadenas
  que son distinguibles de a pares, entonces hay infinitas clases → no es regular.

### Conexión directa con Flex
¿Te acordás de las **clases de equivalencia de caracteres** (`yy_ec`) que decodificamos en el
autómata de tu ejemplo —los 256 caracteres reducidos a 12? Esa es la **misma idea** de fusionar
lo indistinguible, aplicada a los símbolos de entrada. Myhill–Nerode es la versión profunda,
aplicada a los estados y a las cadenas. Flex comprime en los dos niveles.

> **Ejemplo para entenderlo.** `L = "cadenas que terminan en a"`.
> Hay exactamente 2 clases de futuro: "la cadena hasta ahora termina en a" y "no termina en a".
> 2 clases → AFD mínimo de 2 estados. En cambio `L = aⁿbⁿ` tiene infinitas clases (`a`, `aa`,
> `aaa`… son todas distinguibles, porque cada una necesita un número distinto de `b`): infinitas
> clases → **no es regular**.

---

## 4. La minimización mágica de Brzozowski (1962)

Hay un algoritmo de minimización asombrosamente simple de enunciar:

> **Invertí el AFD, determinizalo, invertilo otra vez, determinizalo otra vez. El resultado es
> el AFD mínimo.**  (`min(A) = det(rev(det(rev(A))))`)

Suena a magia, pero funciona: invertir un autómata y determinizarlo "limpia" la indistinguibili-
dad. Hacerlo dos veces deja el mínimo. Es matemáticamente precioso, aunque en el peor caso
puede ser exponencial (por las determinizaciones).

---

## 5. Derivadas de Brzozowski (1964): construir el AFD sin pasar por el AFN

Otra idea de Brzozowski, hoy muy de moda en implementaciones modernas. La **derivada** de una
expresión regular `r` respecto de un símbolo `a`, escrita `∂ₐr`, responde:

> *"Si ya consumí una `a`, ¿qué expresión regular describe lo que falta para completar una
> cadena de `r`?"*

Ejemplos:
- `∂ₐ(ab) = b`  (consumí la `a`, falta la `b`)
- `∂ₐ(a*) = a*` (consumí una `a`, todavía puedo seguir con `a*`)
- `∂_b(ab) = ∅` (no se puede empezar `ab` con `b`)

Con esto se construye el AFD **directamente**:
- cada **estado** es una expresión regular (una derivada),
- la **transición** por `a` desde el estado `r` lleva al estado `∂ₐr`,
- un estado es **final** si su expresión acepta la cadena vacía ε.

Brzozowski demostró que una expresión regular tiene solo **finitas** derivadas distintas (salvo
equivalencia), lo que garantiza que el algoritmo **termina**. Ventajas: evita el AFN, evita la
explosión intermedia, y a menudo da un autómata ya casi mínimo. Por eso varios lexers modernos
(y matchers de regex de alto rendimiento) lo usan.

---

## 6. Resumen de por qué este capítulo es "deep"

- El AFD mínimo **no es una optimización de ingeniería**: es un **invariante matemático** del
  lenguaje (Myhill–Nerode).
- Une tres mundos: estados de una máquina ↔ clases de equivalencia de cadenas ↔ derivadas de
  una expresión. Tres formas de mirar **la misma estructura**.
- Da los algoritmos que hacen que comparar, simplificar y compilar expresiones regulares sea
  **decidible y eficiente** — la base de que Flex sea confiable.

---

## Fuentes
- *Myhill–Nerode theorem* — Wikipedia:
  https://en.wikipedia.org/wiki/Myhill%E2%80%93Nerode_theorem
- *DFA minimization* (Hopcroft, Brzozowski) — Wikipedia:
  https://en.wikipedia.org/wiki/DFA_minimization
- *Brzozowski derivative* — Wikipedia:
  https://en.wikipedia.org/wiki/Brzozowski_derivative
- Owens, Reppy, Turon — *Regular-expression derivatives reexamined*, JFP, 2009:
  https://www.khoury.northeastern.edu/home/turon/re-deriv.pdf
- Hopcroft, Motwani, Ullman — *Introduction to Automata Theory* (cap. 4).
