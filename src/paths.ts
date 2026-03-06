import path from "node:path";
import os from "node:os";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export type Scope = "user" | "project";

export function getTargets(scope: Scope, cwd = process.cwd()) {
  if (scope === "project") {
    return {
      codexHome: path.join(cwd, ".codex"),
      agentsHome: path.join(cwd, ".agents"),
      agentsMd: path.join(cwd, "AGENTS.md"),
      stateHome: path.join(cwd, ".myx"),
    };
  }
  const home = os.homedir();
  return {
    codexHome: path.join(home, ".codex"),
    agentsHome: path.join(home, ".agents"),
    agentsMd: path.join(cwd, "AGENTS.md"),
    stateHome: path.join(home, ".myx"),
  };
}

export function templatesRoot() {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(process.cwd(), "templates"),
    path.join(process.cwd(), "src", "templates"),
    path.join(moduleDir, "templates"),
  ];

  for (const p of candidates) {
    if (existsSync(p)) return p;
  }

  return candidates[0];
}
