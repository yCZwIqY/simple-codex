import path from "node:path";
import { Scope, getTargets } from "../paths.js";
import { ensureDir, exists, readText, writeText } from "../utils/fsx.js";
import { log } from "../utils/log.js";

function promptDir(scope: Scope) {
  const t = getTargets(scope);
  return path.join(t.codexHome, "prompts");
}

export async function runPromptAdd(scope: Scope, name: string) {
  if (!name || !/^[a-z0-9-_]+$/i.test(name)) {
    throw new Error("Prompt name can contain only letters, numbers, '-', and '_'. Example: architect, code-review");
  }

  const dir = promptDir(scope);
  await ensureDir(dir);

  const file = path.join(dir, `${name}.md`);
  if (await exists(file)) {
    log.warn(`Already exists: ${file}`);
    return;
  }

  const content = `# ${name}\n\n- 역할: (여기에 설명)\n- 출력 규칙: (여기에 규칙)\n`;
  await writeText(file, content);
  log.ok(`Created prompt: ${file}`);
}

export async function runPromptList(scope: Scope) {
  const dir = promptDir(scope);
  if (!(await exists(dir))) {
    log.warn(`Prompt directory does not exist: ${dir}`);
    return;
  }
  const { promises: fs } = await import("node:fs");
  const items = await fs.readdir(dir);
  const md = items.filter((x) => x.endsWith(".md")).sort();
  if (md.length === 0) {
    log.info("No prompts found yet.");
    return;
  }
  for (const f of md) console.log(`- ${f.replace(/\.md$/, "")}`);
}
