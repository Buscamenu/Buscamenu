const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const templatePath = path.join(ROOT, "templates", "restaurante-template.html");
const airtableDemoPath = path.join(ROOT, "data", "airtable-demo.json");
const busquedaOutputPath = path.join(ROOT, "data", "busqueda-menus-hoy.json");

function leerJson(filePath) {
if (!fs.existsSync(filePath)) {
throw new Error("No existe el archivo: " + filePath);
}

return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function textoSeguro(value) {
if (value === null || value === undefined) return "";

return String(value)
.split("&").join("&")
.split("<").join("<")
.split(">").join(">")
.split('"').join("&quot;")
.split("'").join("'");
}

function boton(clase, href, texto) {
if (!href) return "";
return '<a class="button ' + clase + '" href="' + href + '">' + texto + "</a>";
}

function bloqueImagenPrincipal(restaurante) {
return [
'<div class="generic-image">',
"  <div>",
'    <div class="icon">🍽️</div>',
"    <h2>" + textoSeguro(restaurante.nombre) + "</h2>",
"    <p>Imagen genérica Buscamenú</p>",
"  </div>",
"</div>"
].join("\n");
}

function htmlHistorico() {
return [
'<div class="history-item">',
"  <span>Histórico pendiente</span>",
"  <strong>Próximamente</strong>",
"</div>"
].join("\n");
}

function listaPlatos(titulo, platos) {
if (!Array.isArray(platos) || platos.length === 0) return "";

const items = platos
.map(function(plato) {
return "        <li>" + textoSeguro(plato) + "</li>";
})
.join("\n");

return [
'    <section class="menu-section">',
"      <h3>" + textoSeguro(titulo) + "</h3>",
"      <ul>",
items,
"      </ul>",
"    </section>"
].join("\n");
}

function formatoPrecio(menu) {
if (menu.precio_desde === null || menu.precio_desde === undefined) return "";

if (menu.precio_hasta !== null && menu.precio_hasta !== undefined && menu.precio_hasta !== menu.precio_desde) {
return String(menu.precio_desde).replace(".", ",") + "–" + String(menu.precio_hasta).replace(".", ",") + " €";
}

return String(menu.precio_desde).replace(".", ",") + " €";
}

function htmlMenu(menu) {
const precio = formatoPrecio(menu);

const secciones = [
listaPlatos("Primeros", menu.primeros),
listaPlatos("Segundos", menu.segundos),
listaPlatos("Postres", menu.postres)
].filter(Boolean).join("\n\n");

const incluidos = [];

if (menu.pan_incluido) incluidos.push("pan");
if (menu.bebida_incluida) incluidos.push("bebida");
if (menu.cafe_incluido) incluidos.push("café");

const textoIncluye = incluidos.length
? "Incluye " + incluidos.join(", ") + "."
: "Consulta condiciones del menú en el restaurante.";

return [
'<section class="menu-dia">',
'  <div class="menu-title-row">',
"    <div>",
'      <p class="eyebrow">Menú de hoy</p>',
"      <h2>" + textoSeguro(menu.titulo_menu || "Menú del día") + "</h2>",
"    </div>",
'    <div class="price">' + textoSeguro(precio) + "</div>",
"  </div>",
"",
'  <div class="menu-grid">',
secciones,
"  </div>",
"",
'  <div class="included">' + textoSeguro(textoIncluye) + "</div>",
"</section>"
].join("\n");
}

function htmlMenus(menus) {
return (menus || []).map(function(menu) {
return htmlMenu(menu);
}).join("\n\n");
}

function replaceAllMarkers(template, values) {
let html = template;

Object.entries(values).forEach(function(entry) {
const marker = entry[0];
const value = entry[1];
html = html.split(marker).join(value || "");
});

return html;
}

function restaurantePorId(restaurantes, restauranteId) {
return restaurantes.find(function(restaurante) {
return restaurante.restaurante_id === restauranteId;
});
}

function menuPorId(menus, menuId) {
return menus.find(function(menu) {
return menu.menu_id === menuId;
});
}

function esPublicable(publicacion, menu, restaurante, ahora) {
if (!publicacion || !menu || !restaurante) return false;
if (publicacion.estado_publicacion !== "lista") return false;
if (menu.estado_menu !== "listo_para_publicar") return false;
if (menu.requiere_revision_manual) return false;
if (restaurante.estado_restaurante !== "activo") return false;
if (!restaurante.activo_en_buscador) return false;
if (!restaurante.slug) return false;

if (publicacion.publicable_desde) {
const fechaPublicable = new Date(publicacion.publicable_desde);
if (fechaPublicable > ahora) return false;
}

return true;
}

function generarFicha(template, restaurante, menus) {
const outputDir = path.join(ROOT, "restaurantes", restaurante.slug);
const outputPath = path.join(outputDir, "index.html");

const telefonoLimpio = String(restaurante.telefono_publico || "").replace(/\s+/g, "");
const whatsapp = restaurante.whatsapp_reservas || "";

const values = {
"[RESTAURANTE]": textoSeguro(restaurante.nombre),
"[META_DESCRIPCION]": textoSeguro(restaurante.nombre + ", menú del día en " + restaurante.municipio + "."),
"[TIPO_PAGINA]": "Ficha de restaurante",
"[MUNICIPIO]": textoSeguro(restaurante.municipio),
"[CATEGORIA]": textoSeguro(restaurante.categoria),
"[ESTADO_MENU_PUBLICO]": "Menú actualizado",
"[MENSAJE_ESTADO]": "Menú del día disponible",
"[DESCRIPCION_RESTAURANTE]": textoSeguro(restaurante.descripcion),
"[BLOQUE_IMAGEN_PRINCIPAL]": bloqueImagenPrincipal(restaurante),
"[DIRECCION]": textoSeguro(restaurante.direccion),
"[TELEFONO_PUBLICO]": textoSeguro(restaurante.telefono_publico),
"[SLUG]": textoSeguro(restaurante.slug),
"[BOTON_WHATSAPP]": boton(
"primary",
whatsapp ? "https://wa.me/" + whatsapp : "",
"Escribir por WhatsApp"
),
"[BOTON_LLAMAR]": boton(
"",
telefonoLimpio ? "tel:" + telefonoLimpio : "",
"Llamar"
),
"[BOTON_MAPS]": boton(
"",
restaurante.google_maps_url,
"Ver en Google Maps"
),
"[BOTON_CARTA]": boton(
"accent",
restaurante.web,
"Ver carta"
),
"[HTML_MENU]": htmlMenus(menus),
"[HTML_HISTORICO]": htmlHistorico()
};

const outputHtml = replaceAllMarkers(template, values);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, outputHtml, "utf8");

return outputPath;
}

function generarBusqueda(items) {
const busqueda = items.map(function(item) {
const restaurante = item.restaurante;
const menu = item.menu;

const platos = []
  .concat(menu.primeros || [])
  .concat(menu.segundos || [])
  .concat(menu.postres || []);

return {
  restaurante: restaurante.nombre,
  slug: restaurante.slug,
  municipio: restaurante.municipio,
  url: "/restaurantes/" + restaurante.slug + "/",
  fecha_menu: menu.fecha_menu,
  estado_menu: menu.estado_menu,
  lat: restaurante.lat,
  lng: restaurante.lng,
  titulo_menu: menu.titulo_menu,
  precio_desde: menu.precio_desde,
  precio_hasta: menu.precio_hasta,
  platos: platos,
  keywords: menu.keywords || [],
  etiquetas: menu.etiquetas || []
};

});

fs.writeFileSync(busquedaOutputPath, JSON.stringify(busqueda, null, 2), "utf8");

return busqueda.length;
}

function main() {
const ahora = new Date();

const template = fs.readFileSync(templatePath, "utf8");
const data = leerJson(airtableDemoPath);

const restaurantes = data.restaurantes || [];
const menus = data.menus || [];
const publicaciones = data.publicaciones || [];

const publicables = [];

publicaciones.forEach(function(publicacion) {
const restaurante = restaurantePorId(restaurantes, publicacion.restaurante_id);
const menu = menuPorId(menus, publicacion.menu_id);

if (esPublicable(publicacion, menu, restaurante, ahora)) {
  publicables.push({
    publicacion: publicacion,
    restaurante: restaurante,
    menu: menu
  });
}

});

if (publicables.length === 0) {
console.log("No hay menús listos para publicar. No se genera ningún lote.");
return;
}

const gruposPorRestaurante = new Map();

publicables.forEach(function(item) {
const key = item.restaurante.restaurante_id;
if (!gruposPorRestaurante.has(key)) {
gruposPorRestaurante.set(key, {
restaurante: item.restaurante,
menus: []
});
}
gruposPorRestaurante.get(key).menus.push(item.menu);
});

gruposPorRestaurante.forEach(function(grupo) {
const outputPath = generarFicha(template, grupo.restaurante, grupo.menus);
console.log("Ficha generada: " + outputPath);
});

const totalBusqueda = generarBusqueda(publicables);

console.log("JSON de búsqueda actualizado: " + busquedaOutputPath);
console.log("Menús incluidos en el lote demo: " + totalBusqueda);
}

main();
