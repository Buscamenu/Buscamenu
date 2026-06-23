const { execFileSync } = require("child_process");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function runScript(nombre) {
  const scriptPath = path.join(ROOT, "scripts", nombre);

  console.log("");
  console.log("Ejecutando:", nombre);

  execFileSync("node", [scriptPath], {
    cwd: ROOT,
    stdio: "inherit"
  });
}

function main() {
  console.log("Iniciando lote demo desde datos tipo Airtable...");

  runScript("generar-desde-airtable-demo.js");
  runScript("validar-busqueda-demo.js");
  runScript("registrar-lote-airtable-demo.js");
  runScript("validar-lotes-demo.js");

  console.log("");
  console.log("Lote Airtable demo generado y validado correctamente.");
  console.log("Resultado esperado:");
  console.log("- Casa Pepe Demo publicado");
  console.log("- Pivo Demo publicado");
  console.log("- Focaccia Demo publicado tras revisión");
}

main();
