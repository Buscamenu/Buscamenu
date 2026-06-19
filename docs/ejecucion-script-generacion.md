# Ejecución del script demo de generación de ficha

Este documento explica cómo funciona el script:

```text
scripts/generar-ficha-demo.js
```

Su finalidad es demostrar cómo se puede generar automáticamente una ficha HTML de restaurante a partir de la plantilla:

```text
templates/restaurante-template.html
```

## 1. Qué hace el script

El script hace una prueba sencilla:

```text
lee templates/restaurante-template.html
rellena marcadores con datos demo de Casa Pepe Generado
crea restaurantes/casa-pepe-generado/index.html
```

Es decir, convierte esto:

```text
plantilla + datos simulados
```

en esto:

```text
ficha HTML final generada
```

## 2. Archivos implicados

Entrada:

```text
templates/restaurante-template.html
scripts/generar-ficha-demo.js
```

Salida esperada:

```text
restaurantes/casa-pepe-generado/index.html
```

## 3. Importante

El script no se ejecuta automáticamente al guardarlo en GitHub.

GitHub web permite crear y editar archivos, pero no ejecuta scripts de Node.js directamente desde el navegador.

Para ejecutarlo hará falta una de estas opciones:

```text
ordenador local con Node.js
GitHub Actions
Railway
Make llamando a un servicio externo
otro servidor o entorno de automatización
```

## 4. Ejecución local futura

Si se ejecuta en un ordenador con Node.js instalado, el comando sería:

```bash
node scripts/generar-ficha-demo.js
```

Al ejecutarlo correctamente debería aparecer un mensaje parecido a:

```text
Ficha generada correctamente en: .../restaurantes/casa-pepe-generado/index.html
```

Y debería crearse el archivo:

```text
restaurantes/casa-pepe-generado/index.html
```

## 5. Relación con Airtable

En esta demo, los datos están escritos directamente dentro del script.

Ejemplo:

```text
nombre: Casa Pepe Generado
municipio: Hoyo de Manzanares
precio: 12 €
platos: lentejas, ensalada, pollo al ajillo, merluza
```

Más adelante esos datos no estarán escritos a mano, sino que vendrán de Airtable.

Flujo futuro:

```text
Airtable Restaurantes
+ Airtable Menus
→ script o servicio de generación
→ plantilla HTML
→ ficha final restaurantes/{slug}/index.html
```

## 6. Relación con la plantilla

El script sustituye marcadores como:

```text
[RESTAURANTE]
[MUNICIPIO]
[DIRECCION]
[HTML_MENU]
[BOTON_WHATSAPP]
[BLOQUE_IMAGEN_PRINCIPAL]
```

por valores reales.

Ejemplo:

```text
[RESTAURANTE]
→ Casa Pepe Generado
```

```text
[MUNICIPIO]
→ Hoyo de Manzanares
```

```text
[HTML_MENU]
→ bloque HTML completo del menú del día
```

## 7. Por qué es importante esta prueba

Hasta ahora las fichas demo se han creado a mano.

El script demuestra el mecanismo que se usará después para no crear fichas manualmente.

Objetivo futuro:

```text
1. El restaurante envía menú por WhatsApp
2. La IA interpreta el menú
3. Airtable guarda datos limpios
4. El script genera la ficha
5. El sistema actualiza GitHub
6. Netlify publica la web estática
```

## 8. Qué falta para convertirlo en sistema real

Para que este script se convierta en parte del sistema real faltará:

```text
leer datos reales desde Airtable
generar varias fichas en un lote
actualizar data/busqueda-menus-hoy.json
gestionar errores
hacer commit automático en GitHub
evitar publicar un menú si requiere revisión
```

## 9. Relación con la publicación por lotes

Este script genera una ficha individual.

El sistema final deberá generar muchas fichas dentro de un lote.

Ejemplo futuro:

```text
lote-2026-06-19-13-10
→ genera restaurantes/casa-pepe/index.html
→ genera restaurantes/pivo/index.html
→ genera restaurantes/focaccia/index.html
→ actualiza data/busqueda-menus-hoy.json
→ hace un único commit
→ provoca un único deploy
```

## 10. Estado actual

Estado actual de esta parte:

```text
plantilla creada
script demo creado
documentación de ejecución creada
pendiente: decidir dónde se ejecutará realmente
```
