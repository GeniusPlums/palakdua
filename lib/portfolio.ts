import fs from "node:fs";
import path from "node:path";

export type PortfolioMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  icon: string;
  sourcePath: string;
  complete: boolean;
};

const contentDir = path.join(process.cwd(), "content");

export function loadPortfolioMeta(): PortfolioMeta {
  const raw = fs.readFileSync(
    path.join(contentDir, "portfolio-meta.json"),
    "utf8",
  );
  return JSON.parse(raw) as PortfolioMeta;
}

export function loadPortfolioBodyHtml(): string {
  return fs.readFileSync(
    path.join(contentDir, "portfolio-body.html"),
    "utf8",
  );
}
