const fs = require("fs");
const path = require("path");

const archivo = path.join(__dirname, "..", "data", "airtable-demo.json");
const datos = JSON.parse(fs.readFileSync(archivo, "utf8"));

const menu = datos.menus.find((item) => item.menu_id === "menu_003");
const publicacion = datos.publicaciones.find((item) => item.publicacion_id === "pub_003");

if (!menu) {
  console.error("ERROR: No se encontró menu_003");
  process.exit(1);
}

if (!publicacion) {
  console.error("ERROR: No se encontró pub_003");
  process.exit(1);
}

const fecha = new Date(Date.now() - 60000).toISOString();

menu.estado_menu = "listo_para_publicar";
menu.requiere_revision_manual = false;
menu.publicable_desde = fecha;
menu.hora_publicacion = fecha;

if (!menu.texto_interpretado.includes("Versión corregida")) {
  menu.texto_interpretado = menu.texto_interpretado + "\n\nVersión corregida tras revisión del restaurante.";
}

publicacion.estado_publicacion = "lista";
publicacion.publicable_desde = fecha;
publicacion.motivo_bloqueo = "";
publicacion.incluido_en_commit = false;
publicacion.publicado_en = null;

fs.writeFileSync(archivo, JSON.stringify(datos, null, 2) + "\n");

console.log("Escenario aplicado: Focaccia corregida y lista para republicar.");
