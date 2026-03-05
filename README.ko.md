# simple-codex

Codex 작업 환경을 빠르게 초기화하고 상태를 점검하는 경량 CLI 도구(MVP)입니다.

영문 문서: [README.md](./README.md)

## 주요 기능

- Codex/Agent 기본 템플릿 설치
- `AGENTS.md`가 없으면 자동 생성
- 설치/구성 상태 점검
- 프롬프트 파일 생성 및 목록 조회

## 명령어

패키지 실행 바이너리는 `scodex`(레거시 별칭: `simple-codex`)이며, CLI 내부 프로그램명도 `scodex`입니다.

### `setup`

프롬프트/스킬/설정 템플릿을 설치합니다.

```bash
scodex setup --scope project
# 또는
scodex setup --scope user
```

### `doctor`

필수 파일/디렉터리 상태를 점검합니다.

```bash
scodex doctor --scope project
```

### `prompt add`

`<CODEX_HOME>/prompts`에 새 프롬프트 파일을 만듭니다.

```bash
scodex prompt add architect --scope project
```

### `prompt list`

사용 가능한 프롬프트 목록을 출력합니다.

```bash
scodex prompt list --scope project
```

## Scope 동작

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

## 개발

```bash
pnpm install
pnpm build
```

빌드된 CLI 실행:

```bash
node dist/cli.js --help
```

## 프로젝트 구조

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
