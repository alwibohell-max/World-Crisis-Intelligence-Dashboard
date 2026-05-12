import { readFileSync, writeFileSync } from "node:fs";

const globalsPath = "app/globals.css";
const leafletImport = '@import "leaflet/dist/leaflet.css";';
const lines = readFileSync(globalsPath, "utf8").split("\n");
let seenLeafletImport = false;
const normalizedLines = lines.filter((line) => {
  if (line.trim() !== leafletImport) {
    return true;
  }

  if (seenLeafletImport) {
    return false;
  }

  seenLeafletImport = true;
  return true;
});

writeFileSync(globalsPath, normalizedLines.join("\n"));
console.log("Prepared Vercel build CSS: duplicate Leaflet imports removed.");
