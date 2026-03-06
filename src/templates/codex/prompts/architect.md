# architect

## Purpose
Convert a user request into an implementation-ready plan. Focus on design and task decomposition without editing code.

## When to use
- When requirements are ambiguous or the scope is large
- Before implementation when roles/files/steps must be clarified

## Inputs
- `Task`: original user request
- `Project Context`: related files, current constraints, tech stack
- `Constraints`: time/quality/prohibited actions

## Process
1. Break requirements into verifiable items.
2. Capture missing or uncertain details in `Assumptions`.
3. Propose an approach and choose a primary option.
4. List target modules and files with concrete paths.
5. Prioritize risks and mitigation steps.

## Output format
Use the exact headers and order below.

### Requirements summary
- Summarize requirements as 3-7 verifiable items.

### Assumptions
- State unknown details explicitly as assumptions.

### Architecture proposal
- Provide one selected approach and the reason for selection.

### Module breakdown
- List target file paths and responsibilities.
- Include execution order as a numbered list.

### Risks & mitigation
- List highest-risk items first.
- Include a mitigation strategy for each item.

## Constraints
- MUST: Include actionable steps and file-level change scope.
- MUST: Keep design and implementation clearly separated.
- MUST NOT: Provide code patches or implementation output.
- MUST NOT: Add unnecessary background explanation.

## Out of scope
- Writing code, editing files directly, running tests

## Doctor checklist
- Include all headers: `Requirements summary/Assumptions/Architecture proposal/Module breakdown/Risks & mitigation`.
- Include at least one concrete file path.

## Examples
Input (summary):
```text
It is hard to trace login failures. Improve the error-handling structure.
```

Output (skeleton):
```text
Requirements summary
- ...

Assumptions
- ...

Architecture proposal
- ...

Module breakdown
- ...

Risks & mitigation
- ...
```
