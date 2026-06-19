# Checklist de traslado a producción

Este documento recoge los pasos para trasladar cambios desde el repositorio de laboratorio al repositorio de producción de Buscamenú sin tocar elementos sensibles.

## 1. Repositorios

Repositorio de laboratorio:

```text
Buscamenu / Buscamenu
```

Uso:

```text
preparar
probar estructura
documentar
crear plantillas
crear demos
```

Repositorio de producción:

```text
Buscamenu / buscamenu-web
```

Uso:

```text
web publicada en buscamenu.es
Netlify
dominio real
función webhook de WhatsApp
configuración usada por Meta
```

## 2. Regla principal

No se debe usar producción como laboratorio.

Regla correcta:

```text
preparar en Buscamenu / Buscamenu
revisar
copiar solo archivos necesarios
hacer un único commit en buscamenu-web
esperar un único deploy de Netlify
probar en buscamenu.es
```

Regla incorrecta:

```text
hacer muchos cambios pequeños directamente en buscamenu-web
hacer varios commits de prueba
gastar varios deploys de Netlify
arriesgar el webhook de Meta
```

## 3. Archivos que se pueden trasladar

En esta fase, los archivos candidatos para pasar a producción son:

```text
buscar/index.html
data/busqueda-menus-hoy.json
restaurantes/pivo-demo/index.html
restaurantes/focaccia-demo/index.html
```

Opcionalmente, si se quiere homogeneizar la ficha ya existente:

```text
restaurantes/casa-pepe-demo/index.html
```

## 4. Archivos que no deben tocarse

No modificar en producción durante este traslado:

```text
netlify/functions/whatsapp-webhook.js
index.html
privacy.html
package.json
netlify.toml
```

Tampoco tocar:

```text
variables de entorno de Netlify
configuración de dominio
configuración de Meta
webhooks de Meta
tokens
Airtable
```

## 5. Comprobación antes de copiar

Antes de copiar a producción, comprobar que en laboratorio existen:

```text
buscar/index.html
data/busqueda-menus-hoy.json
restaurantes/casa-pepe-demo/index.html
restaurantes/pivo-demo/index.html
restaurantes/focaccia-demo/index.html
templates/restaurante-template.html
docs/flujo-buscador-y-fichas.md
docs/mapa-marcadores-template.md
docs/flujo-publicacion-por-lotes.md
```

También comprobar que el archivo:

```text
data/busqueda-menus-hoy.json
```

contiene las rutas correctas:

```text
/restaurantes/casa-pepe-demo/
/restaurantes/pivo-demo/
/restaurantes/focaccia-demo/
```

## 6. Copia a producción

En `buscamenu-web`, copiar o sustituir solo estos archivos:

```text
buscar/index.html
data/busqueda-menus-hoy.json
restaurantes/pivo-demo/index.html
restaurantes/focaccia-demo/index.html
```

Si se decide actualizar Casa Pepe Demo:

```text
restaurantes/casa-pepe-demo/index.html
```

No crear rutas duplicadas como:

```text
restaurantes/restaurantes/pivo-demo/index.html
```

La ruta correcta es:

```text
restaurantes/pivo-demo/index.html
```

## 7. Commit recomendado

Mensaje de commit para producción:

```text
Actualizar buscador y demos de menús
```

Ese commit debería incluir todos los archivos del traslado.

No hacer un commit por archivo.

## 8. Qué debe ocurrir después del commit

Al hacer commit en `buscamenu-web`, Netlify debería lanzar un deploy automático.

Después del deploy, comprobar:

```text
https://buscamenu.es/buscar/
https://buscamenu.es/data/busqueda-menus-hoy.json
https://buscamenu.es/restaurantes/casa-pepe-demo/
https://buscamenu.es/restaurantes/pivo-demo/
https://buscamenu.es/restaurantes/focaccia-demo/
```

## 9. Pruebas del buscador

En:

```text
https://buscamenu.es/buscar/
```

probar:

```text
pollo
salmón
burrata
```

Resultados esperados:

```text
pollo → Casa Pepe Demo
salmón → Pivo Demo
burrata → Focaccia Demo
```

Probar precio máximo:

```text
10 → Focaccia Demo
12 → Casa Pepe Demo + Focaccia Demo
20 → Casa Pepe Demo + Pivo Demo + Focaccia Demo
```

## 10. Pruebas de enlaces

En cada resultado del buscador, pulsar:

```text
Ver menú
```

Debe abrir:

```text
Casa Pepe Demo → /restaurantes/casa-pepe-demo/
Pivo Demo → /restaurantes/pivo-demo/
Focaccia Demo → /restaurantes/focaccia-demo/
```

## 11. Comprobación de que no se ha roto WhatsApp

Después del traslado, comprobar que sigue existiendo:

```text
https://buscamenu.es/.netlify/functions/whatsapp-webhook
```

No es necesario tocar la configuración de Meta si el webhook no se ha modificado.

El traslado de buscador y fichas no debería afectar al webhook porque son archivos estáticos separados.

## 12. Si algo falla

Si falla el buscador:

```text
revisar data/busqueda-menus-hoy.json
revisar rutas url dentro del JSON
revisar consola del navegador
revisar que buscar/index.html esté en la ruta correcta
```

Si falla una ficha:

```text
revisar que exista restaurantes/{slug}/index.html
revisar que el slug del JSON coincida con la carpeta
```

Si falla Netlify:

```text
revisar deploy log
no tocar Meta
no tocar webhook
no cambiar variables de entorno
```

## 13. Regla de seguridad

Antes de tocar producción, preguntarse:

```text
¿Este cambio afecta al webhook?
¿Este cambio afecta a Meta?
¿Este cambio afecta a variables de entorno?
¿Este cambio afecta a la home?
¿Este cambio es necesario para ver buscador/fichas?
```

Si la respuesta es dudosa, no tocar el archivo.

## 14. Resumen

Traslado seguro:

```text
4 o 5 archivos estáticos
1 commit
1 deploy
pruebas manuales
sin tocar webhook
sin tocar Meta
sin tocar variables
```

Objetivo:

```text
ver en buscamenu.es el buscador mejorado
ver tres restaurantes demo
comprobar búsquedas por plato y precio
mantener intacta la integración WhatsApp/Meta
```
