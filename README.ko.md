# simple-codex

프로젝트에서 Codex 사용 방식을 표준화하기 위한 경량 CLI입니다.

English documentation: [README.md](./README.md)

## 링크

- npm: https://www.npmjs.com/package/simple-codex
- 소개 페이지: https://yczwiqy.github.io/simple-codex/

## 목적

`simple-codex`는 공유된 설정/프롬프트/에이전트 규칙을 설치해 AI 보조 개발 워크플로우를 구조화합니다.

핵심 가치:
- 일관된 프로젝트 컨텍스트
- 역할 분리 프롬프트 (`architect`, `executor`, `review`)
- 재현 가능한 설정/검증 절차

## 주요 기능

- Codex/Agent 기본 템플릿 설치
- `AGENTS.md`가 없으면 자동 생성
- 워크스페이스 상태 점검
- 프롬프트 파일 생성 및 목록 조회
- 고정 비대화형 워크플로우 실행 (`architect -> executor -> review`)

## 명령어

패키지 실행 바이너리는 `scodex`입니다 (레거시 별칭: `simple-codex`).

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

점검 항목:
- `codexHome`, `agentsHome`, `stateHome`
- `AGENTS.md`
- `<CODEX_HOME>/config.toml`
- `<CODEX_HOME>/prompts/{architect,executor,review}.md`
- `<AGENTS_HOME>/skills`

### `prompt add`

`<CODEX_HOME>/prompts`에 프롬프트 파일을 만듭니다.

```bash
scodex prompt add my-role --scope project
```

### `prompt list`

`<CODEX_HOME>/prompts`의 프롬프트 목록을 출력합니다.

```bash
scodex prompt list --scope project
```

### `workflow`

고정 순서로 실행합니다:
1. `architect`
2. `executor` (architect 출력 전달)
3. `review` (architect + executor 출력 전달)

최종 `review` 결과를 출력합니다.

```bash
scodex workflow --scope project --task "이 프로젝트를 소개하는 HTML 파일 생성"
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
  commands/
    setup.ts
    doctor.ts
    prompt.ts
    workflow.ts
  templates/
  utils/
```

## 로드맵

- Stage 1: setup/doctor/prompt 템플릿 시스템
- Stage 2 (현재): 고정 멀티 역할 워크플로우 + 출력 전달
- Stage 3 (계획): 실행 상태 저장 + 재개/재실행
- Stage 4 (계획): DAG 워크플로우 + 분기 + 안전 병렬 실행

## License

ISC
