import path from "node:path";
import os from "node:os";

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
  return path.join(process.cwd(), "templates");
}