const fs = require("fs");

const path = require("path");

const archivo = path.join(__dirname, "..", "data", "busqueda-menus-hoy.json");

function fallar(mensaje) {
  console.error("ERROR:", mensaje);
  process.exit(1);
}

if (!fs.existsSync(archivo)) {
  fallar("No existe data/busqueda-menus-hoy.json");
}

let datos;

try {
  datos = JSON.parse(fs.readFileSync(archivo, "utf8"));
} catch (error) {
  fallar("El JSON de búsqueda no es válido");
}

if (!Array.isArray(datos)) {
  fallar("El JSON de búsqueda debe ser una lista");
}

const slugs = datos.map((item) => item.slug);

if (datos.length !== 2) {
  fallar("Se esperaban 2 menús en el buscador demo y hay " + datos.length);
}

if (!slugs.includes("casa-pepe-generado")) {
  fallar("Falta Casa Pepe en el buscador");
}

if (!slugs.includes("pivo-generado")) {
  fallar("Falta Pivo en el buscador");
}

if (slugs.includes("focaccia-generado")) {
  fallar("Focaccia no debería estar publicada porque requiere revisión manual");
}

for (const item of datos) {
  if (!item.restaurante) {
    fallar("Hay un resultado sin restaurante");
  }
  if (!item.slug) {
    fallar("Hay un resultado sin slug");
  }
}

console.log("Validación correcta: buscador demo con Casa Pepe y Pivo, sin Focaccia.");
