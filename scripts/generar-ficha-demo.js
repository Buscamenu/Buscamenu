```js
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const templatePath = path.join(ROOT, "templates", "restaurante-template.html");
const outputDir = path.join(ROOT, "restaurantes", "casa-pepe-generado");
const outputPath = path.join(outputDir, "index.html");

const restaurante = {
  nombre: "Casa Pepe Generado",
  municipio: "Hoyo de Manzanares",
  direccion: "Plaza Mayor, 1",
  telefonoPublico: "910 000 000",
  whatsapp: "34600000000",
  googleMapsUrl: "https://maps.google.com",
  urlCarta: "",
  slug: "casa-pepe-generado",
  categoria: "Cocina casera",
  descripcion:
    "Restaurante demo generado automáticamente desde la plantilla de Buscamenú.",
  tipoImagenPrincipal: "generica_buscamenu"
};

const menu = {
  estado: "publicado",
  titulo: "Menú del día",
  precio: "12 €",
  html: `
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
        <li>Ensalada mixta</li>
      </ul>
    </section>

    <section class="menu-section">
      <h3>Segundos</h3>
      <ul>
        <li>Pollo al ajillo</li>
        <li>Merluza a la romana</li>
      </ul>
    </section>
  </div>

  <div class="included">Incluye pan, bebida, postre o café.</div>
</section>
`
};

function boton(clase, href, texto) {
  if (!href) return "";
  return `<a class="button ${clase}" href="${href}">${texto}</a>`;
}

function bloqueImagenPrincipal(restaurante) {
  if (restaurante.tipoImagenPrincipal === "generica_buscamenu") {
    return `
<div class="generic-image">
  <div>
    <div class="icon">🍽️</div>
    <h2>${restaurante.nombre}</h2>
    <p>Imagen genérica Buscamenú</p>
  </div>
</div>
`;
  }

  return `
<div class="generic-image">
  <div>
    <div class="icon">🍽️</div>
    <h2>${restaurante.nombre}</h2>
    <p>Imagen pendiente</p>
  </div>
</div>
`;
}

function htmlHistorico() {
  return `
<div class="history-item">
  <span>Histórico pendiente</span>
  <strong>Próximamente</strong>
</div>
`;
}

function replaceAllMarkers(template, values) {
  let html = template;

  Object.entries(values).forEach(([marker, value]) => {
    html = html.split(marker).join(value || "");
  });

  return html;
}

function main() {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`No existe la plantilla: ${templatePath}`);
  }

  const template = fs.readFileSync(templatePath, "utf8");

  const values = {
    "[RESTAURANTE]": restaurante.nombre,
    "[META_DESCRIPCION]": `${restaurante.nombre}, menú del día en ${restaurante.municipio}.`,
    "[TIPO_PAGINA]": "Ficha de restaurante",
    "[MUNICIPIO]": restaurante.municipio,
    "[CATEGORIA]": restaurante.categoria,
    "[ESTADO_MENU_PUBLICO]": "Menú actualizado",
    "[MENSAJE_ESTADO]": "Menú del día disponible",
    "[DESCRIPCION_RESTAURANTE]": restaurante.descripcion,
    "[BLOQUE_IMAGEN_PRINCIPAL]": bloqueImagenPrincipal(restaurante),
    "[DIRECCION]": restaurante.direccion,
    "[TELEFONO_PUBLICO]": restaurante.telefonoPublico,
    "[SLUG]": restaurante.slug,
    "[BOTON_WHATSAPP]": boton(
      "primary",
      `https://wa.me/${restaurante.whatsapp}`,
      "Escribir por WhatsApp"
    ),
    "[BOTON_LLAMAR]": boton(
      "",
      `tel:${restaurante.telefonoPublico.replaceAll(" ", "")}`,
      "Llamar"
    ),
    "[BOTON_MAPS]": boton(
      "",
      restaurante.googleMapsUrl,
      "Ver en Google Maps"
    ),
    "[BOTON_CARTA]": boton(
      "accent",
      restaurante.urlCarta,
      "Ver carta"
    ),
    "[HTML_MENU]": menu.html,
    "[HTML_HISTORICO]": htmlHistorico()
  };

  const outputHtml = replaceAllMarkers(template, values);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, outputHtml, "utf8");

  console.log(`Ficha generada correctamente en: ${outputPath}`);
}

main();
```
