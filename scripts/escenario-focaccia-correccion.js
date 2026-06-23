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

menu.estado_menu = "en_revision_por_correccion";
menu.requiere_revision_manual = true;
menu.publicable_desde = null;

if (!menu.texto_original.includes("CORRECCIÓN recibida por WhatsApp")) {
  menu.texto_original = menu.texto_original + "\n\nCORRECCIÓN recibida por WhatsApp: revisar ingredientes y precio antes de republicar.";
}

publicacion.estado_publicacion = "retirada_por_correccion";
publicacion.publicable_desde = null;
publicacion.motivo_bloqueo = "correccion_recibida";
publicacion.incluido_en_commit = false;
publicacion.publicado_en = null;

fs.writeFileSync(archivo, JSON.stringify(datos, null, 2) + "\n");

console.log("Escenario aplicado: Focaccia retirada por corrección y enviada a revisión.");
