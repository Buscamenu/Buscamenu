# Flujo de publicación por lotes

Este documento describe cómo debe funcionar la publicación de menús en Buscamenú para evitar un despliegue por cada restaurante y permitir actualizaciones agrupadas.

## 1. Principio general

Buscamenú no debe publicar cada menú de forma inmediata con un commit individual.

Regla incorrecta:

```text
1 WhatsApp recibido
→ 1 menú interpretado
→ 1 commit
→ 1 deploy
```

Regla correcta:

```text
muchos menús recibidos
→ muchos menús interpretados
→ publicaciones pendientes
→ lote de publicación
→ 1 commit
→ 1 deploy
```

Esto permite ahorrar recursos, reducir errores y evitar límites de GitHub, Netlify o cualquier sistema de despliegue.

## 2. Flujo completo previsto

El flujo previsto es:

```text
Restaurante envía menú por WhatsApp
→ mensaje entra en Airtable
→ IA interpreta el menú
→ se genera una vista previa
→ se envía vista previa al restaurante
→ se espera un plazo breve de corrección
→ el menú queda confirmado
→ se añade a una cola de publicación
→ varios menús se agrupan en un lote
→ se actualizan fichas HTML y JSON de búsqueda
→ se publica un único lote
```

## 3. Tablas implicadas

Las tablas principales son:

```text
Mensajes
Restaurantes
Menus
Publicaciones
```

### Mensajes

Recoge la entrada original recibida por WhatsApp.

Ejemplos de datos:

```text
teléfono
nombre
mensaje
fecha
raw_json
imagen recibida
```

### Restaurantes

Contiene los datos estables del restaurante.

Ejemplos:

```text
nombre
teléfono WhatsApp
municipio
dirección
slug
categoría
teléfono público
URL de Google Maps
foto principal
logo
geolocalización
```

### Menus

Contiene el menú interpretado y su estado.

Ejemplos:

```text
texto original
JSON menú
HTML menú
texto buscable
platos detectados
precio
estado del menú
publicado
fecha publicación
```

### Publicaciones

Funciona como cola de publicación.

Cada registro indica qué debe publicarse, cuándo y con qué estado.

Ejemplos:

```text
restaurante
menú
tipo de publicación
estado
lote
ruta GitHub
URL pública
intentos
último error
```

## 4. Estados principales del menú

La tabla `Menus` puede usar estados como:

```text
recibido
interpretando
interpretado
vista_previa_enviada
pendiente_confirmacion
confirmado_por_silencio
confirmado_manual
requiere_correccion
requiere_revision
listo_para_publicar
publicado
sin_menu_hoy
cerrado_habitual
cerrado_excepcional
error_tecnico
```

El objetivo es que solo se publiquen menús suficientemente confirmados.

## 5. Vista previa y plazo de corrección

Después de interpretar el menú, el sistema debe enviar una vista previa al restaurante.

Ejemplo:

```text
Hemos interpretado tu menú de hoy:

Primeros:
- Lentejas
- Ensalada

Segundos:
- Pollo al ajillo
- Merluza

Precio: 12 €

Si hay algún error, responde a este mensaje.
Si no respondes en unos minutos, lo publicaremos automáticamente.
```

Este plazo cumple dos funciones:

```text
1. Permite al restaurante corregir errores.
2. Permite agrupar varias publicaciones en lotes.
```

## 6. Confirmación manual o por silencio

Hay dos formas de confirmar un menú:

```text
confirmado_manual
confirmado_por_silencio
```

### Confirmado manual

El restaurante responde algo como:

```text
ok
correcto
publicar
sí
```

Entonces el menú puede pasar a:

```text
listo_para_publicar
```

### Confirmado por silencio

Si el restaurante no responde dentro del plazo definido, el menú se considera confirmado automáticamente.

Ejemplo:

```text
vista previa enviada a las 13:02
sin respuesta hasta las 13:05
→ confirmado_por_silencio
→ listo_para_publicar
```

El plazo exacto puede ajustarse más adelante.

## 7. Creación de publicación pendiente

Cuando un menú queda listo, se crea un registro en `Publicaciones`.

Ejemplo:

```text
PUB1 ID publicación: pub-casa-pepe-2026-06-19
PUB2 Restaurante: Casa Pepe
PUB3 Menu: casa-pepe-2026-06-19
PUB4 Slug restaurante: casa-pepe
PUB5 Tipo publicación: menu_actualizado
PUB6 Estado publicación: pendiente
PUB11 Ruta GitHub: restaurantes/casa-pepe/index.html
PUB12 URL pública: /restaurantes/casa-pepe/
PUB13 Intentos: 0
```

## 8. Agrupación en lote

Cada cierto tiempo, el sistema busca publicaciones pendientes.

Ejemplo de criterio:

```text
PUB6 Estado publicación = pendiente
```

Después las agrupa en un lote.

Ejemplo de lote:

```text
lote-2026-06-19-13-10
```

Las publicaciones pasan a:

```text
agrupado_en_lote
```

y se les asigna:

```text
PUB7 ID lote = lote-2026-06-19-13-10
```

## 9. Archivos que puede modificar un lote

Un lote puede modificar varios tipos de archivo.

### Fichas de restaurantes

Ejemplo:

```text
restaurantes/casa-pepe/index.html
restaurantes/pivo/index.html
restaurantes/focaccia/index.html
```

Cada ficha se genera desde:

```text
templates/restaurante-template.html
```

sustituyendo marcadores por datos reales.

### JSON de búsqueda

El lote también actualiza:

```text
data/busqueda-menus-hoy.json
```

Este archivo alimenta:

```text
buscar/index.html
```

### Otros archivos futuros

Más adelante podrían generarse:

```text
data/historico-menus.json
data/restaurantes-activos.json
sitemap.xml
```

Pero no son necesarios en la primera fase.

## 10. Commit único por lote

Cuando el lote está preparado, se hace un único commit.

Ejemplo de mensaje:

```text
Actualizar menús lote 2026-06-19 13:10
```

Ese commit puede incluir:

```text
3 fichas actualizadas
1 JSON de búsqueda actualizado
```

pero sigue siendo un solo commit y, por tanto, un solo deploy.

## 11. Estados de publicación

La tabla `Publicaciones` puede usar estos estados:

```text
pendiente
agrupado_en_lote
publicando
publicado
fallido
requiere_revision
```

Flujo normal:

```text
pendiente
→ agrupado_en_lote
→ publicando
→ publicado
```

Flujo con error:

```text
pendiente
→ agrupado_en_lote
→ publicando
→ fallido
```

Si falla, se debe guardar información en:

```text
PUB14 Último error
PUB13 Intentos
```

## 12. Manejo de errores

Si falla la generación o publicación, no se debe perder el menú.

Debe quedar registrado:

```text
qué publicación falló
qué lote falló
cuántos intentos lleva
cuál fue el error
```

Ejemplo:

```text
PUB6 Estado publicación = fallido
PUB13 Intentos = 1
PUB14 Último error = Error al escribir restaurantes/casa-pepe/index.html
```

Después podrá reintentarse o revisarse manualmente.

## 13. Ventajas del sistema por lotes

El sistema por lotes permite:

```text
reducir despliegues
evitar límites de GitHub
evitar consumo excesivo de Netlify
agrupar cambios de muchos restaurantes
mantener trazabilidad
reintentar errores
publicar más rápido en horas punta
```

## 14. Ejemplo de hora punta

Supongamos que entre las 12:30 y las 13:00 envían menú 80 restaurantes.

Flujo incorrecto:

```text
80 restaurantes
→ 80 commits
→ 80 deploys
```

Flujo correcto:

```text
80 restaurantes
→ menús interpretados y confirmados
→ lotes cada pocos minutos
→ por ejemplo 10 commits/deploys o menos
```

Incluso puede ajustarse para publicar:

```text
cada 2 minutos
cada 5 minutos
según volumen
según estado de confirmación
```

## 15. Relación con el usuario final

El usuario final no ve Airtable, Make, Railway ni la IA.

El usuario final solo ve:

```text
buscador público
fichas actualizadas
menús del día
```

Por eso la publicación debe terminar siempre en archivos públicos estáticos.

## 16. Relación con producción

El laboratorio es:

```text
Buscamenu / Buscamenu
```

La producción es:

```text
Buscamenu / buscamenu-web
```

Los cambios se preparan en laboratorio y solo se pasan a producción cuando estén revisados.

En producción no se debe tocar innecesariamente:

```text
netlify/functions/whatsapp-webhook.js
variables de entorno
configuración de Netlify
configuración de Meta
```

## 17. Regla final

La regla de arquitectura para publicación es:

```text
interpretar rápido
confirmar con seguridad
publicar agrupado
servir estático
```

En forma resumida:

```text
WhatsApp
→ Airtable
→ IA
→ vista previa
→ confirmación
→ cola
→ lote
→ GitHub
→ Netlify
→ buscador y ficha pública
```
