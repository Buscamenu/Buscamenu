const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const archivoAirtable = path.join(ROOT, "data", "airtable-demo.json");
const archivoBusqueda = path.join(ROOT, "data", "busqueda-menus-hoy.json");
const archivoLotes = path.join(ROOT, "data", "lotes-demo.json");

function leerJson(archivo, valorPorDefecto) {
  if (!fs.existsSync(archivo)) {
    return valorPorDefecto;
  }

  return JSON.parse(fs.readFileSync(archivo, "utf8"));
}

const airtable = leerJson(archivoAirtable, {});
const busqueda = leerJson(archivoBusqueda, []);
const lotes = leerJson(archivoLotes, []);

const restaurantes = airtable.restaurantes || [];
const menus = airtable.menus || [];
const publicaciones = airtable.publicaciones || [];

const restaurantesPorId = new Map(restaurantes.map((r) => [r.restaurante_id, r]));
const publicacionesPorMenu = new Map(publicaciones.map((p) => [p.menu_id, p]));
const slugsPublicados = new Set(busqueda.map((item) => item.slug));

const publicados = busqueda.map((item) => ({
  restaurante: item.restaurante,
  slug: item.slug,
  fecha_menu: item.fecha_menu,
  precio_desde: item.precio_desde,
  precio_hasta: item.precio_hasta
}));

const retenidos = [];

for (const menu of menus) {
  const restaurante = restaurantesPorId.get(menu.restaurante_id);
  const publicacion = publicacionesPorMenu.get(menu.menu_id);
  const slug = restaurante ? restaurante.slug : "";

  if (slug && slugsPublicados.has(slug)) {
    continue;
  }

  retenidos.push({
    restaurante: restaurante ? restaurante.nombre : "Restaurante desconocido",
    slug,
    menu_id: menu.menu_id,
    estado_menu: menu.estado_menu || "",
    estado_publicacion: publicacion ? publicacion.estado_publicacion : "",
    motivo_bloqueo: publicacion ? publicacion.motivo_bloqueo : ""
  });
}

const ahora = new Date();

const lote = {
  lote_id: "lote_demo_" + ahora.toISOString().replace(/[:.]/g, "-"),
  generado_en: ahora.toISOString(),
  publicados_total: publicados.length,
  retenidos_total: retenidos.length,
  publicados,
  retenidos
};

lotes.push(lote);

fs.writeFileSync(archivoLotes, JSON.stringify(lotes, null, 2) + "\n");

console.log("Registro de lote demo actualizado: data/lotes-demo.json");
console.log("Publicados:", publicados.length);
console.log("Retenidos:", retenidos.length);
