# Propuesta — Demo web interactiva (TP2 Flex) · **UX / qué hace**

> Esta propuesta define **qué hace** la app, no cómo se ve.
> La UI (paleta, tipografía, layout visual, animaciones concretas) se decide **después**,
> en una pasada aparte, una vez acordado el "qué es".

---

## 1. El trabajo de la app (una sola frase)

**Que una audiencia vea cómo un analizador léxico convierte texto en tokens —pudiendo ir
paso a paso— y pueda probar su propio texto.**

---

## 2. Qué hace (funcionalidades núcleo)

1. **Recibe un texto** de entrada, editable, precargado.
2. Lo **tokeniza** con las mismas reglas que Flex (respetando match-más-largo + prioridad).
3. **Muestra el resultado:** la secuencia de tokens (tipo + lexema).
4. **Muestra el proceso:** cómo se va construyendo cada token (el corazón pedagógico).
5. **Deja controlar el ritmo:** correr todo de una, o avanzar paso a paso.
6. **Relaciona** cada token con el fragmento de texto que lo originó.

---

## 3. Los tres objetos de información que maneja

| Objeto | Qué representa |
|---|---|
| **Entrada** | el texto fuente + la posición de lectura actual |
| **Proceso** | el estado del reconocimiento: qué se lee, en qué estado, dónde fue la última aceptación |
| **Salida** | los tokens ya emitidos |

Toda la app es, en el fondo, mostrar el viaje **Entrada → Proceso → Salida**.

---

## 4. Modos de interacción

- **Reproducir** — corre el escaneo completo, automático.
- **Paso a paso** — avanza de a un carácter (o de a un token). *Clave para explicar en vivo.*
- **Editar** — el usuario escribe su propio texto y se vuelve a tokenizar.
- **Reiniciar** — vuelve al estado inicial.

---

## 5. Qué comunica en cada instante del proceso

En cualquier momento, la app deja claro:
- qué **carácter** se está leyendo y cuánto se lleva consumido del token en curso;
- en qué **estado** está el reconocedor y si ese estado **acepta**;
- cuál fue la **última posición de aceptación** (la base del match-más-largo);
- los **tokens ya emitidos**;
- al cortar un token: **por qué se cortó ahí** / qué regla ganó.

---

## 6. Lo que la app ENSEÑA (el valor / el "aha")

- **Match más largo:** se ve la palabra entera tragarse como un token, y el corte recién en el
  espacio. *(El momento estrella.)*
- **Prioridad de reglas:** por qué `if` sería palabra clave y no identificador.
- **Espacios ignorados** y **caracteres desconocidos**.

---

## 7. El puente con la demo real (funcional)

- Arranca con el **mismo texto** que se corre en la terminal con Flex → la audiencia ve que el
  resultado **coincide**.
- **Rótulo honesto:** el analizador real lo genera Flex en C (visto en la terminal); acá se
  replican las mismas reglas en JS para poder **verlas en vivo**.

---

## 8. Decisiones de contenido (qué se muestra, no cómo)

- El "proceso" se visualiza con **un autómata representativo y legible**, **no** el autómata
  real completo (~20 estados), que sería ilegible. Es una decisión de **claridad**, no estética.
- A definir con vos (ver preguntas): si ese autómata es **fijo** o **cambia** según el token, y
  si se muestra el **grafo de estados** o alcanza con el cabezal + el token formándose.

---

## 9. Requisitos no-funcionales (plataforma)

- Corre **en el navegador, sin internet, sin servidor** (un solo archivo). Embebible por URL en
  Gamma.
- El tokenizador JS debe **coincidir exactamente** con la salida de Flex (correctitud — sin
  esto, el puente con la terminal se cae).
- **Accesible:** usable con teclado; respeta "menos movimiento".

---

## 10. Alcance (qué hace / qué NO en la primera pasada)

| | Funcionalidad |
|---|---|
| **Imprescindible** | entrada editable · tokenización correcta · ver la lista de tokens · ver el proceso con control **paso / reproducir** · puente con la terminal (input igual + rótulo honesto) |
| **Stretch** | autómata que cambia según el token · linkeo token↔fuente · explicitar el "por qué cortó acá" · que el público la pueda tocar |
| **Fuera** | el AFD real completo · WASM · backend · frameworks |

---

## 11. Lo que queda para DESPUÉS (la fase UI)

Paleta de colores, tipografías, layout visual, microinteracciones y estética → se definen
**una vez aprobado este "qué hace"**. Acá, a propósito, **no**.

---

## 12. Preguntas de UX (sobre función, no estética)

1. **¿Cuánto "proceso" mostramos?** Dos niveles posibles:
   - **(a) Solo el escaneo:** el cabezal recorre el texto y el token se va formando/cortando.
     Más simple; enseña el match-más-largo igual.
   - **(b) Escaneo + autómata:** además, el grafo de estados encendiéndose. Más "teoría", más
     vistoso, más complejo.
2. **¿Quién la maneja?** ¿Es solo para que **vos expongas** (la conducís), o también para que el
   **público la toque** (en sus compus / embebida en Gamma)? Cambia qué tan "a prueba de manos
   ajenas" tiene que ser.
3. **¿El protagonista es "paso a paso" (explicar) o "reproducir" (espectáculo)?** ¿o los dos por
   igual?
4. **¿El "por qué cortó acá" va explícito** (mostrar la regla / la última aceptación en texto) o
   **implícito** en la animación?
