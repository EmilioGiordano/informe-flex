/* lexer.l  —  Analizador léxico de ejemplo para un mini-lenguaje aritmético.
 * Reconoce: números, identificadores y los operadores  + - * / = ( )
 * Se procesa con:   flex lexer.l   &&   gcc lex.yy.c -o lexer
 */

%{
#include <stdio.h>
%}

/* ---- SECCIÓN 1: DEFINICIONES (atajos para expresiones regulares) ---- */
DIGITO   [0-9]
LETRA    [a-zA-Z_]

%%
 /* ---- SECCIÓN 2: REGLAS  (patrón  ->  acción) ---- */

{DIGITO}+                      { printf("NUMERO(%s)\n", yytext); }
{LETRA}({LETRA}|{DIGITO})*     { printf("IDENTIFICADOR(%s)\n", yytext); }
"+"                            { printf("MAS\n"); }
"-"                            { printf("MENOS\n"); }
"*"                            { printf("POR\n"); }
"/"                            { printf("DIV\n"); }
"="                            { printf("ASIGNACION\n"); }
"("                            { printf("PAR_IZQ\n"); }
")"                            { printf("PAR_DER\n"); }
[ \t\n]+                       { /* espacios en blanco: se ignoran */ }
.                              { printf("DESCONOCIDO(%s)\n", yytext); }

%%
/* ---- SECCIÓN 3: CÓDIGO DE USUARIO ---- */

int main(void) {
    yylex();              /* yylex() es la función que Flex genera por nosotros */
    return 0;
}

int yywrap(void) { return 1; }
