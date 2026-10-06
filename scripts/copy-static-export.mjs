import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const exportDirectory = path.join(projectRoot, "out");
const pagesDirectory = path.join(projectRoot, "docs");

await Promise.all([
  access(path.join(exportDirectory, "index.html")),
  access(path.join(exportDirectory, "CNAME")),
  access(path.join(exportDirectory, ".nojekyll")),
]);

await rm(pagesDirectory, { recursive: true, force: true });
await mkdir(pagesDirectory, { recursive: true });
await cp(exportDirectory, pagesDirectory, { recursive: true });

console.log("Static GitHub Pages site copied to docs/.");
