# simple-codex

A lightweight CLI to standardize Codex usage in a project.

Korean documentation: [README.ko.md](./README.ko.md)

## Links

- npm: https://www.npmjs.com/package/simple-codex
- Intro page: https://yczwiqy.github.io/simple-codex/

## Purpose

`simple-codex` provides a structured workflow for AI-assisted development by installing shared configuration, prompts, and agent rules.

It helps teams run Codex with:
- consistent project context
- role-separated prompts (`architect`, `executor`, `review`)
- reproducible setup and validation

## Features

- Install baseline templates for Codex and agents
- Create `AGENTS.md` if missing
- Validate workspace health
- Add and list prompt files
- Run a fixed non-interactive workflow (`architect -> executor -> review`)
- Persist workflow run state and resume/replay by run id

## Commands

The package binary is `scodex` (legacy alias: `simple-codex`).

### `setup`

Install prompt/skill/config templates.

```bash
scodex setup --scope project
# or
scodex setup --scope user
```

### `doctor`

Validate required files and directories.

```bash
scodex doctor --scope project
```

Checks:
- `codexHome`, `agentsHome`, `stateHome`
- `AGENTS.md`
- `<CODEX_HOME>/config.toml`
- `<CODEX_HOME>/prompts/{architect,executor,review}.md`
- `<AGENTS_HOME>/skills`

### `prompt add`

Create a prompt file under `<CODEX_HOME>/prompts`.

```bash
scodex prompt add my-role --scope project
```

### `prompt list`

List prompts under `<CODEX_HOME>/prompts`.

```bash
scodex prompt list --scope project
```

### `workflow`

Run a fixed sequence:
1. `architect`
2. `executor` (receives architect output)
3. `review` (receives architect + executor outputs)

Prints the final `review` output.

```bash
scodex workflow --scope project --mode <new|resume|replay> [--run-id <id>] [--task "<task>"]
```

Modes:
- `new`: starts a new run. `--task` is required.
- `resume`: continues a failed/incomplete run from the first non-succeeded step. Uses `--run-id` or `LATEST`.
- `replay`: starts a new run from a previous run's task (or a new `--task`). Uses source `--run-id` or `LATEST`.

Examples:

```bash
# start a new run
scodex workflow --scope project --mode new --task "Implement JWT refresh token rotation with integration tests"

# resume latest run
scodex workflow --scope project --mode resume

# resume a specific run
scodex workflow --scope project --mode resume --run-id <run-id>

# replay latest run with same task
scodex workflow --scope project --mode replay

# replay a specific run with a new task
scodex workflow --scope project --mode replay --run-id <run-id> --task "Refactor payment webhook handler for idempotency and retry safety"
```

Workflow state files:
- Run root: `<STATE_HOME>/workflow-runs`
- Per-run state: `<STATE_HOME>/workflow-runs/<run-id>/state.json`
- Latest pointer: `<STATE_HOME>/workflow-runs/LATEST`
- `resume`/`replay` default to `LATEST` when `--run-id` is omitted.

## Scope Behavior

`--scope project`
- `codexHome`: `<cwd>/.codex`
- `agentsHome`: `<cwd>/.agents`
- `agentsMd`: `<cwd>/AGENTS.md`
- `stateHome`: `<cwd>/.myx`

`--scope user`
- `codexHome`: `~/.codex`
- `agentsHome`: `~/.agents`
- `agentsMd`: `<cwd>/AGENTS.md`
- `stateHome`: `~/.myx`

## Development

```bash
pnpm install
pnpm build
```

Run compiled CLI:

```bash
node dist/cli.js --help
```

## Project Structure

```text
src/
  cli.ts
  commands/
    setup.ts
    doctor.ts
    prompt.ts
    workflow.ts
  templates/
  utils/
```

## Roadmap

- Stage 1: setup/doctor/prompt template system
- Stage 2 (done): fixed multi-role workflow with output handoff
- Stage 3 (current): persisted run state and resume/replay
- Stage 4 (planned): DAG workflow, branching, parallel safe execution

## License

ISC
