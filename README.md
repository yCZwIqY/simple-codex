# simple-codex

Lightweight CLI for bootstrapping and checking a Codex workspace (MVP).

Korean documentation: [README.ko.md](./README.ko.md)

## What It Does

- Installs baseline templates for Codex and agents
- Creates `AGENTS.md` if missing
- Checks local setup health
- Adds and lists prompt files

## Commands

The package binary is `scodex` (legacy alias: `simple-codex`), and the CLI program name is `scodex`.

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

### `prompt add`

Create a new prompt file under `<CODEX_HOME>/prompts`.

```bash
scodex prompt add architect --scope project
```

### `prompt list`

List available prompts.

```bash
scodex prompt list --scope project
```

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
  command/
    setup.ts
    doctor.ts
    prompt.ts
  templates/
  utils/
```

## License

ISC
