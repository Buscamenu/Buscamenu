# Arquitectura de Buscamenú

## 1. Función de este repositorio

Este repositorio `Buscamenu` está pensado como la base estructural del producto Buscamenú: tarjetas de restaurantes, plantillas, páginas estáticas, datos auxiliares y futura integración con procesos automáticos como Make.

No debe confundirse con el repositorio `buscamenu-web`, que se está usando en la fase inicial para pruebas técnicas, Meta, Netlify, webhooks y Airtable.

## 2. Repositorios

### `buscamenu-web`

Repositorio operativo de fase 1.

Uso actual:

- Landing inicial.
- Página de privacidad.
- Webhook de WhatsApp.
- Integración Meta → Netlify → Airtable.
- Producción limitada inicial, si procede.

Estructura conocida:

```text
buscamenu-web/
  index.html
  privacy.html
  netlify/
    functions/
      whatsapp-webhook.js
