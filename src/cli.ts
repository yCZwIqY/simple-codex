#!/usr/bin/env node
import { Command } from "commander";
import { runSetup } from "./commands/setup.js";
import { runDoctor } from "./commands/doctor.js";
import { runPromptAdd, runPromptList } from "./commands/prompt.js";

type Scope = "user" | "project";
function parseScope(v: string): Scope {
  if (v !== "user" && v !== "project") throw new Error(`scope must be one of: user | project (received: ${v})`);
  return v;
}

const program = new Command();

program
  .name("simple-codex")
  .description("A lightweight orchestration layer for the Codex CLI (MVP)")
  .version("0.1.0");

program
  .command("setup")
  .description("Install prompt, skill, and config templates")
  .option("--scope <scope>", "user | project", "project")
  .action(async (opts) => {
    const scope = parseScope(opts.scope);
    await runSetup(scope);
  });

program
  .command("doctor")
  .description("Check installation and configuration status")
  .option("--scope <scope>", "user | project", "project")
  .action(async (opts) => {
    const scope = parseScope(opts.scope);
    await runDoctor(scope);
  });

const prompt = program.command("prompt").description("Manage prompts");

prompt
  .command("add")
  .description("Create a prompt file")
  .argument("<name>", "prompt name")
  .option("--scope <scope>", "user | project", "project")
  .action(async (name, opts) => {
    const scope = parseScope(opts.scope);
    await runPromptAdd(scope, name);
  });

prompt
  .command("list")
  .description("List prompts")
  .option("--scope <scope>", "user | project", "project")
  .action(async (opts) => {
    const scope = parseScope(opts.scope);
    await runPromptList(scope);
  });

program.parseAsync(process.argv).catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
