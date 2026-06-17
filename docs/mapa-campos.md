# Mapa de campos de Buscamenú

Este documento relaciona los campos visibles en Airtable con los datos que necesitarán las tarjetas de restaurante, los archivos JSON y los futuros procesos de Make.

## 1. Tabla Airtable: Restaurantes

La tabla `Restaurantes` contiene los datos estables o semiestables de cada restaurante.

No debe contener los platos del menú del día. Los menús se gestionan en otra tabla o estructura separada.

## 2. Campos principales

| Uso en la tarjeta                  | Campo Airtable             | Nombre técnico sugerido | Observaciones                                                                                 |
| ---------------------------------- | -------------------------- | ----------------------- | --------------------------------------------------------------------------------------------- |
| Nombre del restaurante             | OB1 Nombre del restaurante | nombre                  | Campo principal de Airtable                                                                   |
| Teléfono WhatsApp inicial/contacto | OB2 Teléfono WhatsApp      | telefono_whatsapp       | Puede usarse para identificar mensajes entrantes                                              |
| Municipio                          | OB3 Municipio              | municipio               | Ejemplo: San Lorenzo de El Escorial                                                           |
| Activo                             | Activo                     | activo                  | Indica si el restaurante debe publicarse                                                      |
| Dirección                          | OP1 Dirección              | direccion               | Dirección visible en la tarjeta                                                               |
| Código postal                      | OP2 CP                     | codigo_postal           | CP del restaurante                                                                            |
| Teléfono público                   | OP3 Teléfono público       | telefono_publico        | Teléfono visible general                                                                      |
| Teléfono de reservas               | OP4 Teléfono de reservas   | telefono_reservas       | Puede coincidir con el público                                                                |
| WhatsApp de reservas               | OP5 WhatsApp de reservas   | whatsapp_reservas       | Para botón WhatsApp de reservas                                                               |
| Email general                      | OP6 email                  | email                   | Email visible o de contacto                                                                   |
| Email reservas                     | OP7 email reservas         | email_reservas          | Si existe un email específico                                                                 |
| Web restaurante                    | OP8 Web                    | web                     | Web general del restaurante                                                                   |
| Categoría cocina                   | OP9 Categoría cocina       | categoria_cocina        | Ejemplo: tradicional, italiana, asiática                                                      |
| Carpeta GitHub / slug              | OP10 id Carpeta GitHub     | slug                    | Ejemplo: casa-pepe                                                                            |
| Idiomas                            | OP11 idiomas               | idiomas                 | Idiomas disponibles                                                                           |
| Comunidad bilingüe                 | OP12 Comunidad bilingüe    | comunidad_bilingue      | Uso futuro                                                                                    |
| Idioma local                       | OP13 idioma local          | idioma_local            | Uso futuro                                                                                    |
| Google Maps                        | OP14 Google Maps URL       | google_maps_url         | Botón de ubicación                                                                            |
| URL pública Buscamenú              | OP15 URL pública Buscamenú | url_publica_buscamenu   | Página del restaurante en Buscamenú                                                           |
| URL carta                          | OP16 URL carta             | url_carta               | Carta digital, PDF o web de carta                                                             |
| Tipo imagen principal              | OP17 Tipo imagen principal | tipo_imagen_principal   | Selección: foto_restaurante, logo_restaurante, generica_buscamenu, demo_ajedrezado, pendiente |
| Foto principal                     | OP18 Foto principal URL    | foto_principal_url      | URL de imagen ya publicada                                                                    |
| Logo restaurante                   | OP19 Logo URL              | logo_url                | URL del logo si existe                                                                        |

## 3. Imagen principal

El campo `OP17 Tipo imagen principal` decide qué imagen se muestra en la tarjeta.

Valores previstos:

| Valor interno      | Uso                                                             |
| ------------------ | --------------------------------------------------------------- |
| foto_restaurante   | Usar la foto real del restaurante                               |
| logo_restaurante   | Usar el logo del restaurante                                    |
| generica_buscamenu | Usar imagen genérica de Buscamenú con el nombre del restaurante |
| demo_ajedrezado    | Usar imagen de demostración tipo restaurante genérico           |
| pendiente          | Estado interno pendiente de decisión                            |

Regla recomendada:

* Restaurantes reales sin foto ni logo: `generica_buscamenu`.
* Restaurante de ejemplo/demo: `demo_ajedrezado`.
* Restaurante con foto real: `foto_restaurante`.
* Restaurante con logo pero sin foto: `logo_restaurante`.

## 4. URLs y rutas

Hay que distinguir tres conceptos:

| Concepto                            | Campo                      | Ejemplo                                      |
| ----------------------------------- | -------------------------- | -------------------------------------------- |
| Web propia del restaurante          | OP8 Web                    | https://restaurantepepe.com                  |
| Carta del restaurante               | OP16 URL carta             | https://restaurantepepe.com/carta            |
| Página del restaurante en Buscamenú | OP15 URL pública Buscamenú | https://buscamenu.es/restaurantes/casa-pepe/ |

La ruta interna en GitHub puede calcularse desde `OP10 id Carpeta GitHub`.

Ejemplo:

```text
OP10 id Carpeta GitHub = casa-pepe
```

Entonces:

```text
Ruta GitHub = restaurantes/casa-pepe/index.html
URL pública = https://buscamenu.es/restaurantes/casa-pepe/
```

## 5. Tabla Menus

Los datos del menú del día no deben estar en `Restaurantes`.

La tabla o estructura `Menus` debe contener información variable:

| Uso                             | Campo sugerido      |
| ------------------------------- | ------------------- |
| Restaurante asociado            | restaurante_slug    |
| Fecha del menú                  | fecha_menu          |
| Estado                          | estado              |
| Hay menú hoy                    | tiene_menu_hoy      |
| Texto original recibido         | texto_original      |
| Interpretación flexible         | json_menu           |
| HTML ya preparado para insertar | html_menu           |
| Precio mínimo                   | precio_desde        |
| Precio máximo                   | precio_hasta        |
| Imagen original del menú        | imagen_original_url |
| Revisión humana                 | requiere_revision   |
| Publicado                       | publicado           |

## 6. Estados posibles del menú

| Estado            | Significado                        |
| ----------------- | ---------------------------------- |
| pendiente         | Recibido pero no procesado         |
| procesando        | En proceso de interpretación       |
| procesado         | Interpretado por IA                |
| publicado         | Ya incorporado a la tarjeta        |
| requiere_revision | Necesita revisión humana           |
| sin_menu_hoy      | No hay menú disponible todavía     |
| cerrado           | Restaurante cerrado o sin servicio |
| error             | Error de procesamiento             |

## 7. Módulos de la tarjeta

La tarjeta del restaurante se divide en módulos.

### Módulo 1: Restaurante

Procede de la tabla `Restaurantes`.

Incluye:

* Nombre.
* Dirección.
* Municipio.
* Teléfonos.
* Email.
* Web.
* Carta.
* Google Maps.
* Imagen principal.

### Módulo 2: Menú de hoy

Procede de `Menus`.

Puede mostrar:

* Menú clásico.
* Varios menús.
* Plato del día.
* Sugerencias.
* Menú con precio variable.
* Aviso de que todavía no hay menú.
* Aviso de cerrado.

### Módulo 3: Histórico

Procede de registros anteriores de `Menus`.

Debe mostrar menús recientes, por ejemplo de los últimos 15 días.

Si no hay menú hoy, este módulo ayuda al usuario a hacerse una idea del restaurante.

## 8. Principio técnico

La tarjeta pública no debe consultar Airtable en cada visita.

La página debe generarse previamente y servirse como HTML estático.

Flujo deseado:

```text
Airtable / WhatsApp / Make / IA
→ generación de HTML o JSON
→ GitHub / Netlify
→ usuario ve página estática rápida
```
