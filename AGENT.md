

# simple-codex — Codex CLI 이해용 요약

## 목적

`simple-codex`는 OpenAI Codex CLI 위에서 동작하는 **개발 워크플로우 오케스트레이션 도구**이다.

Codex CLI는 터미널에서 실행되는 AI 코딩 에이전트로,
로컬 코드 읽기, 수정, 실행 등을 수행할 수 있다. ([밀버스][1])

`simple-codex`는 **여러 AI 작업 단계를 구조화하여 실행**한다.

---

# 핵심 개념

## 1️⃣ Command

사용자가 실행하는 명령

예

```
scodex create-component EmailInput
```

---

## 2️⃣ Context Engine

Codex가 작업하기 전에 **프로젝트 컨텍스트를 분석**

수집 정보

```
project structure
coding patterns
dependencies
project rules
```

예

```
src/
components/
hooks/
utils/
```

---

## 3️⃣ Agent Workflow

simple-codex는 하나의 작업을 **여러 에이전트 단계로 분해**한다.

```
planner → coder → reviewer → fixer
```

### planner

작업 계획 생성

```
files to create
changes to apply
dependencies
```

### coder

코드 생성 또는 수정

### reviewer

코드 규칙 검사

```
lint
type safety
project conventions
```

### fixer

오류 수정

---

# 실행 흐름

```
User Command
    ↓
Context Engine
    ↓
Agent Planner
    ↓
Agent Coder
    ↓
Agent Reviewer
    ↓
Final Code Changes
```

---

# Codex CLI와의 관계

Codex CLI는 기본적으로 다음 루프 구조를 가진다.

```
Think
→ Tool Call
→ Observe
→ Repeat
```

이 구조는 작업이 완료될 때까지 반복된다. ([PromptLayer][2])

`simple-codex`는 이 루프 위에서 **구조화된 workflow를 제공한다.**

---

# mycodex의 역할

기본 Codex CLI

```
prompt → code
```

mycodex

```
command → context → agents → code
```

---

# 주요 기능

### 프로젝트 컨텍스트 분석

```
file tree scan
pattern detection
dependency analysis
```

### 워크플로우 자동화

```
component generation
refactor workflow
code review automation
```

### 규칙 기반 코드 생성

```
eslint rules
typescript patterns
project conventions
```

---

# 목표

AI가 **프로젝트 규칙과 구조를 이해한 상태로 코드 작업을 수행하도록 만드는 것**

---

## Codex CLI용 초간단 버전 (진짜 최소)

만약 **agent.md 같은 파일에 넣는다면** 이 정도도 가능함.

```
mycodex is a workflow orchestrator for Codex CLI.

Goal:
execute structured coding workflows instead of single prompts.

Pipeline:
command → context → planner → coder → reviewer → result

Context engine analyzes:
- project structure
- coding patterns
- dependencies
- project rules

Agents:
planner: create task plan
coder: generate or edit code
reviewer: validate code quality
fixer: resolve issues

Purpose:
produce code that follows the existing project architecture.
```
