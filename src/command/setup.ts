import path from "node:path";
import { promises as fs } from "node:fs";
import { Scope, getTargets, templatesRoot } from "../paths.js";
import { copyDir, ensureDir, exists, readText, writeTextIfMissing } from "../utils/fsx.js";
import { log } from "../utils/log.js";

export async function runSetup(scope: Scope) {
  const t = getTargets(scope);
  const tpl = templatesRoot();

  // 기본 디렉터리
  await ensureDir(t.codexHome);
  await ensureDir(t.agentsHome);
  await ensureDir(t.stateHome);

  // 템플릿 복사: codex/, agents/
  const srcCodex = path.join(tpl, "codex");
  const srcAgents = path.join(tpl, "agents");

  if (!(await exists(srcCodex)) || !(await exists(srcAgents))) {
    throw new Error(`Could not find templates/ directory. Current working directory: ${process.cwd()}`);
  }

  await copyDir(srcCodex, t.codexHome);
  await copyDir(srcAgents, t.agentsHome);

  // AGENTS.md
  const agentsTplPath = path.join(tpl, "AGENTS.md");
  const agentsTpl = await fs.readFile(agentsTplPath, "utf8");
  const created = await writeTextIfMissing(t.agentsMd, agentsTpl);
  if (created) log.ok(`Created AGENTS.md: ${t.agentsMd}`);
  else log.info(`AGENTS.md already exists: ${t.agentsMd}`);

  // 안내
  log.ok(`Setup complete (scope=${scope})`);
  log.info(`CODEX_HOME: ${t.codexHome}`);
  log.info(`AGENTS_HOME: ${t.agentsHome}`);
  log.info(`STATE_HOME: ${t.stateHome}`);

  // project scope면 실행 힌트
  if (scope === "project") {
    log.info(`Example: CODEX_HOME=./.codex codex -c model_instructions_file="./AGENTS.md"`);
  } else {
    log.info(`Example: codex -c model_instructions_file="./AGENTS.md"`);
  }
}
