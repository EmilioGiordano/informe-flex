# Plan de entrega — TP2: Generadores de Analizadores Léxicos

> Entregable: una **presentación** para exponer en clase. Entrega: viernes 26/06.
> Herramienta elegida: **Flex**.

---

## 1. Decisiones tomadas (el "qué")

| Decisión | Definición |
|---|---|
| **Tema** | Generadores de analizadores léxicos |
| **Herramienta protagonista** | **Flex** (sucesor de Lex; encaja con el marco teórico de la cátedra) |
| **Nivel de alcance** | B = presentación teórica + demo en vivo |
| **Demo** | "Flex Playground" web local (o terminal como plan B) |
| **Idioma** | Español |

Pendiente de definir el grupo: integrantes, quién expone cada bloque.

---

## 2. Estructura de la presentación (slide por slide)

La consigna pide 5 puntos mínimos. Los distribuimos en 3 bloques:

### Bloque A — Contexto y teoría (el "para qué")
1. **Portada** — título, materia, integrantes, fecha.
2. **¿Dónde encaja esto?** — el compilador y sus etapas (diagrama del PDF de la
   cátedra). Marcar que el análisis léxico es la PRIMERA etapa.
3. **¿Qué es el análisis léxico?** — el ejemplo `a = 4 + 2` → tokens (mismo ejemplo
   del PDF). Definir qué es un **token**.
4. **Conceptos teóricos mínimos** — expresiones regulares (describen los tokens) y
   autómatas finitos (los reconocen). Solo lo necesario, sin profundizar de más.
5. **El problema** — hacer el analizador a mano es tedioso → nace la idea de un
   GENERADOR (que lo escribe por vos).

### Bloque B — La herramienta Flex (los 5 puntos de la consigna)
6. **Nombre e historia** [punto 1] — Flex; origen en Lex (Mike Lesk, Unix, 1975),
   hermano de Yacc. Conecta con la diapositiva histórica del PDF.
7. **Descripción** [punto 2] — qué es, qué hace, en qué lenguaje genera (C), dónde se usa.
8. **Cómo trabaja** [punto 3] — el flujo:
   `reglas (regex) → flex → analizador (autómata) → tokens`. Diagrama simple.
9. **Anatomía de una especificación `.l`** [punto 3] — las 3 secciones (definiciones,
   reglas, código).
10. **Ejemplo paso a paso / DEMO EN VIVO** [punto 3] — el momento fuerte. Mostrar la
    spec, ejecutarla, ver los tokens. (Detalle abajo, sección 3.)

### Bloque C — Comparación y cierre
11. **Comparación con otras herramientas** [punto 4] — tabla: Lex, JFlex, PLY, ANTLR
    (lenguaje, vigencia, facilidad, etc.).
12. **Ventajas y desventajas de Flex** — cuándo conviene usarlo.
13. **Conclusión** — qué resuelve un generador léxico, por qué importa.
14. **Bibliografía** [punto 5] — manual de Flex, "Dragon Book" (Aho), material de cátedra.

> Total: ~14 diapositivas. Apunta a una exposición de 15-20 min.

---

## 3. La demo (lo que la hace atractiva)

**Idea:** mostrar en vivo cómo, a partir de unas pocas reglas, se obtiene la lista de
tokens de un texto que el público proponga.

- **Opción elegida: "Flex Playground" web** — una página con la spec a un lado, el texto
  de entrada al otro, un botón, y aparecen los tokens. Vistoso e interactivo.
- **Plan B (a prueba de fallos): terminal** — los mismos 3 comandos (`flex`, `gcc`,
  ejecutar) proyectados en consola. Menos vistoso pero 0 riesgo.
- **Backup obligatorio:** grabar un video corto / capturas de la demo funcionando, por si
  en el aula falla el wifi o la notebook. Nunca depender solo del vivo.

---

## 4. Qué más hay que hacer (además de las slides)

- [ ] Definir integrantes y repartir quién expone cada bloque (A / B / C).
- [ ] Preparar el ejemplo de la demo (ya tenemos `ejemplos/lexer.l` funcionando).
- [ ] Armar la tabla comparativa (punto 4).
- [ ] Juntar la bibliografía (punto 5).
- [ ] Grabar el backup de la demo.
- [ ] Ensayar una vez con tiempos.

---

## 5. Mini-cronograma sugerido (3 días)

| Día | Tarea |
|---|---|
| **Mar 23** | Cerrar estructura. Armar la demo (Playground o terminal) y probarla. |
| **Mié 24** | Redactar slides de los Bloques A y B. |
| **Jue 25** | Slides Bloque C (comparación + bibliografía). Grabar backup. Ensayo. |
| **Vie 26** | Repaso final y entrega/exposición. |
