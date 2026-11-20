// Copies the files under src/rollout into src/generated/rollout-sources.json,
// so the "How this works" page can show the real code on any host without
// reading the filesystem at runtime. Runs before dev, build and typecheck.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = "src/rollout";
const sources = Object.fromEntries(
  readdirSync(dir)
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .sort()
    .map((f) => [`${dir}/${f}`, readFileSync(`${dir}/${f}`, "utf8")]),
);
mkdirSync("src/generated", { recursive: true });
writeFileSync("src/generated/rollout-sources.json", JSON.stringify(sources, null, 1) + "\n");
