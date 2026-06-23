const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const archivoAirtable = path.join(ROOT, "data", "airtable-demo.json");
const archivoLotes = path.join(ROOT, "data", "lotes-demo.json");

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
const lotes = leerJson(archivoLotes);

if (!Array.isArray(lotes)) {
  fallar("data/lotes-demo.json debe ser una lista");
}

if (lotes.length < 1) {
  fallar("No hay ningún lote registrado");
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

const esperadosPublicados = [];
const esperadosRetenidos = [];

for (const menu of menus) {
  const restaurante = restaurantesPorId.get(menu.restaurante_id);
  if (!restaurante || !restaurante.slug) continue;

  if (menuDebePublicarse(menu)) {
    esperadosPublicados.push(restaurante.slug);
  } else {
    esperadosRetenidos.push(restaurante.slug);
  }
}

esperadosPublicados.sort();
esperadosRetenidos.sort();

const ultimo = lotes[lotes.length - 1];
const publicados = ultimo.publicados || [];
const retenidos = ultimo.retenidos || [];

const realesPublicados = publicados.map((item) => item.slug).sort();
const realesRetenidos = retenidos.map((item) => item.slug).sort();

if (ultimo.publicados_total !== esperadosPublicados.length) {
  fallar("El último lote debería tener " + esperadosPublicados.length + " publicados y tiene " + ultimo.publicados_total);
}

if (ultimo.retenidos_total !== esperadosRetenidos.length) {
  fallar("El último lote debería tener " + esperadosRetenidos.length + " retenidos y tiene " + ultimo.retenidos_total);
}

if (JSON.stringify(realesPublicados) !== JSON.stringify(esperadosPublicados)) {
  fallar("Publicados del lote no coinciden. Esperados: " + esperadosPublicados.join(", ") + " | Reales: " + realesPublicados.join(", "));
}

if (JSON.stringify(realesRetenidos) !== JSON.stringify(esperadosRetenidos)) {
  fallar("Retenidos del lote no coinciden. Esperados: " + esperadosRetenidos.join(", ") + " | Reales: " + realesRetenidos.join(", "));
}

console.log("Validación correcta: el último lote coincide con los estados actuales de Airtable demo.");
