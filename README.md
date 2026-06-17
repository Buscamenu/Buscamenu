# Buscamenú

Repositorio estructural del proyecto Buscamenú.

Este repositorio contiene la base para generar y organizar páginas de restaurantes con menús del día, pensadas para ser servidas como páginas estáticas rápidas.

## Objetivo

Buscamenú permite consultar menús del día de restaurantes cercanos.

La arquitectura prevista separa:

- Datos estables de restaurantes.
- Menús variables recibidos por WhatsApp.
- Plantillas HTML de tarjetas.
- Páginas estáticas generadas para cada restaurante.
- Registro de publicaciones pendientes, procesadas o publicadas.

## Estructura del repositorio

```text
data/
  restaurantes.json
  menus.json
  publicaciones.json

docs/
  arquitectura.md

templates/
  restaurante-template.html

restaurantes/
  ejemplo/
    index.html
