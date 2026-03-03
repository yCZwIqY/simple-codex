import path from "node:path";
import { Scope, getTargets } from "../paths.js";
import { exists } from "../utils/fsx.js";
import { log } from "../utils/log.js";

export async function runDoctor(scope: Scope) {
  const t = getTargets(scope);

  const checks: Array<[string, string]> = [
    ["codexHome", t.codexHome],
    ["agentsHome", t.agentsHome],
    ["stateHome", t.stateHome],
    ["AGENTS.md", t.agentsMd],
    ["config.toml", path.join(t.codexHome, "config.toml")],
    ["prompts dir", path.join(t.codexHome, "prompts")],
    ["skills dir", path.join(t.agentsHome, "skills")],
  ];

  let ok = true;
  for (const [name, p] of checks) {
    const e = await exists(p);
    if (e) log.ok(`${name}: ${p}`);
    else {
      ok = false;
      log.warn(`Missing ${name}: ${p}`);
    }
  }

  if (!ok) {
    log.err(`Some components are missing. Run "mycodex setup --scope ${scope}" first.`);
    process.exitCode = 2;
  } else {
    log.ok("All checks passed.");
  }
}
