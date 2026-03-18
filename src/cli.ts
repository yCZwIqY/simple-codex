#!/usr/bin/env node
import { Command } from 'commander';
import { runSetup } from './commands/setup.js';
import { runDoctor } from './commands/doctor.js';
import { runPromptAdd, runPromptList } from './commands/prompt.js';
import { runWorkflow } from './commands/workflow.js';

type Scope = "user" | "project";
function parseScope(v: string): Scope {
  if (v !== "user" && v !== "project") throw new Error(`scope must be one of: user | project (received: ${v})`);
  return v;
}

const program = new Command();

program
  .name("scodex")
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

program
  .command('workflow')
  .description('Run workflow (architect -> executor -> review)')
  .option('--scope <scope>', 'user | project', 'project')
  .option('--mode <mode>', 'new | resume | replay', 'new')
  .option('--run-id <runId>', 'Target run id (optional, defaults to LATEST)')
  .option('--task <task>', 'Task description (required for mode=new, optional for replay)')
  .action(async (opts) => {
    const scope = parseScope(opts.scope);
    const mode = parseWorkflowMode(String(opts.mode));

    await runWorkflow(scope, {
      mode,
      runId: opts.runId ? String(opts.runId) : undefined,
      task: opts.task ? String(opts.task) : undefined,
    });
  });

type WorkflowMode = 'new' | 'resume' | 'replay';

function parseWorkflowMode(v: string): WorkflowMode {
  if (v !== 'new' && v !== 'resume' && v !== 'replay') throw new Error(`mode must be one of: new | resume | replay (received: ${v})`);
  return v as WorkflowMode;
}

program.parseAsync(process.argv).catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
