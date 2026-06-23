const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const archivoAirtable = path.join(ROOT, "data", "airtable-demo.json");
const archivoBusqueda = path.join(ROOT, "data", "busqueda-menus-hoy.json");

function fallar(mensaje) {
  console.error("ERROR:", mensaje);
  process.exit(1);
}

function leerJson(archivo) {
  if (!fs.existsSync(archivo)) {
    fallar("No existe " + path.relative(ROOT, archivo));
  }

  try {
    return JSON.parse(fs.readFileSync(archivo, "utf8"));
  } catch (error) {
    fallar("JSON no válido: " + path.relative(ROOT, archivo));
  }
}

const airtable = leerJson(archivoAirtable);
const busqueda = leerJson(archivoBusqueda);

if (!Array.isArray(busqueda)) {
  fallar("data/busqueda-menus-hoy.json debe ser una lista");
}

const restaurantes = airtable.restaurantes || [];
const menus = airtable.menus || [];
const publicaciones = airtable.publicaciones || [];

const restaurantesPorId = new Map(restaurantes.map((r) => [r.restaurante_id, r]));
const publicacionesPorMenu = new Map(publicaciones.map((p) => [p.menu_id, p]));

function menuDebePublicarse(menu) {
  const restaurante = restaurantesPorId.get(menu.restaurante_id);
  const publicacion = publicacionesPorMenu.get(menu.menu_id);

  if (!restaurante) return false;
  if (!publicacion) return false;
  if (restaurante.estado_restaurante !== "activo") return false;
  if (!restaurante.activo_en_buscador) return false;
  if (!restaurante.slug) return false;
  if (menu.estado_menu !== "listo_para_publicar") return false;
  if (publicacion.estado_publicacion !== "lista") return false;
  if (menu.requiere_revision_manual === true) return false;

  if (publicacion.publicable_desde) {
    const fechaPublicable = new Date(publicacion.publicable_desde);
    if (fechaPublicable > new Date()) return false;
  }

  return true;
}

const esperados = menus
  .filter(menuDebePublicarse)
  .map((menu) => restaurantesPorId.get(menu.restaurante_id).slug)
  .sort();

const reales = busqueda.map((item) => item.slug).sort();

if (JSON.stringify(esperados) !== JSON.stringify(reales)) {
  fallar("El buscador no coincide con los menús publicables. Esperados: " + esperados.join(", ") + " | Reales: " + reales.join(", "));
}

for (const item of busqueda) {
  if (!item.restaurante) {
    fallar("Hay un resultado sin restaurante");
  }
  if (!item.slug) {
    fallar("Hay un resultado sin slug");
  }
  if (!item.url) {
    fallar("Hay un resultado sin URL");
  }
}

console.log("Validación correcta: el buscador coincide con los menús publicables actuales.");
