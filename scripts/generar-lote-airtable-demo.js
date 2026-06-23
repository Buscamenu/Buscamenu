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
  console.log("Resultado validado según los estados actuales de Airtable demo.");
  console.log("Consulta data/lotes-demo.json para ver publicados y retenidos.");
}

main();
