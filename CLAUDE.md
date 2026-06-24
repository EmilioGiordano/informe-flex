# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

NO es un repositorio de código. Es la carpeta de trabajo de un **Trabajo de Investigación**
académico de la asignatura **Teoría de los Lenguajes de Programación** (5° año, Licenciatura
en Informática).

- **Tema del TP2: Generadores de Analizadores Léxicos** (lexical analyzer generators).
- **Entregable**: una **presentación** para exponer en clase (no código de producción).
- **Fecha de entrega**: viernes 26 de junio de 2026.
- **Idioma de trabajo**: español. Toda la salida (texto, diapositivas, ejemplos) va en español.

La consigna completa está en `consigna.md`.

## Qué debe contener la presentación (consigna)

Como mínimo:
1. Nombre de la herramienta.
2. Descripción de la herramienta.
3. Cómo trabaja, idealmente con un ejemplo paso a paso.
4. Comparación con otras herramientas similares.
5. Bibliografía.

Además: introducir los conceptos teóricos necesarios cuando un elemento de la herramienta
lo requiera (p. ej. expresiones regulares, autómatas finitos, tokens).

La herramienta a presentar la elige el grupo. Ver "Decisión pendiente" abajo.

## Material de cursada (fuente de verdad para el marco teórico)

Rutas absolutas (fuera de esta carpeta):
- Teórico: `..\Teoria\` — en particular `4_Introducción_a_Compiladores.pdf` es el más
  relevante para este TP (etapas de compilación, análisis léxico, herramientas).
- TPs adicionales: `..\TPs-adicionales\` (`TLP - 2026 - TP1..TP5.pdf`).

Antes de afirmar algo del marco teórico, verificarlo contra estos PDFs; no inventar
definiciones.

## Dónde encaja el análisis léxico (marco teórico, resumido del PDF)

Etapas del compilador: **Análisis Léxico → Sintáctico → Semántico → Generación de código
intermedio → Optimización → Generación de código objeto**. Todas interactúan con la
**tabla de símbolos** y el **manejo de errores**.

El **analizador léxico (scanner)** es la primera etapa: lee el código fuente carácter a
carácter y produce **tokens** (identificadores, palabras clave, números, delimitadores,
símbolos, comentarios…). Base teórica: los **tokens se describen con expresiones regulares**
y el reconocimiento se implementa con **autómatas finitos** (gramáticas tipo 3 de Chomsky).
Un **generador de analizadores léxicos** parte de una especificación en expresiones
regulares y produce automáticamente ese autómata finito. Referencia histórica del PDF:
**Lex** (Mike Lesk, Unix, ~1975), par de **Yacc** (generador de analizadores sintácticos).

## Decisión pendiente: elección de herramienta

Candidatas habituales (a confirmar con el usuario según el lenguaje que dominen):
- **Flex** (C) — sucesor de Lex; máxima cercanía con el marco teórico del PDF.
- **JFlex** (Java) — moderno, suele combinarse con CUP.
- **PLY / ANTLR** — Python / multi-target; ANTLR combina léxico + sintáctico.

## Convenciones de trabajo

- Responder y redactar en **español**.
- El objetivo final es material de **presentación**: priorizar claridad, ejemplos visuales
  y el flujo "expresión regular → autómata → token".
- Si se generan archivos de la herramienta (p. ej. un `.l`/`.flex` de ejemplo), mantenerlos
  mínimos y orientados a la demo paso a paso, no a un compilador completo.
