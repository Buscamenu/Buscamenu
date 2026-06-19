# Mapa de marcadores de la plantilla de restaurante

Este documento explica la relación entre los campos internos de Airtable y los marcadores usados en la plantilla:

```text
templates/restaurante-template.html
```

La finalidad es que una automatización pueda generar fichas públicas de restaurante sustituyendo cada marcador por el dato correspondiente.

## 1. Plantilla base

La plantilla reutilizable está en:

```text
templates/restaurante-template.html
```

No es una página final. Es un molde.

La ficha final de cada restaurante se generará en una ruta como:

```text
restaurantes/{slug}/index.html
```

Ejemplo:

```text
restaurantes/casa-pepe-demo/index.html
```

## 2. Regla general

El sistema debe seguir este flujo:

```text
Airtable
→ datos del restaurante
→ datos del menú
→ sustitución de marcadores
→ HTML final
→ GitHub
→ Netlify
```

La web pública no debe consultar Airtable directamente.

## 3. Marcadores de datos del restaurante

| Marcador                    | Origen Airtable                             | Explicación                                |
| --------------------------- | ------------------------------------------- | ------------------------------------------ |
| `[RESTAURANTE]`             | `Restaurantes · OB1 Nombre del restaurante` | Nombre público del restaurante.            |
| `[MUNICIPIO]`               | `Restaurantes · OB3 Municipio`              | Municipio donde está el restaurante.       |
| `[DIRECCION]`               | `Restaurantes · OP1 Dirección`              | Dirección visible del restaurante.         |
| `[TELEFONO_PUBLICO]`        | `Restaurantes · OP3 Teléfono público`       | Teléfono mostrado en la ficha.             |
| `[SLUG]`                    | `Restaurantes · OP10 id Carpeta GitHub`     | Identificador usado en la URL pública.     |
| `[CATEGORIA]`               | `Restaurantes · OP9 Categoría cocina`       | Tipo de cocina o categoría comercial.      |
| `[DESCRIPCION_RESTAURANTE]` | Campo futuro o texto generado               | Breve descripción pública del restaurante. |
| `[META_DESCRIPCION]`        | Texto generado                              | Descripción SEO de la ficha.               |

## 4. Marcadores de estado público

| Marcador                | Origen                                  | Explicación                                                            |
| ----------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `[TIPO_PAGINA]`         | Valor fijo o generado                   | Por ejemplo: `Ficha de restaurante`.                                   |
| `[ESTADO_MENU_PUBLICO]` | `Menus · MEN6 Estado menú` transformado | Texto público: `Menú actualizado`, `Sin menú hoy`, `Cerrado hoy`, etc. |
| `[MENSAJE_ESTADO]`      | `Menus · MEN6 Estado menú` transformado | Mensaje visible en la cabecera de la ficha.                            |

Ejemplos:

```text
MEN6 = publicado
→ [ESTADO_MENU_PUBLICO] = Menú actualizado
→ [MENSAJE_ESTADO] = Menú del día disponible

MEN6 = sin_menu_hoy
→ [ESTADO_MENU_PUBLICO] = Sin menú hoy
→ [MENSAJE_ESTADO] = Este restaurante no ha publicado menú hoy

MEN6 = cerrado_habitual
→ [ESTADO_MENU_PUBLICO] = Cerrado hoy
→ [MENSAJE_ESTADO] = Cerrado por descanso habitual
```

## 5. Marcadores de imagen principal

| Marcador                    | Origen Airtable                                                                 | Explicación                                             |
| --------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `[BLOQUE_IMAGEN_PRINCIPAL]` | `Restaurantes · OP17 Tipo imagen principal`, `OP18 Foto principal`, `OP19 Logo` | Bloque HTML completo de imagen, logo o imagen genérica. |

La automatización debe decidir qué HTML insertar según el valor de `OP17 Tipo imagen principal`.

### Caso 1: foto del restaurante

Si:

```text
OP17 Tipo imagen principal = foto_restaurante
OP18 Foto principal = URL válida
```

Entonces insertar:

```html
<img class="restaurant-photo" src="[OP18 Foto principal]" alt="[RESTAURANTE]">
```

### Caso 2: logo del restaurante

Si:

```text
OP17 Tipo imagen principal = logo_restaurante
OP19 Logo = URL válida
```

Entonces insertar un bloque visual con el logo.

### Caso 3: imagen genérica Buscamenú

Si:

```text
OP17 Tipo imagen principal = generica_buscamenu
```

Entonces insertar un bloque genérico:

```html
<div class="generic-image">
  <div>
    <div class="icon">🍽️</div>
    <h2>[RESTAURANTE]</h2>
    <p>Imagen genérica Buscamenú</p>
  </div>
</div>
```

## 6. Marcadores de botones

| Marcador           | Origen Airtable                                                     | Explicación                       |
| ------------------ | ------------------------------------------------------------------- | --------------------------------- |
| `[BOTON_WHATSAPP]` | `Restaurantes · OP5 WhatsApp de reservas` o `OB2 Teléfono WhatsApp` | Botón para escribir por WhatsApp. |
| `[BOTON_LLAMAR]`   | `Restaurantes · OP3 Teléfono público`                               | Botón para llamar.                |
| `[BOTON_MAPS]`     | `Restaurantes · OP14 Google Maps URL`                               | Botón para abrir el mapa.         |
| `[BOTON_CARTA]`    | `Restaurantes · OP16 URL carta`                                     | Botón para ver carta si existe.   |

Si un campo está vacío, el botón correspondiente no debe mostrarse.

Ejemplo:

```text
OP16 URL carta vacío
→ no insertar [BOTON_CARTA]
```

## 7. Marcadores de menú

| Marcador      | Origen Airtable           | Explicación                      |
| ------------- | ------------------------- | -------------------------------- |
| `[HTML_MENU]` | `Menus · MEN11 HTML menú` | HTML ya limpio del menú del día. |

El campo `MEN11 HTML menú` debe contener el bloque completo del menú ya interpretado por IA.

Ejemplo:

```html
<section class="menu-dia">
  <div class="menu-title-row">
    <div>
      <p class="eyebrow">Menú de hoy</p>
      <h2>Menú del día</h2>
    </div>
    <div class="price">12 €</div>
  </div>

  <div class="menu-grid">
    <section class="menu-section">
      <h3>Primeros</h3>
      <ul>
        <li>Lentejas</li>
        <li>Ensalada</li>
      </ul>
    </section>

    <section class="menu-section">
      <h3>Segundos</h3>
      <ul>
        <li>Pollo al ajillo</li>
        <li>Merluza</li>
      </ul>
    </section>
  </div>

  <div class="included">Incluye postre o café.</div>
</section>
```

## 8. Marcadores de histórico

| Marcador           | Origen                                 | Explicación                                     |
| ------------------ | -------------------------------------- | ----------------------------------------------- |
| `[HTML_HISTORICO]` | Menús anteriores del mismo restaurante | Bloque con menús recientes o aviso provisional. |

En una primera fase puede insertarse un bloque simple:

```html
<div class="history-item">
  <span>Histórico pendiente</span>
  <strong>Próximamente</strong>
</div>
```

Más adelante podrá generarse desde la tabla `Menus`, filtrando por restaurante y fechas anteriores.

## 9. Relación con el JSON de búsqueda

Además de generar la ficha HTML, la automatización debe actualizar:

```text
data/busqueda-menus-hoy.json
```

Ese JSON debe contener solo los datos necesarios para el buscador público:

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

El JSON no sustituye a la ficha. Solo alimenta el buscador.

## 10. Resultado final esperado

Para cada restaurante con menú publicado, el sistema debe generar o actualizar:

```text
restaurantes/{slug}/index.html
```

y actualizar:

```text
data/busqueda-menus-hoy.json
```

Ejemplo:

```text
Restaurante Casa Pepe
→ OP10 id Carpeta GitHub = casa-pepe
→ ficha final = restaurantes/casa-pepe/index.html
→ URL pública = /restaurantes/casa-pepe/
```

## 11. Principio de automatización

La automatización no debe modificar a mano cada página.

Debe hacer sustituciones controladas:

```text
[RESTAURANTE] → OB1 Nombre del restaurante
[MUNICIPIO] → OB3 Municipio
[HTML_MENU] → MEN11 HTML menú
[BOTON_MAPS] → bloque HTML si OP14 existe
```

Si un dato no existe, debe insertarse un valor seguro o no mostrarse el bloque.

Ejemplo:

```text
sin teléfono público
→ no mostrar botón de llamada
```

## 12. Archivos relacionados

```text
templates/restaurante-template.html
docs/flujo-buscador-y-fichas.md
data/busqueda-menus-hoy.json
buscar/index.html
restaurantes/casa-pepe-demo/index.html
restaurantes/pivo-demo/index.html
restaurantes/focaccia-demo/index.html
```
