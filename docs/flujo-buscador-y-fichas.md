# Flujo buscador y fichas públicas de Buscamenú

Este documento describe el funcionamiento previsto de la parte pública de Buscamenú: la página de búsqueda de menús, el archivo de datos estático y las fichas individuales de restaurantes.

## 1. Objetivo

Buscamenú debe permitir que un usuario entre en la página de un municipio, busque por restaurante, plato o precio, y llegue a la ficha pública del restaurante correspondiente.

Ejemplo de flujo:

```text
Página del pueblo
→ Buscador de menús
→ Resultados filtrados
→ Ficha del restaurante
```

Ejemplo concreto:

```text
Usuario busca "pollo"
→ aparece Casa Pepe Demo
→ pulsa "Ver menú"
→ entra en /restaurantes/casa-pepe-demo/
```

## 2. Archivos principales

En esta fase de laboratorio se están usando estos archivos:

```text
buscar/index.html
data/busqueda-menus-hoy.json
restaurantes/casa-pepe-demo/index.html
restaurantes/pivo-demo/index.html
restaurantes/focaccia-demo/index.html
```

### `buscar/index.html`

Es la página visual del buscador del municipio.

Actualmente representa la página de búsqueda de Hoyo de Manzanares e incluye:

```text
cabecera del municipio
caja de búsqueda
mapa visual provisional
resultados
enlaces a fichas de restaurantes
bloque de contacto
```

En esta fase, el mapa todavía no es un mapa real. Es una representación visual provisional. Más adelante los marcadores se pintarán con latitud y longitud reales.

### `data/busqueda-menus-hoy.json`

Es el archivo de datos que alimenta el buscador.

Contiene una lista de restaurantes con sus menús disponibles para el día, platos, palabras clave, precio y URL de ficha.

Ejemplo simplificado:

```json
[
  {
    "restaurante": "Casa Pepe Demo",
    "slug": "casa-pepe-demo",
    "municipio": "Hoyo de Manzanares",
    "url": "/restaurantes/casa-pepe-demo/",
    "estado_menu": "actualizado",
    "lat": 40.62265,
    "lng": -3.90789,
    "titulo_menu": "Menú del día",
    "precio_desde": 12,
    "precio_hasta": 12,
    "platos": [
      "lentejas",
      "ensalada",
      "pollo al ajillo",
      "merluza"
    ],
    "keywords": [
      "pollo",
      "lentejas",
      "merluza",
      "pescado",
      "carne"
    ],
    "etiquetas": [
      "menu_del_dia",
      "carne",
      "pescado"
    ]
  }
]
```

### `restaurantes/{slug}/index.html`

Cada restaurante tiene una ficha pública individual.

Ejemplos:

```text
/restaurantes/casa-pepe-demo/
/restaurantes/pivo-demo/
/restaurantes/focaccia-demo/
```

Cada ficha muestra:

```text
nombre del restaurante
municipio
tipo de menú
precio
platos
botones de contacto
imagen genérica o futura foto/logo
histórico provisional
```

## 3. Funcionamiento actual del buscador

La página `buscar/index.html` carga el archivo:

```text
../data/busqueda-menus-hoy.json
```

Después permite filtrar por:

```text
restaurante
plato o palabra clave
precio máximo
```

Ejemplos de búsquedas esperadas:

```text
pollo → Casa Pepe Demo
salmón → Pivo Demo
burrata → Focaccia Demo
precio hasta 10 → Focaccia Demo
precio hasta 12 → Casa Pepe Demo + Focaccia Demo
precio hasta 20 → Casa Pepe Demo + Pivo Demo + Focaccia Demo
```

## 4. Relación con Airtable

Airtable no debe ser consultado directamente por los usuarios públicos.

Airtable funcionará como zona interna de gestión:

```text
Restaurantes
Menus
Publicaciones
Mensajes
```

La web pública debe leer archivos estáticos ya preparados.

Flujo previsto:

```text
Airtable
→ IA / Make / script
→ genera HTML de fichas
→ genera data/busqueda-menus-hoy.json
→ GitHub / Netlify
→ usuario consulta la web estática
```

Esto evita que cada visita pública dependa de Airtable, Make o la IA.

## 5. Relación entre `Menus` y el JSON de búsqueda

La tabla `Menus` contiene los datos internos de cada menú:

```text
texto original
JSON menú
HTML menú
texto buscable
platos detectados
ingredientes / palabras clave
etiquetas
estado del menú
publicado o no publicado
```

A partir de esos campos se generará el archivo:

```text
data/busqueda-menus-hoy.json
```

Ese archivo es más ligero que Airtable y está pensado solo para la búsqueda pública.

## 6. Relación entre `Publicaciones` y las fichas

La tabla `Publicaciones` sirve como cola de publicación.

Ejemplo:

```text
Un menú queda listo para publicar
→ se crea una publicación pendiente
→ se agrupa en un lote
→ se actualiza la ficha del restaurante
→ se actualiza el JSON de búsqueda
→ se publica el lote
```

Esto permite evitar un deploy por cada menú recibido.

## 7. Geolocalización

Cada restaurante deberá tener coordenadas precisas:

```text
latitud
longitud
estado de geolocalización
dirección normalizada
Google Place ID
geolocalización revisada
```

La idea es que la dirección se pueda geolocalizar automáticamente y después verificar manualmente.

El mapa público no debe geolocalizar direcciones en cada visita. Debe limitarse a pintar coordenadas ya guardadas.

Flujo previsto:

```text
dirección del restaurante
→ geolocalización automática
→ revisión visual
→ latitud/longitud guardadas
→ JSON público
→ marcador en mapa
```

## 8. Estado actual del laboratorio

En este momento el laboratorio contiene tres restaurantes demo:

```text
Casa Pepe Demo
Pivo Demo
Focaccia Demo
```

Cada uno representa un caso distinto:

```text
Casa Pepe Demo → menú clásico
Pivo Demo → menú con precio variable
Focaccia Demo → plato destacado
```

Esto permite comprobar que el buscador no depende de un único tipo de menú.

## 9. Traslado futuro a producción

El repositorio de laboratorio es:

```text
Buscamenu / Buscamenu
```

El repositorio conectado a Netlify y a `buscamenu.es` es:

```text
Buscamenu / buscamenu-web
```

Para ahorrar créditos de Netlify, los cambios se preparan primero en laboratorio.

Cuando estén revisados, se copiarán a producción en un único bloque:

```text
buscar/index.html
data/busqueda-menus-hoy.json
restaurantes/pivo-demo/index.html
restaurantes/focaccia-demo/index.html
```

Casa Pepe Demo ya existe en producción, aunque podría actualizarse si se quiere homogeneizar.

## 10. Principio general

La arquitectura pública debe seguir esta regla:

```text
generar antes
servir estático
actualizar por lotes
```

Es decir:

```text
Airtable / IA / Make
→ preparan datos y páginas
→ GitHub / Netlify publica archivos estáticos
→ usuarios consultan páginas rápidas sin depender del backend
```
