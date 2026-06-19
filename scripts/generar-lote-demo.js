```js
const { execFileSync } = require("child_process");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function runScript(scriptPath) {
  console.log(`\nEjecutando: ${scriptPath}`);

  execFileSync("node", [scriptPath], {
    cwd: ROOT,
    stdio: "inherit"
  });
}

function main() {
  console.log("Iniciando generación demo por lote...");

  runScript(path.join(ROOT, "scripts", "generar-ficha-demo.js"));
  runScript(path.join(ROOT, "scripts", "generar-busqueda-demo.js"));

  console.log("\nLote demo generado correctamente.");
  console.log("Archivos esperados:");
  console.log("- restaurantes/casa-pepe-generado/index.html");
  console.log("- data/busqueda-menus-hoy.json");
}

main();
```
