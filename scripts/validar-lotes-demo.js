const fs = require("fs");
const path = require("path");

const archivo = path.join(__dirname, "..", "data", "lotes-demo.json");

function fallar(mensaje) {
  console.error("ERROR:", mensaje);
  process.exit(1);
}

if (!fs.existsSync(archivo)) {
  fallar("No existe data/lotes-demo.json");
}

let lotes;

try {
  lotes = JSON.parse(fs.readFileSync(archivo, "utf8"));
} catch (error) {
  fallar("data/lotes-demo.json no es JSON válido");
}

if (!Array.isArray(lotes)) {
  fallar("data/lotes-demo.json debe ser una lista");
}

if (lotes.length < 1) {
  fallar("No hay ningún lote registrado");
}

const ultimo = lotes[lotes.length - 1];

if (ultimo.publicados_total !== 3) {
  fallar("El último lote debería tener 3 publicados");
}

if (ultimo.retenidos_total !== 0) {
  fallar("El último lote debería tener 0 retenidos");
}

const publicados = ultimo.publicados || [];
const retenidos = ultimo.retenidos || [];

const slugsPublicados = publicados.map((item) => item.slug);
const slugsRetenidos = retenidos.map((item) => item.slug);

if (!slugsPublicados.includes("casa-pepe-generado")) {
  fallar("Casa Pepe debería estar publicado en el último lote");
}

if (!slugsPublicados.includes("pivo-generado")) {
  fallar("Pivo debería estar publicado en el último lote");
}

if (!slugsPublicados.includes("focaccia-generado")) {
  fallar("Focaccia debería estar publicado en el último lote");
}

console.log("Validación correcta: último lote con 3 publicados y 0 retenidos.");
