# Buscamenú

Repositorio de laboratorio y preparación del proyecto **Buscamenú**.

Buscamenú es una plataforma para publicar, buscar y consultar menús del día de restaurantes de forma sencilla. El objetivo es que los restaurantes puedan enviar su menú por WhatsApp y que el sistema genere una ficha pública actualizada y un buscador de menús para los usuarios.

## 1. Objetivo del proyecto

El objetivo principal es permitir que un usuario pueda:

```text
entrar en la página de un municipio
→ buscar por restaurante, plato o precio
→ ver resultados de menús disponibles
→ abrir la ficha pública del restaurante
```

Ejemplo:

```text
Usuario busca "pollo"
→ aparece Casa Pepe Demo
→ pulsa "Ver menú"
→ entra en /restaurantes/casa-pepe-demo/
```

## 2. Estado de este repositorio

Este repositorio funciona como **laboratorio**.

Aquí se preparan:

```text
estructuras de datos
fichas demo
buscador público
plantillas HTML
documentación técnica
flujo de publicación
```

Este repositorio no es el repositorio conectado directamente a Netlify.

El repositorio de producción es:

```text
Buscamenu / buscamenu-web
```

La producción está vinculada a:

```text
buscamenu.es
Netlify
webhook de WhatsApp
configuración de Meta
```

Por tanto, los cambios se preparan primero aquí y solo se trasladan a producción cuando estén revisados.

## 3. Estructura principal

La estructura actual del repositorio es:

```text
buscar/
data/
docs/
restaurantes/
templates/
README.md
```

## 4. Buscador público

El buscador está en:

```text
buscar/index.html
```

Es una página visual de búsqueda de menús para un municipio.

Actualmente representa una demo de Hoyo de Manzanares e incluye:

```text
cabecera del municipio
panel de búsqueda
mapa visual provisional
resultados de menús
enlaces a fichas de restaurantes
bloque de contacto
```

El buscador lee datos desde:

```text
data/busqueda-menus-hoy.json
```

Permite filtrar por:

```text
restaurante
plato o palabra clave
precio máximo
```

## 5. Datos públicos de búsqueda

El archivo principal de datos públicos es:

```text
data/busqueda-menus-hoy.json
```

Contiene los datos mínimos necesarios para alimentar el buscador:

```text
restaurante
slug
municipio
url
fecha_menu
estado_menu
lat
lng
titulo_menu
precio_desde
precio_hasta
platos
keywords
etiquetas
```

Este JSON está pensado para ser servido como archivo estático.

La web pública no debe consultar Airtable directamente.

## 6. Fichas demo de restaurantes

Las fichas demo están en:

```text
restaurantes/casa-pepe-demo/index.html
restaurantes/pivo-demo/index.html
restaurantes/focaccia-demo/index.html
```

Cada una representa un caso distinto:

```text
Casa Pepe Demo → menú clásico
Pivo Demo → menú con precio variable
Focaccia Demo → plato destacado
```

Estas fichas sirven para comprobar que el buscador puede enlazar correctamente a páginas individuales de restaurantes.

## 7. Plantilla reutilizable de restaurante

La plantilla base está en:

```text
templates/restaurante-template.html
```

No es una página final. Es un molde con marcadores como:

```text
[RESTAURANTE]
[MUNICIPIO]
[DIRECCION]
[HTML_MENU]
[BLOQUE_IMAGEN_PRINCIPAL]
[BOTON_WHATSAPP]
[BOTON_MAPS]
```

Más adelante, una automatización sustituirá esos marcadores por datos reales de Airtable y generará una ficha final en:

```text
restaurantes/{slug}/index.html
```

## 8. Documentación

La documentación está en:

```text
docs/
```

Documentos principales:

```text
docs/arquitectura.md
docs/mapa-campos.md
docs/flujo-buscador-y-fichas.md
docs/mapa-marcadores-template.md
docs/flujo-publicacion-por-lotes.md
docs/checklist-traslado-produccion.md
```

Cada documento tiene una función:

```text
arquitectura.md
→ visión general de la arquitectura

mapa-campos.md
→ relación inicial de campos y datos

flujo-buscador-y-fichas.md
→ explica cómo el buscador lee el JSON y enlaza a fichas

mapa-marcadores-template.md
→ relaciona marcadores HTML con campos de Airtable

flujo-publicacion-por-lotes.md
→ explica cómo publicar muchos menús agrupados

checklist-traslado-produccion.md
→ lista de control para pasar cambios a buscamenu-web
```

## 9. Flujo previsto de publicación

El flujo previsto de Buscamenú es:

```text
Restaurante envía menú por WhatsApp
→ mensaje entra en Airtable
→ IA interpreta el menú
→ se genera una vista previa
→ el restaurante puede corregir
→ el menú queda confirmado
→ se añade a una cola de publicación
→ varios menús se agrupan en un lote
→ se generan fichas HTML y JSON de búsqueda
→ se publica un único commit/deploy
```

La regla principal es:

```text
interpretar rápido
confirmar con seguridad
publicar agrupado
servir estático
```

## 10. Publicación por lotes

Buscamenú no debe hacer un despliegue por cada menú recibido.

Regla incorrecta:

```text
1 WhatsApp
→ 1 menú
→ 1 commit
→ 1 deploy
```

Regla correcta:

```text
muchos menús
→ publicaciones pendientes
→ lote
→ 1 commit
→ 1 deploy
```

Esto permite ahorrar recursos, evitar límites de GitHub/Netlify y mantener trazabilidad.

## 11. Relación con Airtable

Airtable funciona como zona interna de gestión.

Tablas previstas o ya creadas:

```text
Restaurantes
Mensajes
Menus
Publicaciones
```

La web pública no debe depender de consultas directas a Airtable.

El flujo correcto es:

```text
Airtable
→ Make / Railway / script
→ archivos HTML y JSON
→ GitHub
→ Netlify
→ web pública
```

## 12. Relación con producción

Este repositorio es:

```text
Buscamenu / Buscamenu
```

Repositorio de laboratorio.

El repositorio de producción es:

```text
Buscamenu / buscamenu-web
```

Antes de pasar cambios a producción hay que revisar:

```text
docs/checklist-traslado-produccion.md
```

En producción no se deben tocar sin necesidad:

```text
netlify/functions/whatsapp-webhook.js
variables de entorno
configuración de Netlify
configuración de Meta
tokens
```

## 13. Archivos candidatos para pasar a producción

En la fase actual, los archivos candidatos a trasladar a producción son:

```text
buscar/index.html
data/busqueda-menus-hoy.json
restaurantes/pivo-demo/index.html
restaurantes/focaccia-demo/index.html
```

Opcionalmente:

```text
restaurantes/casa-pepe-demo/index.html
```

si se quiere homogeneizar la ficha ya existente.

El traslado debe hacerse en un único commit en `buscamenu-web`.

## 14. Principio general de arquitectura

La arquitectura pública debe seguir esta regla:

```text
generar antes
servir estático
actualizar por lotes
```

Es decir:

```text
Airtable / IA / Make / Railway
→ generan datos y páginas
→ GitHub / Netlify publican archivos estáticos
→ usuarios consultan páginas rápidas sin depender del backend
```

## 15. Estado actual del laboratorio

Estado actual:

```text
buscador visual creado
JSON de búsqueda con tres restaurantes demo
fichas demo creadas
plantilla reutilizable creada
documentación técnica y operativa creada
checklist de traslado a producción creada
```

El siguiente paso será decidir si:

* seguir refinando en laboratorio
* crear una prueba de generación automática desde la plantilla
* trasladar el buscador y las demos a producción en un único commit

## 16. Scripts de generación demo

El repositorio incluye una primera capa de scripts de demostración en la carpeta `scripts/`.

Scripts actuales:

* `scripts/generar-ficha-demo.js`
* `scripts/generar-busqueda-demo.js`
* `scripts/generar-lote-demo.js`

Estos scripts no se ejecutan desde GitHub web. Están preparados para ejecutarse en un entorno con Node.js, como un ordenador local, Railway, GitHub Actions u otro servicio de automatización.

Comandos disponibles en `package.json`:

* `npm run generar:ficha-demo`
* `npm run generar:busqueda-demo`
* `npm run generar:lote-demo`

Función de cada comando:

* `generar:ficha-demo`: genera una ficha HTML desde `templates/restaurante-template.html`.
* `generar:busqueda-demo`: genera `data/busqueda-menus-hoy.json` desde datos demo.
* `generar:lote-demo`: ejecuta la generación de ficha y de búsqueda como primera maqueta de publicación por lote.

La finalidad de estos scripts es demostrar el mecanismo futuro:

* datos de restaurante y menú
* plantilla HTML
* ficha pública
* JSON de búsqueda
* publicación agrupada

En el sistema real, los datos vendrán de Airtable y no estarán escritos directamente en los scripts.
.
