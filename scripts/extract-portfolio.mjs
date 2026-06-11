import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const candidates = [
  path.join(root, "index.html"),
  path.join(root, "source", "index.html"),
];

const sourcePath = candidates.find((p) => {
  try {
    return fs.statSync(p).size > 1000;
  } catch {
    return false;
  }
});

if (!sourcePath) {
  console.error("No portfolio HTML found. Add index.html or source/index.html.");
  process.exit(1);
}

let html = fs.readFileSync(sourcePath, "utf8");
const docStart = html.search(/<!DOCTYPE\s+html/i);
if (docStart > 0) {
  html = html.slice(docStart);
}

const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
const css = styleMatch?.[1]?.trim() ?? "";

const bodyClosed = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyHtml = "";
let complete = false;

if (bodyClosed) {
  bodyHtml = bodyClosed[1].trim();
  complete = true;
} else {
  const bodyOpen = html.match(/<body[^>]*>([\s\S]*)$/i);
  bodyHtml = bodyOpen?.[1]?.trim() ?? "";
}

const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
const descMatch = html.match(
  /name=["']description["']\s+content=["']([^"']*)["']/i,
);
const ogTitleMatch = html.match(
  /property=["']og:title["']\s+content=["']([^"']*)["']/i,
);
const ogDescMatch = html.match(
  /property=["']og:description["']\s+content=["']([^"']*)["']/i,
);
const iconMatch = html.match(
  /<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)["']/i,
);

const metadata = {
  title: titleMatch?.[1] ?? "Palak Dua",
  description: descMatch?.[1] ?? "",
  ogTitle: ogTitleMatch?.[1] ?? titleMatch?.[1] ?? "",
  ogDescription: ogDescMatch?.[1] ?? descMatch?.[1] ?? "",
  icon: iconMatch?.[1] ?? "",
  sourcePath: path.relative(root, sourcePath),
  complete,
};

const contentDir = path.join(root, "content");
fs.mkdirSync(contentDir, { recursive: true });

fs.writeFileSync(path.join(root, "public", "portfolio.css"), `${css}\n`);
fs.writeFileSync(
  path.join(root, "app", "globals.css"),
  "/* Portfolio styles are served from /portfolio.css */\n",
);
fs.writeFileSync(path.join(contentDir, "portfolio-body.html"), bodyHtml);
fs.writeFileSync(
  path.join(contentDir, "portfolio-meta.json"),
  JSON.stringify(metadata, null, 2),
);

console.log(`Extracted from ${metadata.sourcePath}`);
console.log(`  CSS: ${css.length} chars`);
console.log(`  Body: ${bodyHtml.length} chars (${complete ? "complete" : "TRUNCATED"})`);

if (!complete) {
  console.warn(
    "\nWarning: HTML body is incomplete (missing </body>). Re-save the full index.html and re-run npm run extract.",
  );
}
