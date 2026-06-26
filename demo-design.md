# Propuesta de UI — Demo web TP2 Flex · **cómo se ve**

> Este archivo responde al pedido de `contexto-demo.md` (§9): una propuesta de **identidad
> visual** para la demo. La **UX** (qué hace) ya está fijada en `propuesta-demo-web.md`; acá
> aporto el **cómo se ve y cómo se siente**. Sin código todavía: es la visión.
>
> **TL;DR de la dirección:** un **esquemático técnico que se enciende**. La pantalla es un
> banco de delineante (papel cuadriculado, trazos de tinta) y el *rastreador* lo recorre de
> izquierda a derecha **prendiendo en ámbar fósforo solo lo que está tocando ahora mismo**. El
> momento estrella —el *match más largo*— es el **elemento firma**: la palabra se traga entera
> y el corte se ve como un "rebote" hasta la última aceptación.

---

## 1. La gran idea (una frase)

**Un instrumento de laboratorio dibujado a tinta que se enciende a medida que escanea:** el
texto es una cinta, el cabezal del rastreador la barre, y la máquina (el autómata) se ilumina
por dentro mientras forma cada token.

Nombre de trabajo para la pieza: **EL RASTREADOR** (uso la palabra de la cátedra a propósito;
ver `contexto-demo.md` §2).

---

## 2. Concepto / dirección visual

### 2.1. La dirección, en positivo

El tema **ya trae** su estética; no hace falta inventarla, hace falta hacerla literal. De las
vetas que propone `contexto-demo.md` §8, esta dirección fusiona **tres** en un solo gesto:

- **Blueprint / circuito / diagrama de autómatas** → la pantalla es un **plano técnico**:
  retícula de papel cuadriculado, trazos finos de tinta, el autómata dibujado como un
  esquemático real (estados, flechas, self-loop).
- **Radiografía / "ver la máquina encendiéndose"** → el plano arranca **apagado** (todo en
  tinta, el autómata como un fantasma tenue) y **se enciende** parte por parte a medida que el
  rastreador trabaja. Literalmente *ver por dentro la máquina prendiéndose*.
- **El rastreador / cabezal de escaneo** → el héroe de la pantalla es un **cabezal** que barre
  la cinta de izquierda a derecha, como la cabeza lectora de una cinta o un *playhead*.

El **alma de terminal Unix / fósforo** (Lex nació en Bell Labs, 1975) **no se pierde**: se
concentra en un único color, el **ámbar fósforo**, reservado para *lo que está vivo en este
instante* —el cabezal, el estado encendido del autómata, el tick de aceptación—. Es el brillo
del tubo CRT puesto exactamente donde hay actividad. Tomamos el **espíritu** del CRT sin el
fondo negro.

### 2.2. Por qué NO el "terminal negro" (la decisión profesional)

La reacción instintiva para este tema es la pantalla negra de hacker con verde fósforo. La
descarto por dos razones, en este orden:

1. **No es la lectura más rica del tema.** El verde-sobre-negro cuenta "terminal"; el
   esquemático-que-se-enciende cuenta **el mecanismo**: estados, transiciones, aceptación,
   corte. Para una clase de *Teoría de Lenguajes*, mostrar la máquina por dentro vale más que
   la postal nostálgica.
2. **Contexto de uso (soporte, no titular).** Se proyecta en un **aula** que puede estar con
   luz: un fondo oscuro se lava y "se ve gris" en muchos proyectores, mientras que un fondo
   claro con tinta de alto contraste **se lee desde el fondo**. Además se **embebe en Gamma**
   (decks normalmente claros): una demo clara se integra; una oscura queda como un "agujero"
   en la slide.

> En resumen: no abandono la estética del tema para esquivar un cliché; **capturo el fósforo
> donde importa** (lo vivo) y gano legibilidad de aula. Esa es la jugada.

---

## 3. Paleta

Dos capas. Primero la **paleta de identidad** (4–6 colores, lo que pide la consigna); después
un **código de color de tokens** que es funcional —cada color *significa* un tipo de token— y
por eso se justifica aparte.

### 3.1. Paleta de identidad (la marca de la pieza)

| Rol | Hex | Uso |
|---|---|---|
| **Vitela** (lienzo) | `#ECEFF2` | Fondo: papel de delineante, gris muy claro y frío (no crema). |
| **Retícula** | `#D6DDE4` | Cuadrícula de fondo + reglas/hairlines técnicas. |
| **Tinta** | `#10243A` | Trazos del esquemático, títulos y cuerpo. Alto contraste = se lee de lejos. |
| **Tinta tenue** | `#5B6B7A` | Etiquetas secundarias y el autómata "dormido"/fantasma antes de encender. |
| **Ámbar vivo** ⚡ | `#D9650A` | **El único color audaz.** Lo que está vivo *ahora*: cabezal, estado encendido, tick de aceptación, foco de teclado. |
| **Lámina** (panel) | `#FBFCFD` | Superficie casi blanca de la cinta de entrada y el riel de salida; los despega de la vitela. |

El gasto de audacia es **uno solo**: el ámbar. Todo lo demás es disciplina de delineante en
tinta. (Regla de Chanel: sacar un accesorio antes de salir.)

### 3.2. Código de color de tokens (capa funcional)

Estos colores **transportan significado** (el tipo de cada token), por eso suman a los de
identidad sin "ensuciar" la marca: se ven casi siempre en la **salida** (los chips) y como
tinte del fragmento de origen en la cinta.

| Token | Hex | |
|---|---|---|
| **NUMERO** | `#1F6FEB` | cobalto |
| **IDENTIFICADOR** | `#1A8A4B` | verde |
| **OPERADOR** (MAS, MENOS, POR, DIV, ASIGNACION, PAR_IZQ/DER) | `#7A3FBF` | violeta |
| **DESCONOCIDO** | `#D1322B` | rojo |
| **IGNORADO** (espacio, tab, salto) | `#9AA7B2` | gris tramado — *sin chip*, se ve "saltado" |

---

## 4. Tipografía

Tres roles, elegidos para el mundo "instrumento técnico", no la tipografía de cualquier
dashboard.

- **Display — `Space Grotesk`** (wordmark "EL RASTREADOR", títulos de banda, etiquetas de TIPO
  de token). Grotesca de carácter técnico/ingenieril, con personalidad, sin ser caricaturesca.
  *Alternativa si hace falta:* `Archivo` o `Chivo`.
- **Cuerpo / UI — `IBM Plex Sans`**. Superfamilia con herencia informática (diseñada para una
  empresa de tecnología), excelente a tamaños de proyección. Más carácter que el `Inter`
  genérico y **combina nativamente** con la mono de abajo.
- **Monoespaciada — `IBM Plex Mono`** (la cinta de entrada, los tokens, las etiquetas del
  autómata, el bloque de terminal). **No es decorativa: es estructural.** Como cada carácter
  ocupa el mismo ancho, la cinta es una **grilla de celdas exactas**: el cabezal se alinea
  carácter a carácter y los límites del *match más largo* quedan visualmente precisos. La mono
  es la cara protagonista porque la demo, en el fondo, **es texto siendo escaneado**.

> **Nota de plataforma (un solo `.html`, offline).** Sin internet no hay Google Fonts en vivo.
> Recomiendo **embeber** las tres familias como `woff2` en base64, **subseteadas** a los
> glifos que se usan (pesa poco). *Fallback* robusto por si algo falla: display →
> `system-ui`; cuerpo → `system-ui`; mono → `ui-monospace, "Cascadia Code", Consolas, Menlo,
> monospace`. La cinta **siempre** debe caer en una mono real, aunque sea del sistema.

---

## 5. Layout

Tres objetos de información (`propuesta-demo-web.md` §3) en **bandas apiladas** sobre el banco
de delineante. El escaneo es horizontal (izq→der, como se lee); el *pipeline*
entrada → proceso → salida es vertical (arriba→abajo). Eso resuelve la tensión: **se escanea a
lo ancho, la máquina fluye hacia abajo.**

```
┌──────────────────────────────────────────────────────────────────────┐
│  EL RASTREADOR — el scanner de Flex, en vivo        · puente honesto · │  wordmark + subtítulo
├──────────────────────────────────────────────────────────────────────┤
│  ENTRADA · cinta de lectura                              col 1 2 3 …   │
│   ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐                                      │
│   │a │  │= │  │4 │  │+ │  │2 │  │   ← celdas mono, una por carácter    │
│   └──┴─▲┴──┴──┴──┴──┴──┴──┴──┴──┘                                      │
│        █ cabezal (ámbar) barriendo →                                   │
│        [═══ estela de aceptación ═══]┊tick                             │
├──────────────────────────────────────────────────────────────────────┤
│  PROCESO · la máquina                                                  │
│   ┌─ autómata (esquemático) ──────┐   ┌─ lectura actual ───────────┐  │
│   │   →(S0) ──letra──► ((S1)) ⟲   │   │ lee:        '='            │  │
│   │          encendido en ámbar   │   │ estado:     S1 · ACEPTA    │  │
│   │                               │   │ lexema:     "a"            │  │
│   └───────────────────────────────┘   │ últ. acept.: col 1         │  │
│                                        └────────────────────────────┘ │
│   ▸ Corte en col 2: ' ' no continúa IDENTIFICADOR → gana [a-zA-Z_]…   │  "por qué cortó" explícito
├──────────────────────────────────────────────────────────────────────┤
│  SALIDA · tokens emitidos                                              │
│   ┌IDENTIFICADOR┐ ┌ASIGNACION┐ ┌NUMERO┐ ┌MAS┐ ┌NUMERO┐                │
│   │     a       │ │    =     │ │  4   │ │ + │ │  2   │  ← chips color  │
│   └─────────────┘ └──────────┘ └──────┘ └───┘ └──────┘                │
├──────────────────────────────────────────────────────────────────────┤
│  ◀ paso   ⏵ reproducir   ↺ reiniciar   ✎ editar          velocidad ▭▭ │  controles grandes
├──────────────────────────────────────────────────────────────────────┤
│  TERMINAL · puente honesto (plegable)                                  │
│   $ flex lexer.l && gcc lex.yy.c -o lexer                              │
│   $ echo "a = 4 + 2" | ./lexer        → misma entrada, misma salida    │
└──────────────────────────────────────────────────────────────────────┘
```

**El banco que se enciende (comportamiento ambiente del layout).** En reposo, todo está
*apagado*: el autómata es un fantasma en tinta tenue, las celdas de la cinta son contornos
vacíos, el riel de salida está vacío. Al escanear, **solo lo activo** prende en ámbar y los
tokens florecen en su color de categoría. La página, literalmente, **se energiza** mientras el
rastreador corre. (Es la veta "radiografía" hecha layout.)

**Mapeo a los 3 objetos** (`propuesta-demo-web.md` §3): Entrada = banda de la cinta + cabezal;
Proceso = banda de la máquina (autómata + lectura actual + línea de corte); Salida = riel de
chips.

---

## 6. Elemento firma

**La estela de aceptación y el corte** — el *match más largo* hecho un solo gesto. Es lo único
que la audiencia se va a llevar grabado, así que toda la audacia se gasta acá y el resto queda
quieto.

Cómo se ve, paso a paso:

1. A medida que el cabezal avanza, detrás de él se **rellena una estela** con el color de la
   categoría del token en curso (tenue), y un **tick ámbar brillante** marca la **última
   columna donde el autómata aceptó**. Ese tick **trinca hacia adelante** cada vez que un nuevo
   carácter mantiene la aceptación. → Hace **visible** "la última posición de aceptación", que
   `contexto-demo.md` §4 señala como *el concepto sutil*.
2. Llega un carácter que **rompe** el match (el espacio después de `index`, por ejemplo). El
   cabezal **se pasa de largo** un instante: la celda que rompe **destella en rojo** (estado
   muerto, "sin transición").
3. **El rebote:** la estela **se contrae de golpe hasta el tick** (la última aceptación), el
   bloque del lexema **se despega** de la cinta y **cae** al riel de salida, asentándose como un
   chip de color. Fin del token.

Ese **pasarse → rebotar → desprender** (~400 ms) es la lección entera —"la palabra se traga y
el espacio la parte"— en un movimiento. Es el momento que tanto `contexto-demo.md` §4 como
`propuesta-demo-web.md` §6 marcan como **EL momento estrella**, así que es, sin discusión, la
firma.

---

## 7. Microinteracciones / motion

Todo al servicio del *match más largo*, y todo con **degradación a "menos movimiento"**.

1. **Barrido del cabezal.** Paso: salto discreto celda-a-celda con un pulso ámbar suave.
   Reproducir: deslizamiento continuo, controlado por la velocidad.
2. **Estela + tick** (ver §6): relleno detrás del cabezal en el color del token; tick ámbar que
   trinca a cada aceptación.
3. **Firma: pasarse → rebote → desprender** (ver §6). El gesto decisivo.
4. **Autómata encendiéndose.** El estado actual se llena de ámbar; el **self-loop** de S1
   **late** con cada letra/dígito que sostiene el match; cuando llega el carácter que rompe, no
   hay flecha de salida → aparece un pequeño **"✕ sin transición"** que *explica* el corte.
5. **Espacio ignorado.** Pasa bajo el cabezal con un tramado gris tenue, sin emitir chip: se ve
   "saltado".
6. **Carga (hero).** Al abrir, la página hace **una pasada suave automática** de `a = 4 + 2`
   —el cabezal barre, cae el primer token— y queda **lista para el primer paso**. El héroe de
   la página es la demo viva, no un titular. (Es lo más característico del tema; mejor mostrarlo
   que anunciarlo.)
7. **`prefers-reduced-motion`.** Sin viajes ni *easing*: los cambios de estado son instantáneos,
   el corte se muestra como un marcador "corte" estático + cambio de color, el tick salta sin
   animar, los chips aparecen ya asentados. Todo sigue legible y enseñable.

**Teclado y foco** (accesibilidad, `propuesta-demo-web.md` §9): `→` / `Espacio` = paso; `P` =
reproducir/pausar; `R` = reiniciar; `E` = editar. Foco visible con anillo **ámbar**. Objetivos
de click grandes (aula). *Sugerencia de valor para exponer en vivo:* un **paso atrás** (`←`)
—poder retroceder un carácter es oro explicando frente a la clase—.

---

## 8. Respuestas a las 4 preguntas de UX

`propuesta-demo-web.md` §12 deja 4 preguntas abiertas. Como me delegaste la decisión, las
**respondo como recomendaciones** sobre *tus* preguntas (las dejo así para que puedas dar
vuelta cualquiera; p. ej. apagar el autómata):

1. **¿Cuánto proceso? → Escaneo + autómata (opción b), pero el autómata subordinado.** Es el
   autómata **chico hecho a mano** (S0 → S1 con self-loop), dibujado como esquemático que se
   enciende, **secundario** a la cinta para que no abrume. Da la "teoría hecha visible" y el
   espectáculo, coherente con la identidad de banco. *Palanca:* un toggle para **ocultarlo** y
   quedarte solo con cabezal + token, para la versión más simple.
2. **¿Quién la maneja? → Diseñada para que VOS la conduzcas, robusta para que el público la
   toque.** Controles grandes, teclado, paso atrás. Y "a prueba de manos ajenas" para el embed
   en Gamma: input **saneado** y con **tope de longitud**, sin estados rotos, **reiniciar
   siempre disponible**.
3. **¿Paso a paso o reproducir? → "Paso a paso" es el protagonista; "reproducir" es el bis.**
   Paso es la herramienta de enseñanza; reproducir es el espectáculo/encore (y el hero de
   carga). La pose por defecto queda **lista para el primer paso**.
4. **¿Por qué cortó acá? → Explícito** (línea de texto en la banda Proceso) **y** reforzado por
   la animación. En un aula, explícito gana. Ej.:
   `Corte en col 2: ' ' no continúa IDENTIFICADOR → gana la regla [a-zA-Z_][a-zA-Z0-9_]*`.

---

## 9. Contenido: presets y el puente honesto

**Presets de entrada** (chips para cargar de un toque):

1. **`a = 4 + 2`** — *el puente*. Idéntico a la terminal (`contexto-demo.md` §6). **Default.**
2. **`a[index] = 4 + 2`** — *el match más largo*. `index` (5 letras) se traga entero: la firma
   en su mejor momento.
3. **`x = 3 @ 5`** — *DESCONOCIDO* (`@`) + espacios ignorados.

Campo **editable** con tope de longitud y saneo (robusto para el embed).

**El puente honesto** (`propuesta-demo-web.md` §7): la banda **TERMINAL**, plegable, es un
inset quieto en tinta (no un segundo mundo CRT) con el prompt en mono y un cursor que parpadea
ámbar. Muestra el pipeline real de Flex y el **rótulo honesto**:

> *El analizador real lo genera **Flex en C** (lo ves en la terminal). Acá replicamos sus
> **mismas reglas en JavaScript** para poder verlas en vivo.*

Como la entrada por defecto coincide con la terminal → **"misma entrada, misma salida"**.

---

## 10. Notas honestas y decisiones para vos

Cosas que un diseño "ultra profesional" debe transparentar, no esconder:

- **La "prioridad de reglas" SÍ se puede mostrar con el ruleset real — y sin inventar un
  keyword.** Ojo: el `lexer.l` de la cátedra **no tiene** ninguna regla de palabra clave, así
  que el caso "`if` es palabra clave y no identificador" **no** se puede demostrar con *este*
  lexer. Pero la prioridad por orden **sí** es real sobre la entrada real: el carácter `+`
  matchea **dos** reglas —la de operador (`MAS`) y la catch-all `.` (`DESCONOCIDO`)— con la
  misma longitud; **gana la primera listada → `MAS`**. Eso es una demo *verdadera* de
  "si dos reglas empatan, gana la de arriba", sin trucos.
  → **Recomendación:** mantener el ruleset **fiel a la terminal** (no agregar un keyword: eso
  rompería el puente de "misma salida" que `propuesta-demo-web.md` §9 hace cargar de peso).
  Mostrar la prioridad con el caso `+` (operador vs `.`), y dejar el `if` como **aside
  conceptual claramente rotulado** ("en un lenguaje real, una regla `if` iría *antes* que la de
  identificador").
- **Un panel "reglas" (en orden)** —chico, en mono— hace visible la prioridad como **orden
  vertical**: la regla que gana es, literalmente, la que está más arriba. Refuerza el punto sin
  animación extra.
- **Fuentes offline:** embeber subseteado (§4). Es el precio de "un solo `.html` sin internet";
  vale la pena.
- **Claro vs oscuro:** elegí claro por las razones de §2.2 (mecanismo + aula + Gamma). Si en
  algún contexto se proyecta en sala a oscuras y querés el mood CRT, la misma estructura admite
  un "modo noche" (invertir vitela↔tinta, subir el ámbar), pero **no** es el default.

---

## 11. Checklist contra la consigna (`contexto-demo.md` §9)

| Pedido | Dónde |
|---|---|
| 1. Concepto / dirección visual | §1–§2 — *el esquemático que se enciende* |
| 2. Paleta (4–6 + hex + rol) | §3.1 (identidad) + §3.2 (tokens, funcional) |
| 3. Tipografía (display + cuerpo + mono, justificada) | §4 |
| 4. Layout (entrada · proceso · salida) | §5 |
| 5. Elemento firma | §6 — *la estela de aceptación y el corte* |
| 6. Microinteracciones / motion (al servicio del match más largo) | §7 |

> Distintiva, anclada en el mundo del tema (blueprint + radiografía + rastreador, con alma de
> fósforo), pensada para el aula y para Gamma. Próximo paso, si te gusta: lo paso a un único
> `.html` con SVG + JS vanilla.
