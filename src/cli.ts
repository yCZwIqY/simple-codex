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
  .description("Codex CLI를 위한 가벼운 오케스트레이션 레이어(MVP)")
  .version("0.1.0");

program
  .command("setup")
  .description("프롬프트/스킬/설정 템플릿 설치")
  .option("--scope <scope>", "user | project", "project")
  .action(async (opts) => {
    const scope = parseScope(opts.scope);
    await runSetup(scope);
  });

program
  .command("doctor")
  .description("설치/구성 상태 점검")
  .option("--scope <scope>", "user | project", "project")
  .action(async (opts) => {
    const scope = parseScope(opts.scope);
    await runDoctor(scope);
  });

const prompt = program.command("prompt").description("프롬프트 관리");

prompt
  .command("add")
  .description("프롬프트 파일 생성")
  .argument("<name>", "prompt name")
  .option("--scope <scope>", "user | project", "project")
  .action(async (name, opts) => {
    const scope = parseScope(opts.scope);
    await runPromptAdd(scope, name);
  });

prompt
  .command("list")
  .description("프롬프트 목록")
  .option("--scope <scope>", "user | project", "project")
  .action(async (opts) => {
    const scope = parseScope(opts.scope);
    await runPromptList(scope);
  });

program.parseAsync(process.argv).catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
